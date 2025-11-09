import GalleryGrid from '../components/GalleryGrid'
import useLocalCollection from '../hooks/useLocalCollection'

type GalleryEntry = {
  id: string
  title_en: string
  category?: string
  image: string
}

const skeletonItems = Array.from({ length: 6 })

export default function Gallery() {
  const { data: galleryItems, loading } = useLocalCollection<GalleryEntry>('gallery')

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">Gallery</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">
            Visual stories of spaces transformed with Vastu principles, sourced from inspirational interiors.
          </p>
        </header>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skeletonItems.map((_, index) => (
              <div key={`gallery-skeleton-${index}`} className="card-surface animate-pulse p-6">
                <div className="h-48 w-full rounded-3xl bg-gray-200/70" />
              </div>
            ))}
          </div>
        ) : galleryItems.length > 0 ? (
          <GalleryGrid
            items={galleryItems.map(item => ({
              id: item.id,
              title: item.title_en,
              image: item.image,
              category: item.category,
            }))}
            categories={[...new Set(galleryItems.map(item => item.category).filter(Boolean))] as string[]}
          />
        ) : (
          <div className="card-surface p-6 text-primary/60">Gallery images will appear here soon.</div>
        )}
      </div>
    </section>
  )
}

