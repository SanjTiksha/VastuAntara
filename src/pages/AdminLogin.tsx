import { useNavigate, Navigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { useLocaleContext } from '../context/LocaleContext'
import { auth, googleProvider, hasFirebaseConfig } from '../lib/firebase'
import useAuth from '../hooks/useAuth'
import PageMeta from '../components/PageMeta'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { dict } = useLocaleContext()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <section className="section-wrapper">
        <div className="flex min-h-[40vh] items-center justify-center">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-accent/40 border-t-primary" />
        </div>
      </section>
    )
  }

  if (user) {
    return <Navigate to="/admin" replace />
  }

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) return
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/admin', { replace: true })
    } catch (error) {
      console.error('[admin-login] Failed to sign in', error)
    }
  }

  const canSignIn = auth && googleProvider

  return (
    <section className="section-wrapper">
      <PageMeta
        title={`${dict.meta.siteName} | Admin Login`}
        description="Access the VastuAntara admin dashboard using secure Google authentication."
        image={dict.meta.defaultImage}
        noIndex
      />
      <div className="mx-auto max-w-md rounded-3xl border border-accent/30 bg-white p-8 shadow-soft-card">
        <h1 className="section-heading text-3xl">Admin Login</h1>
        <div className="gold-divider" />
        <p className="text-sm text-primary/70">
          Sign in with your Google account to access the admin tools and manage site content.
        </p>
        <div className="mt-6 space-y-4">
          {canSignIn ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="btn-primary w-full justify-center"
              aria-label="Continue with Google"
            >
              Continue with Google
            </button>
          ) : (
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-primary/70">
              <p className="font-semibold text-primary">Google sign-in unavailable</p>
              <p className="mt-1">
                Provide valid `VITE_FIREBASE_*` credentials in your environment configuration to enable authentication.
              </p>
            </div>
          )}
          {hasFirebaseConfig && (
            <p className="text-xs uppercase tracking-[0.3em] text-primary/40">
              Sessions are secured via Firebase Authentication.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}


