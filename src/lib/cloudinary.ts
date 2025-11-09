type CloudinaryUploadInfo = {
  public_id: string
  secure_url: string
  thumbnail_url?: string
  [key: string]: unknown
}

type CloudinaryWidgetResult = {
  event: string
  info: CloudinaryUploadInfo
}

type CloudinaryWidget = {
  open: () => void
}

type CloudinaryGlobal = {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: Error | null, result: CloudinaryWidgetResult) => void,
  ) => CloudinaryWidget
}

type CloudinaryWindow = typeof window & {
  cloudinary?: CloudinaryGlobal
}

export const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export function cloudinaryTransform(urlOrPublicId?: string | null, options = 'c_fill,w_auto,q_auto,f_auto') {
  if (!urlOrPublicId) return ''

  if (urlOrPublicId.startsWith('http')) {
    return options ? `${urlOrPublicId}` : urlOrPublicId
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${options}/${urlOrPublicId}`
}

export function openCloudinaryWidget(onSuccess: (info: CloudinaryUploadInfo) => void, folder = 'vastuantara') {
  if (typeof window === 'undefined') {
    console.warn('Cloudinary widget not available')
    return
  }

  const cloudinaryWindow = window as CloudinaryWindow
  if (!cloudinaryWindow.cloudinary) {
    console.warn('Cloudinary widget not available')
    return
  }

  const widget = cloudinaryWindow.cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      folder,
      sources: ['local', 'url', 'camera', 'google_drive', 'facebook'],
      multiple: false,
      clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'mp4'],
      maxFileSize: 10_000_000,
    },
    (error: Error | null, result: CloudinaryWidgetResult) => {
      if (!error && result && result.event === 'success') {
        onSuccess(result.info)
      }
    },
  )

  widget.open()
}

