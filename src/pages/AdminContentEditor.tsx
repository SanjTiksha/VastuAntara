import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import AdminToolbar from '../components/Admin/AdminToolbar'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import { firestore } from '../lib/firebase'
import { withImageParams } from '../lib/helpers'
import { uploadToCloudinary } from '../utils/cloudinaryUpload'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'

type FieldConfig = {
  name: string
  label: string
  type?: 'text' | 'textarea'
  required?: boolean
}

type SectionMode = 'collection' | 'document'

type SectionConfig = {
  title: string
  description: string
  dataKey: string
  fields: FieldConfig[]
  imageField?: string
  orderField?: string | null
  mode?: SectionMode
  documentId?: string
}

const sectionConfigs: Record<string, SectionConfig> = {
  company: {
    title: 'Company Information',
    description: 'Update your brand identity, contact details, and social presence shown across the site.',
    dataKey: 'companyInfo',
    mode: 'document',
    documentId: 'default',
    fields: [
      { name: 'name_en', label: 'Name (English)', required: true },
      { name: 'name_mr', label: 'Name (Marathi)', required: true },
      { name: 'tagline_en', label: 'Tagline (English)', required: true },
      { name: 'tagline_mr', label: 'Tagline (Marathi)', required: true },
      { name: 'address', label: 'Address', required: true },
      { name: 'phone', label: 'Phone', required: true },
      { name: 'email', label: 'Email', required: true },
      { name: 'mapEmbedUrl', label: 'Map Embed URL' },
      { name: 'social.facebook', label: 'Facebook URL' },
      { name: 'social.youtube', label: 'YouTube URL' },
      { name: 'social.whatsapp', label: 'WhatsApp URL' },
    ],
  },
  services: {
    title: 'Services Manager',
    description: 'Manage the service offerings visible on the website.',
    dataKey: 'services',
    imageField: 'image',
    orderField: 'order',
    fields: [
      { name: 'id', label: 'Service ID', required: true },
      { name: 'slug', label: 'Slug', required: true },
      { name: 'title_en', label: 'Title (English)', required: true },
      { name: 'title_mr', label: 'Title (Marathi)', required: true },
      { name: 'description_en', label: 'Description (English)', type: 'textarea', required: true },
      { name: 'description_mr', label: 'Description (Marathi)', type: 'textarea', required: true },
      { name: 'image', label: 'Hero Image URL', required: true },
      { name: 'order', label: 'Display Order' },
    ],
  },
  gallery: {
    title: 'Gallery Manager',
    description: 'Curate showcase imagery that appears on the gallery page and hero collage.',
    dataKey: 'gallery',
    imageField: 'image',
    fields: [
      { name: 'id', label: 'Item ID', required: true },
      { name: 'title_en', label: 'Title (English)', required: true },
      { name: 'title_mr', label: 'Title (Marathi)', required: true },
      { name: 'category', label: 'Category' },
      { name: 'image', label: 'Image URL', required: true },
    ],
  },
  videos: {
    title: 'Videos Manager',
    description: 'Manage embedded YouTube videos and supporting descriptions.',
    dataKey: 'videos',
    imageField: 'thumbnail',
    fields: [
      { name: 'id', label: 'Video ID', required: true },
      { name: 'title_en', label: 'Title (English)', required: true },
      { name: 'title_mr', label: 'Title (Marathi)', required: true },
      { name: 'youtubeLink', label: 'YouTube Link', required: true },
      { name: 'thumbnail', label: 'Thumbnail URL' },
      { name: 'description_en', label: 'Description (English)', type: 'textarea' },
      { name: 'description_mr', label: 'Description (Marathi)', type: 'textarea' },
    ],
  },
  blogs: {
    title: 'Blog Manager',
    description: 'Publish long-form content that powers the blog index and detail pages.',
    dataKey: 'blogs',
    imageField: 'image',
    fields: [
      { name: 'id', label: 'Blog ID', required: true },
      { name: 'slug', label: 'Slug', required: true },
      { name: 'title_en', label: 'Title (English)', required: true },
      { name: 'title_mr', label: 'Title (Marathi)', required: true },
      { name: 'category', label: 'Category' },
      { name: 'image', label: 'Featured Image URL' },
      { name: 'content_en', label: 'Content (English)', type: 'textarea', required: true },
      { name: 'content_mr', label: 'Content (Marathi)', type: 'textarea', required: true },
      { name: 'createdAt', label: 'Created At (ISO)', required: true },
      { name: 'published', label: 'Published (true/false)' },
    ],
  },
  testimonials: {
    title: 'Testimonials Manager',
    description: 'Capture customer stories displayed across the testimonials page.',
    dataKey: 'testimonials',
    imageField: 'image',
    fields: [
      { name: 'id', label: 'Testimonial ID', required: true },
      { name: 'name', label: 'Name', required: true },
      { name: 'text_en', label: 'Story (English)', type: 'textarea', required: true },
      { name: 'text_mr', label: 'Story (Marathi)', type: 'textarea' },
      { name: 'image', label: 'Avatar URL' },
      { name: 'rating', label: 'Rating (1-5)' },
    ],
  },
}

