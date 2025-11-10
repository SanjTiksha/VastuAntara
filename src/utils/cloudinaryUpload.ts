export async function uploadToCloudinary(file: File, folder = 'vastu'): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !preset) {
    throw new Error('Missing Cloudinary configuration. Please set VITE_CLOUDINARY_* env vars.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', preset)
  if (folder) {
    formData.append('folder', folder)
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Upload to Cloudinary failed.')
  }

  const data = await response.json()

  if (!data.secure_url) {
    throw new Error('Upload to Cloudinary failed.')
  }

  return data.secure_url as string
}
