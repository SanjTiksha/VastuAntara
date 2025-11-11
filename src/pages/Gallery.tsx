import GalleryGrid from '../components/GalleryGrid'
import { useLocaleContext } from '../context/LocaleContext'
import PageMeta from '../components/PageMeta'

export default function Gallery() {
  const { dict } = useLocaleContext()
  const pageTitle = `${dict.meta.siteName} | ${dict.meta.galleryTitle}`
  const pageDescription = dict.meta.galleryDescription

  return (
    <section className="section-wrapper">
      <PageMeta title={pageTitle} description={pageDescription} image={dict.meta.defaultImage} />
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