const numericFieldNames = new Set(['order', 'rating'])

function buildEmptyForm(config: SectionConfig) {
  return config.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.name] = ''
    return acc
  }, {})
}

function getValueFromData(source: Record<string, unknown> | undefined, path: string) {
  if (!source) return undefined
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[segment]
    }
    return undefined
  }, source)
}

function setValueAtPath(target: Record<string, unknown>, path: string, value: unknown) {
  const segments = path.split('.')
  let cursor: Record<string, unknown> = target
  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      cursor[segment] = value
    } else {
      if (!cursor[segment] || typeof cursor[segment] !== 'object') {
        cursor[segment] = {}
      }
      cursor = cursor[segment] as Record<string, unknown>
    }
  })
}

function transformValue(fieldName: string, value: string) {
  const key = fieldName.split('.').pop() ?? fieldName
  if (numericFieldNames.has(key)) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  if (key === 'published') {
    if (value === 'true') return true
    if (value === 'false') return false
  }
  return value
}

export default function AdminContentEditor() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { section } = useParams<{ section: string }>()
  const config = section ? sectionConfigs[section] : undefined
  const title = config?.title ?? 'Content Manager'
  const description =
    config?.description ??
    'Select a section from the admin dashboard to manage your Firestore content in realtime.'

  const isDocument = config?.mode === 'document'
  const collectionName = config?.dataKey ?? ''
  const documentId = config?.documentId ?? ''

  const { data: collectionData, loading: collectionLoading } = useFirestoreCollection<Record<string, unknown>>(
    !isDocument ? collectionName : '',
    { orderField: config?.orderField ?? null },
  )
  const { data: documentData, loading: documentLoading } = useFirestoreDoc<Record<string, unknown>>(
    isDocument ? collectionName : '',
    isDocument ? documentId : '',
  )

  const [form, setForm] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  const emptyForm = useMemo(() => (config ? buildEmptyForm(config) : {}), [config])

  useEffect(() => {
    if (!config) {
      setForm({})
      setEditingId(null)
      return
    }

    if (isDocument) {
      const filled = { ...emptyForm }
      config.fields.forEach(field => {
        const value = getValueFromData(documentData ?? {}, field.name)
        filled[field.name] = value !== undefined ? String(value) : ''
      })
      setForm(filled)
      setEditingId(null)
    } else {
      setForm(emptyForm)
      setEditingId(null)
    }
  }, [config, documentData, emptyForm, isDocument])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login', { replace: true })
    }
  }, [authLoading, user, navigate])

  if (authLoading) {
    return (
      <section className="section-wrapper">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <Spinner />
        </div>
      </section>
    )
  }

  if (!user) {
    return null
  }

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (fieldName: string, file: File) => {
    if (!section) return
    try {
      setUploadingField(fieldName)
      const folder = `vastu/${section}`
      const url = await uploadToCloudinary(file, folder)
      setForm(prev => ({ ...prev, [fieldName]: url }))
      toast.success('Image uploaded ✅')
    } catch (error) {
      console.error(error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploadingField(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!config) return

    try {
      if (isDocument) {
        const payload: Record<string, unknown> = {}
        config.fields.forEach(field => {
          const raw = form[field.name] ?? ''
          const value = transformValue(field.name, raw)
          setValueAtPath(payload, field.name, value)
        })
        await setDoc(doc(firestore, config.dataKey, config.documentId ?? 'default'), payload, { merge: true })
        toast.success('Company information updated')
      } else {
        let id = form.id?.trim()
        if (!id) {
          id = editingId ?? crypto.randomUUID()
        }
        const payload: Record<string, unknown> = { id }
        config.fields.forEach(field => {
          if (field.name === 'id') return
          const raw = form[field.name] ?? ''
          const value = transformValue(field.name, raw)
          setValueAtPath(payload, field.name, value)
        })
        await setDoc(doc(collection(firestore, config.dataKey), id), payload, { merge: true })
        toast.success(editingId ? 'Entry updated' : 'Entry added')
        setForm(emptyForm)
        setEditingId(null)
      }
    } catch (error) {
      console.error(error)
      toast.error('Unable to save changes')
    }
  }

  const handleEdit = (item: Record<string, unknown>) => {
    if (!config || isDocument) return
    const filled = { ...emptyForm }
    config.fields.forEach(field => {
      const value = getValueFromData(item, field.name)
      filled[field.name] = value !== undefined ? String(value) : ''
    })
    filled.id = String(item.id ?? '')
    setForm(filled)
    setEditingId(String(item.id ?? ''))
    toast('Edit mode enabled', { icon: '✏️' })
  }

  const handleDelete = async (id: string) => {
    if (!config || isDocument) return
    if (!window.confirm('Delete this item?')) return
    try {
      await deleteDoc(doc(firestore, config.dataKey, id))
      toast.success('Entry removed')
      if (editingId === id) {
        setForm(emptyForm)
        setEditingId(null)
      }
    } catch (error) {
      console.error(error)
      toast.error('Unable to delete entry')
    }
  }

  const loading = isDocument ? documentLoading : collectionLoading
  const items = isDocument ? [] : collectionData

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AdminToolbar showBack backTo="/admin" backLabel="Back to Admin" />
        <header className="mb-10">
          <h1 className="section-heading">{title}</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">{description}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-primary/40">
            Changes sync instantly with Firestore. Remember to monitor security rules for admin access.
          </p>
        </header>

        {!config ? (
          <div className="card-surface p-6 text-primary/70">
            <p>Select a managed section from the admin dashboard to begin editing.</p>
          </div>
        ) : (
          <div
            className={
              isDocument ? 'grid gap-8 lg:grid-cols-1' : 'grid gap-8 lg:grid-cols-[1.1fr_1fr]'
            }
          >
            <form
              onSubmit={handleSubmit}
              className="card-surface space-y-5 p-6 md:p-8 max-h-[80vh] overflow-y-auto"
            >
              {config.fields.map(field => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-semibold text-primary" htmlFor={field.name}>
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={form[field.name] ?? ''}
                      onChange={event => handleChange(field.name, event.target.value)}
                      required={field.required}
                      className="min-h-[120px] w-full rounded-3xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={form[field.name] ?? ''}
                      onChange={event => handleChange(field.name, event.target.value)}
                      required={field.required}
                      className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  )}
                  {config.imageField === field.name && (
                    <div className="mt-3 space-y-3 rounded-2xl border border-primary/10 bg-primary/5 p-3">
                      <span className="block text-xs uppercase tracking-[0.3em] text-primary/50">Preview</span>
                      {form[field.name] ? (
                        <img
                          src={withImageParams(form[field.name])}
                          alt="preview"
                          className="h-32 w-full rounded-xl object-cover"
                          loading="lazy"
                          width={320}
                          height={128}
                        />
                      ) : (
                        <p className="text-xs text-primary/50">No image selected yet.</p>
                      )}
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={event => {
                            const selected = event.target.files?.[0]
                            if (selected) {
                              void handleFileUpload(field.name, selected)
                              event.target.value = ''
                            }
                          }}
                          className="text-xs text-primary"
                          aria-label={`Upload ${field.label}`}
                        />
                        {uploadingField === field.name && (
                          <span className="text-xs text-primary/60">Uploading…</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary">
                  {editingId || isDocument ? 'Save Changes' : 'Add Entry'}
                </button>
                {!isDocument && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setForm(emptyForm)
                      setEditingId(null)
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>

            {!isDocument && (
              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                {loading ? (
                  <div className="card-surface flex min-h-[200px] items-center justify-center text-primary/60">
                    Loading entries…
                  </div>
                ) : !items.length ? (
                  <div className="card-surface p-6 text-primary/60">No entries available yet.</div>
                ) : (
                  items.map(item => (
                    <article key={String(item.id)} className="card-surface space-y-3 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-primary/40">
                            ID: {String(item.id)}
                          </p>
                          <h2 className="mt-2 text-lg font-semibold text-primary">
                            {String(item.title_en ?? item.name ?? 'Untitled')}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="text-sm font-semibold text-accent transition hover:text-accent/80"
                            aria-label={`Edit ${String(item.title_en ?? item.id)}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(String(item.id))}
                            className="text-sm font-semibold text-primary/60 transition hover:text-primary"
                            aria-label={`Delete ${String(item.title_en ?? item.id)}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {(() => {
                        if (!config.imageField) return null
                        const raw = item[config.imageField]
                        if (typeof raw !== 'string' || !raw) return null
                        return (
                          <img
                            src={withImageParams(raw)}
                            alt={String(item.title_en ?? 'Preview')}
                            className="h-32 w-full rounded-xl object-cover"
                            loading="lazy"
                            width={320}
                            height={128}
                          />
                        )
                      })()}
                    </article>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

