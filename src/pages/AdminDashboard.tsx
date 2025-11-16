import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminToolbar from '../components/Admin/AdminToolbar'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'

const adminSections = [
  { to: '/admin/content/company', label: 'Company Info' },
  { to: '/admin/about-us', label: 'About Us' },
  { to: '/admin/content/services', label: 'Services' },
  { to: '/admin/content/gallery', label: 'Gallery' },
  { to: '/admin/content/videos', label: 'Videos' },
  { to: '/admin/content/blogs', label: 'Blogs' },
  { to: '/admin/content/testimonials', label: 'Testimonials' },
  { to: '/admin/content/messages', label: 'Messages' },
  { to: '/admin/social-media', label: 'Social Media Links' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login', { replace: true })
    }
  }, [loading, user, navigate])

  if (loading) {
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AdminToolbar />
          <header className="mb-10">
            <h1 className="section-heading">Admin Dashboard</h1>
            <div className="gold-divider" />
            <p className="text-primary/70">
              Manage your dynamic site content, media, and enquiries. All data is stored securely in Firestore and
              Cloudinary.
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2">
            {adminSections.map(section => (
              <Link key={section.to} to={section.to} className="card-surface p-6 text-primary">
                <h2 className="text-lg font-semibold">{section.label}</h2>
                <p className="mt-2 text-sm text-primary/60">Update and manage {section.label.toLowerCase()} records.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
  )
}

