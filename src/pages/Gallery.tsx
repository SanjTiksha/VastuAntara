import { Helmet } from 'react-helmet-async'
import GalleryGrid from '../components/GalleryGrid'
import { useLocaleContext } from '../context/LocaleContext'

export default function Gallery() {
  const { dict } = useLocaleContext()
  const pageTitle = `${dict.meta.siteName} | ${dict.meta.galleryTitle}`
  const pageDescription = dict.meta.galleryDescription

  return (
    <section className="section-wrapper">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={dict.meta.defaultImage} />
      </Helmet>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 animate-fadeIn">
          <h1 className="section-heading">{dict.sections.galleryTitle}</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">{dict.sections.galleryDescription}</p>
        </header>
        <GalleryGrid />
      </div>
    </section>
  )
}

