import { useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { toast } from 'react-hot-toast'
import clsx from 'clsx'
import { auth } from '../../lib/firebase'

type AdminToolbarProps = {
  className?: string
  showBack?: boolean
  backLabel?: string
  backTo?: string
}

export default function AdminToolbar({
  className,
  showBack = false,
  backLabel = 'Back to Dashboard',
  backTo = '/admin',
}: AdminToolbarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const actingProject = import.meta.env.VITE_FIREBASE_PROJECT_ID ?? ''

  const handleBack = () => {
    if (!showBack) return
    navigate(backTo)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Signed out')
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Failed to sign out', error)
      toast.error('Unable to sign out. Please try again.')
    }
  }

  return (
    <div
      className={clsx(
        'mb-8 flex flex-col gap-3 rounded-3xl border border-primary/10 bg-white/80 p-4 text-primary shadow-soft-card sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-primary/50">Admin Portal</span>
        <div className="text-sm text-primary/70">
          {showBack ? `Editing route: ${location.pathname}` : 'Manage website content and configuration.'}
        </div>
        {actingProject && (
          <div className="text-xs text-primary/50">Project: {actingProject}</div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {showBack && (
          <button type="button" onClick={handleBack} className="btn-secondary px-4 py-2 text-sm">
            {backLabel}
          </button>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="btn-primary px-4 py-2 text-sm focus-visible:ring-accent/30"
        >
          Logout
        </button>
      </div>
    </div>
  )
}


