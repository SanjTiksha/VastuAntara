import GalleryGrid from '../components/GalleryGrid'
import { useLocaleContext } from '../context/LocaleContext'

export default function Gallery() {
  const { dict } = useLocaleContext()

  return (
    <section className="section-wrapper">
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

