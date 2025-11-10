import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useLocaleContext } from '../context/LocaleContext'

export default function NotFound() {
  const { dict } = useLocaleContext()
  const pageTitle = `${dict.meta.siteName} | ${dict.meta.notFoundTitle}`
  const pageDescription = dict.meta.notFoundDescription

  return (
    <section className="section-wrapper min-h-[60vh] bg-bgSoft">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={dict.meta.defaultImage} />
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-sm uppercase tracking-[0.3em] text-accent">404</span>
        <h1 className="section-heading mt-4">We could not find that page</h1>
        <div className="gold-divider mx-auto" />
        <p className="text-primary/70">
          The page you are looking for may have been moved or no longer exists. Let us guide you back home.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          Return Home
        </Link>
      </div>
    </section>
  )
}

