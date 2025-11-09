import { useParams } from 'react-router-dom'
import ProtectedRoute from '../components/Admin/ProtectedRoute'

const sectionTitles: Record<string, string> = {
  company: 'Company Information',
  services: 'Services Manager',
  gallery: 'Gallery Manager',
  videos: 'Videos Manager',
  blogs: 'Blog Manager',
  testimonials: 'Testimonials Manager',
  messages: 'Enquiries & Messages',
}

export default function AdminContentEditor() {
  const { section } = useParams<{ section: string }>()
  const title = section ? sectionTitles[section] ?? 'Content Manager' : 'Content Manager'

  return (
    <ProtectedRoute>
      <section className="section-wrapper">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            <h1 className="section-heading">{title}</h1>
            <div className="gold-divider" />
            <p className="text-primary/70">
              Interactive forms and tools for managing the {section} collection will be implemented here with Firestore
              and Cloudinary integrations.
            </p>
          </header>
          <div className="card-surface p-6 text-primary/70">
            <p>
              Admin CRUD interfaces, bulk uploads, scheduling, and version history logging will be built in subsequent
              checkpoints.
            </p>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  )
}

