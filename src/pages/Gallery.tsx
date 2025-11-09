import GalleryGrid from '../components/GalleryGrid'

const mockItems = [
  { id: '1', title: 'Residential Harmony', image: '', category: 'home' },
  { id: '2', title: 'Corporate Energy', image: '', category: 'office' },
]

export default function Gallery() {
  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">Gallery</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">
            Visual stories of spaces transformed with Vastu principles, soon to be dynamically loaded from Firestore.
          </p>
        </header>
        <GalleryGrid items={mockItems} categories={['home', 'office']} />
      </div>
    </section>
  )
}

