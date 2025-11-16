import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import AdminToolbar from '../../components/Admin/AdminToolbar'
import { firestore } from '../../lib/firebase'
import useAuth from '../../hooks/useAuth'
import useFirestoreCollection from '../../hooks/useFirestoreCollection'
import Spinner from '../../components/Spinner'
import type { SocialLink } from '../../types/socialLink'

export default function SocialMediaLinks() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { data: links = [], loading } = useFirestoreCollection<SocialLink>('social_links', {
    orderField: 'order',
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<SocialLink, 'id'>>({
    name: '',
    name_en: '',
    name_mr: '',
    url: '',
    icon: '',
    active: true,
    order: 0,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login', { replace: true })
    }
  }, [authLoading, user, navigate])

  const handleChange = (field: keyof Omit<SocialLink, 'id'>, value: string | boolean | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!form.name.trim() || !form.url.trim()) {
      toast.error('Name and URL are required')
      return
    }

    try {
      if (editingId) {
        await setDoc(doc(firestore, 'social_links', editingId), form, { merge: true })
        toast.success('Social link updated')
      } else {
        const newDocRef = doc(collection(firestore, 'social_links'))
        await setDoc(newDocRef, form)
        toast.success('Social link added')
      }
      resetForm()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save social link')
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      name_en: '',
      name_mr: '',
      url: '',
      icon: '',
      active: true,
      order: 0,
    })
    setEditingId(null)
    setFormOpen(false)
  }

  const handleEdit = (link: SocialLink) => {
    setForm({
      name: link.name,
      name_en: link.name_en ?? '',
      name_mr: link.name_mr ?? '',
      url: link.url,
      icon: link.icon,
      active: link.active,
      order: link.order,
    })
    setEditingId(link.id ?? null)
    setFormOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return

    try {
      await deleteDoc(doc(firestore, 'social_links', id))
      toast.success('Social link deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete social link')
    }
  }

  const handleToggleActive = async (link: SocialLink) => {
    try {
      await setDoc(
        doc(firestore, 'social_links', link.id!),
        { active: !link.active },
        { merge: true },
      )
      toast.success(`Link ${!link.active ? 'activated' : 'deactivated'}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to update link')
    }
  }

  if (authLoading || loading) {
    return (
      <section className="section-wrapper bg-bgSoft min-h-screen">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <Spinner />
        </div>
      </section>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="section-wrapper bg-bgSoft min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AdminToolbar showBack backTo="/admin" backLabel="Back to Admin" />
        <header className="mb-10">
          <h1 className="section-heading">Social Media Links</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">Manage social media links displayed on the website.</p>
        </header>

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              resetForm()
              setFormOpen(true)
            }}
            className="btn-primary"
          >
            Add New Link
          </button>
        </div>

        {formOpen && (
          <div className="mb-8 card-surface p-6">
            <h2 className="mb-4 text-xl font-semibold text-primary">
              {editingId ? 'Edit Link' : 'Add New Link'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="name">
                  Platform Name (Default) <span className="text-accent">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  required
                  className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="e.g., Instagram"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="name_en">
                    Name (English)
                  </label>
                  <input
                    id="name_en"
                    type="text"
                    value={form.name_en ?? ''}
                    onChange={e => handleChange('name_en', e.target.value)}
                    className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="e.g., Instagram"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="name_mr">
                    Name (Marathi)
                  </label>
                  <input
                    id="name_mr"
                    type="text"
                    value={form.name_mr ?? ''}
                    onChange={e => handleChange('name_mr', e.target.value)}
                    className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="e.g., इंस्टाग्राम"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="url">
                  URL <span className="text-accent">*</span>
                </label>
                <input
                  id="url"
                  type="url"
                  value={form.url}
                  onChange={e => handleChange('url', e.target.value)}
                  required
                  className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="icon">
                  Icon Key
                </label>
                <input
                  id="icon"
                  type="text"
                  value={form.icon}
                  onChange={e => handleChange('icon', e.target.value)}
                  className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="e.g., instagram, linkedin, twitter"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="order">
                    Order
                  </label>
                  <input
                    id="order"
                    type="number"
                    value={form.order}
                    onChange={e => handleChange('order', parseInt(e.target.value) || 0)}
                    className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    min="0"
                  />
                </div>

                <div className="flex items-center gap-3 pt-8">
                  <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => handleChange('active', e.target.checked)}
                      className="h-4 w-4 rounded border-primary/20 text-accent focus:ring-2 focus:ring-accent/30"
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Add'} Link
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Platform</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">URL</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Icon</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary">Active</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary">Order</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-primary/60">
                      No social links yet. Click "Add New Link" to get started.
                    </td>
                  </tr>
                ) : (
                  links.map(link => (
                    <tr key={link.id} className="hover:bg-primary/5">
                      <td className="px-4 py-3 text-sm font-medium text-primary">{link.name}</td>
                      <td className="px-4 py-3 text-sm text-primary/70">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline"
                        >
                          {link.url.length > 40 ? `${link.url.slice(0, 40)}...` : link.url}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-primary/70">{link.icon || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(link)}
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            link.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {link.active ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-primary/70">{link.order}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(link)}
                            className="text-sm font-semibold text-accent transition hover:text-accent/80"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(link.id!, link.name)}
                            className="text-sm font-semibold text-primary/60 transition hover:text-primary"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

