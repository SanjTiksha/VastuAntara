import { useMemo, useState } from 'react'
import Modal from 'react-modal'
import useLocalCollection from '../hooks/useLocalCollection'
import { useLocaleContext } from '../context/LocaleContext'

type GalleryEntry = {
  id: string
  title_en: string
  title_mr: string
  category?: string
  image: string
}

interface GalleryGridProps {
  categories?: string[]
  limit?: number
}

export default function GalleryGrid({ categories, limit }: GalleryGridProps) {
  const { lang, dict } = useLocaleContext()
  const { data, loading } = useLocalCollection<GalleryEntry>('gallery')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selected, setSelected] = useState<GalleryEntry | null>(null)

  const derivedCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories
    const unique = new Set<string>()
    data.forEach(item => {
      if (item.category) unique.add(item.category)
    })
    return Array.from(unique)
  }, [categories, data])

  const filtered = useMemo(() => {
    const filteredItems =
      activeCategory === 'all'
        ? data
        : data.filter(item => (item.category ?? '').toLowerCase() === activeCategory.toLowerCase())
    return limit ? filteredItems.slice(0, limit) : filteredItems
  }, [activeCategory, data, limit])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 animate-fadeIn">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`btn-secondary text-sm ${activeCategory === 'all' ? 'bg-accent/10' : ''}`}
        >
          {lang === 'en' ? 'All' : 'सर्व'}
        </button>
        {derivedCategories.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`btn-secondary text-sm capitalize ${activeCategory === category ? 'bg-accent/10' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit ?? 6 }).map((_, index) => (
            <div key={`gallery-skeleton-${index}`} className="card-surface animate-fadeIn p-6">
              <div className="h-56 w-full animate-pulse rounded-3xl bg-gray-200/70" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <figure
              key={item.id}
              className="card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
            >
              <button
                type="button"
                className="group block w-full"
                onClick={() => setSelected(item)}
                aria-label={lang === 'en' ? item.title_en : item.title_mr}
              >
                <img
                  src={`${item.image}&auto=format&fit=crop&w=800`}
                  alt={lang === 'en' ? item.title_en : item.title_mr}
                  loading="lazy"
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
              <figcaption className="p-6">
                <p className="text-sm font-semibold text-primary">
                  {lang === 'en' ? item.title_en : item.title_mr}
                </p>
                {item.category && (
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/50">{item.category}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="card-surface p-6 text-primary/60">{dict.sections.galleryEmpty}</div>
      )}

      <Modal
        isOpen={!!selected}
        onRequestClose={() => setSelected(null)}
        className="max-w-4xl mx-4 md:mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-xl outline-none border-2 border-accent/40"
        overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      >
        {selected && (
          <div className="space-y-4">
            <img
              src={`${selected.image}&auto=format&fit=crop&w=1200`}
              alt={lang === 'en' ? selected.title_en : selected.title_mr}
              className="w-full rounded-2xl"
            />
            <p className="text-center text-lg font-semibold text-primary">
              {lang === 'en' ? selected.title_en : selected.title_mr}
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

