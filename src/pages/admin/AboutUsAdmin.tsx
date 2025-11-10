import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AdminToolbar from '../../components/Admin/AdminToolbar'
import Spinner from '../../components/Spinner'
import useAuth from '../../hooks/useAuth'
import { fetchAboutUs, updateAboutUs, type AboutUsContent } from '../../services/aboutUs'
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'

interface AboutUsFormState {
  ownerName_en: string
  ownerName_mr: string
  ownerPhoto: string
  officePhoto: string
  careerDetails_en: string
  careerDetails_mr: string
  vision_en: string
  vision_mr: string
  mission_en: string
  mission_mr: string
  websitePurpose_en: string
  websitePurpose_mr: string
  messageFromOwner_en: string
  messageFromOwner_mr: string
}

const EMPTY_FORM: AboutUsFormState = {
  ownerName_en: '',
  ownerName_mr: '',
  ownerPhoto: '',
  careerDetails_en: '',
  careerDetails_mr: '',
  vision_en: '',
  vision_mr: '',
  mission_en: '',
  mission_mr: '',
  websitePurpose_en: '',
  websitePurpose_mr: '',
  messageFromOwner_en: '',
  messageFromOwner_mr: '',
  officePhoto: '',
}

export default function AboutUsAdmin() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<AboutUsFormState>(EMPTY_FORM)
  const [currentPhoto, setCurrentPhoto] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>('')
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login', { replace: true })
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchAboutUs()
        if (!isMounted || !data) {
          if (isMounted) setLoading(false)
          return
        }
        const {
          ownerName_en,
          ownerName_mr,
          ownerPhoto,
          officePhoto = '',
          careerDetails_en,
          careerDetails_mr,
          vision_en,
          vision_mr,
          mission_en,
          mission_mr,
          websitePurpose_en,
          websitePurpose_mr,
          messageFromOwner_en,
          messageFromOwner_mr,
        } = data
        if (isMounted) {
          setForm({
            ownerName_en,
            ownerName_mr,
            ownerPhoto,
            officePhoto,
            careerDetails_en,
            careerDetails_mr,
            vision_en,
            vision_mr,
            mission_en,
            mission_mr,
            websitePurpose_en,
            websitePurpose_mr,
            messageFromOwner_en,
            messageFromOwner_mr,
          })
          setCurrentPhoto(ownerPhoto)
        }
      } catch (error) {
        console.error('[about-admin] fetch failed', error)
        toast.error('Unable to load About Us content.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (!authLoading && user) {
      load()
    }

    return () => {
      isMounted = false
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [authLoading, user, filePreview])

  const handleChange = (field: keyof AboutUsFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fieldId = event.target.id
    const selected = event.target.files?.[0]
    if (!selected || !fieldId) return

    try {
      setUploadingField(fieldId)
      const url = await uploadToCloudinary(selected, 'vastu/about-us')
      setForm(prev => ({ ...prev, [fieldId]: url }))
      if (fieldId === 'ownerPhoto') {
        if (filePreview) URL.revokeObjectURL(filePreview)
        const preview = URL.createObjectURL(selected)
        setFile(selected)
        setFilePreview(preview)
      }
      toast.success('Image uploaded ✅')
    } catch (error) {
      console.error('[about-admin] upload failed', error)
      toast.error('Unable to upload image.')
    } finally {
      setUploadingField(null)
      event.target.value = ''
    }
  }

  const previewPhoto = useMemo(() => {
    if (filePreview) return filePreview
    if (form.ownerPhoto) return form.ownerPhoto
    return currentPhoto
  }, [filePreview, form.ownerPhoto, currentPhoto])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      let ownerPhotoUrl = form.ownerPhoto || currentPhoto
      const officePhotoUrl = form.officePhoto

      if (file) {
        ownerPhotoUrl = await uploadToCloudinary(file, 'vastu/about-us')
      }

      const payload: AboutUsContent = {
        ownerName_en: form.ownerName_en,
        ownerName_mr: form.ownerName_mr,
        ownerPhoto: ownerPhotoUrl,
        officePhoto: officePhotoUrl,
        careerDetails_en: form.careerDetails_en,
        careerDetails_mr: form.careerDetails_mr,
        vision_en: form.vision_en,
        vision_mr: form.vision_mr,
        mission_en: form.mission_en,
        mission_mr: form.mission_mr,
        websitePurpose_en: form.websitePurpose_en,
        websitePurpose_mr: form.websitePurpose_mr,
        messageFromOwner_en: form.messageFromOwner_en,
        messageFromOwner_mr: form.messageFromOwner_mr,
        careerDetails: form.careerDetails_en,
        vision: form.vision_en,
        mission: form.mission_en,
        websitePurpose: form.websitePurpose_en,
        messageFromOwner: form.messageFromOwner_en,
        lastUpdated: new Date().toISOString(),
        updatedBy: user.displayName || user.email || 'Admin',
      }

      await updateAboutUs(payload)
      setCurrentPhoto(ownerPhotoUrl)
      setFile(null)
      if (filePreview) {
        URL.revokeObjectURL(filePreview)
        setFilePreview('')
      }
      toast.success('About Us updated successfully ✅')
    } catch (error) {
      console.error('[about-admin] update failed', error)
      toast.error('Unable to save changes right now.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <section className="section-wrapper">
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      </section>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AdminToolbar showBack backTo="/admin" backLabel="Back to Dashboard" />
        <div className="card-surface space-y-6 p-6 md:p-8">
          <header className="space-y-2">
            <h1 className="section-heading text-3xl">About Us Management</h1>
            <p className="text-sm text-primary/70 md:text-base">
              Update the public “About Us” page content. Changes appear instantly once saved.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="ownerName_en">
                      Owner Name (English)
                    </label>
                    <input
                      id="ownerName_en"
                      type="text"
                      value={form.ownerName_en}
                      onChange={event => handleChange('ownerName_en', event.target.value)}
                      className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="ownerName_mr">
                      Owner Name (Marathi)
                    </label>
                    <input
                      id="ownerName_mr"
                      type="text"
                      value={form.ownerName_mr}
                      onChange={event => handleChange('ownerName_mr', event.target.value)}
                      className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="ownerPhoto">
                    Owner Photo
                  </label>
                  <input
                    id="ownerPhoto"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="block w-full cursor-pointer text-sm text-primary"
                  />
                  {previewPhoto && (
                    <div className="mt-4 flex flex-col items-start gap-2">
                      <span className="text-xs uppercase tracking-[0.3em] text-primary/50">Preview</span>
                      <img
                        src={previewPhoto}
                        alt="Owner preview"
                        className="h-32 w-32 rounded-full object-cover shadow"
                        loading="lazy"
                        width={128}
                        height={128}
                      />
                    </div>
                  )}
                </div>
              </div>

              <LocalizedTextarea
                id="careerDetails"
                label="Career Details"
                value_en={form.careerDetails_en}
                value_mr={form.careerDetails_mr}
                onChange={(locale, value) => handleChange(`careerDetails_${locale}` as keyof AboutUsFormState, value)}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <LocalizedTextarea
                id="vision"
                label="Vision"
                value_en={form.vision_en}
                value_mr={form.vision_mr}
                onChange={(locale, value) => handleChange(`vision_${locale}` as keyof AboutUsFormState, value)}
              />
              <LocalizedTextarea
                id="mission"
                label="Mission"
                value_en={form.mission_en}
                value_mr={form.mission_mr}
                onChange={(locale, value) => handleChange(`mission_${locale}` as keyof AboutUsFormState, value)}
              />
              <LocalizedTextarea
                id="websitePurpose"
                label="Website Purpose"
                value_en={form.websitePurpose_en}
                value_mr={form.websitePurpose_mr}
                onChange={(locale, value) => handleChange(`websitePurpose_${locale}` as keyof AboutUsFormState, value)}
              />
              <LocalizedTextarea
                id="messageFromOwner"
                label="Message From Owner"
                value_en={form.messageFromOwner_en}
                value_mr={form.messageFromOwner_mr}
                onChange={(locale, value) => handleChange(`messageFromOwner_${locale}` as keyof AboutUsFormState, value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary" htmlFor="officePhoto">
                Office Photo
              </label>
              <input
                id="officePhoto"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="text-sm text-primary"
              />
              {uploadingField === 'officePhoto' && <span className="text-xs text-primary/60">Uploading…</span>}
              {form.officePhoto && (
                <div className="mt-3 rounded-2xl border border-primary/10 bg-primary/5 p-3">
                  <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-primary/50">Preview</span>
                  <img
                    src={form.officePhoto}
                    alt="Office preview"
                    className="h-40 w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 md:flex-row md:justify-end">
              <button
                type="submit"
                className="btn-primary w-full md:w-auto"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

interface LocalizedTextareaProps {
  id: string
  label: string
  value_en: string
  value_mr: string
  onChange: (locale: 'en' | 'mr', value: string) => void
  rows?: number
}

function LocalizedTextarea({ id, label, value_en, value_mr, onChange, rows = 4 }: LocalizedTextareaProps) {
  return (
    <div className="space-y-3">
      <span className="block text-sm font-semibold text-primary">{label}</span>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-primary/60" htmlFor={`${id}_en`}>
            English
          </label>
          <textarea
            id={`${id}_en`}
            value={value_en}
            rows={rows}
            onChange={event => onChange('en', event.target.value)}
            className="min-h-[140px] w-full rounded-3xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 md:min-h-[160px]"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-primary/60" htmlFor={`${id}_mr`}>
            मराठी
          </label>
          <textarea
            id={`${id}_mr`}
            value={value_mr}
            rows={rows}
            onChange={event => onChange('mr', event.target.value)}
            className="min-h-[140px] w-full rounded-3xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 md:min-h-[160px]"
            required
          />
        </div>
      </div>
    </div>
  )
}
