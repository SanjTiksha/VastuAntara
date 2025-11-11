import { useCallback, useEffect, useMemo, useState } from 'react'
import Modal, { type Styles } from 'react-modal'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import { useLocaleContext } from '../context/LocaleContext'
import { withImageParams } from '../lib/helpers'

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

const modalStyles: Styles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 60,
  },
  content: {
    position: 'relative',
    inset: 'auto',
    border: 'none',
    background: 'transparent',
    padding: 0,
    overflow: 'visible',
  },
}

export default function GalleryGrid({ categories, limit }: GalleryGridProps) {
  const { lang, dict } = useLocaleContext()
  const galleryLabels = dict.gallery
  const { data, loading } = useFirestoreCollection<GalleryEntry>('gallery')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

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

  const selectedItem = selectedIndex !== null ? filtered[selectedIndex] : null

  useEffect(() => {
    setSelectedIndex(null)
  }, [activeCategory])

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= filtered.length) {
      setSelectedIndex(filtered.length > 0 ? 0 : null)
    }
  }, [filtered, selectedIndex])

  const handleOpen = useCallback(
    (index: number) => {
      setSelectedIndex(index)
    },
    [setSelectedIndex],
  )

  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      setSelectedIndex(prev => {
        if (prev === null || filtered.length === 0) return prev
        const delta = direction === 'next' ? 1 : -1
        const nextIndex = (prev + delta + filtered.length) % filtered.length
        return nextIndex
      })
    },
    [filtered.length],
  )

  useEffect(() => {
    if (selectedIndex === null) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleNavigate('next')
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handleNavigate('prev')
      }
      if (event.key === 'Escape') {
        setSelectedIndex(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleNavigate, selectedIndex])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 animate-fadeIn">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
          className={`relative overflow-hidden rounded-full border border-accent px-5 py-2 text-sm font-semibold text-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 text-primary shadow-soft-card'
              : 'hover:-translate-y-1 hover:bg-accent/5'
          }`}
        >
          <span
            className={`absolute inset-0 -z-10 scale-0 rounded-full bg-gradient-to-r from-accent/40 via-accent/20 to-accent/40 transition-transform duration-300 ${
              activeCategory === 'all' ? 'scale-100' : 'scale-0'
            }`}
          />
          <span className="relative z-10">
            {lang === 'en' ? 'All' : 'सर्व'}
          </span>
        </button>
        {derivedCategories.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`relative overflow-hidden rounded-full border border-accent px-5 py-2 text-sm font-semibold capitalize text-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
              activeCategory === category
                ? 'bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 text-primary shadow-soft-card'
                : 'hover:-translate-y-1 hover:bg-accent/5'
            }`}
          >
            <span
              className={`absolute inset-0 -z-10 scale-0 rounded-full bg-gradient-to-r from-accent/40 via-accent/20 to-accent/40 transition-transform duration-300 ${
                activeCategory === category ? 'scale-100' : 'scale-0'
              }`}
            />
            <span className="relative z-10">
              {category}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit ?? 6 }).map((_, index) => (
            <div key={`gallery-skeleton-${index}`} className="card-surface animate-fadeIn p-6">
              <div className="h-56 w-full animate-pulse rounded-3xl bg-gray-200/70" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <figure
              key={item.id}
              className="card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
            >
              <button
                type="button"
                className="group block w-full"
                onClick={() => handleOpen(index)}
                aria-label={lang === 'en' ? item.title_en : item.title_mr}
              >
                <img
                  src={withImageParams(item.image, 'f_auto,q_auto,w=900,h=600,c_fill')}
                  alt={lang === 'en' ? item.title_en : item.title_mr}
                  loading="lazy"
                  decoding="async"
                  className="h-56 w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  width={900}
                  height={400}
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

      {selectedItem && (
        <Modal
          isOpen={selectedIndex !== null}
          onRequestClose={() => setSelectedIndex(null)}
          shouldCloseOnOverlayClick
          style={modalStyles}
          contentLabel={lang === 'en' ? selectedItem.title_en : selectedItem.title_mr}
        >
          <div className="w-[min(92vw,960px)] max-w-4xl rounded-3xl border border-accent/30 bg-siteWhite/95 p-4 shadow-soft-card sm:p-6">
            <div className="relative overflow-hidden rounded-2xl bg-black">
              <img
                src={withImageParams(selectedItem.image, 'f_auto,q_auto,w=1600,h=900,c_fill')}
                alt={lang === 'en' ? selectedItem.title_en : selectedItem.title_mr}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                width={1600}
                height={900}
              />
              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-accent/40 bg-siteWhite/80 p-3 text-primary shadow-lg transition hover:-translate-y-1 hover:bg-siteWhite"
                    onClick={() => handleNavigate('prev')}
                    aria-label={galleryLabels.prev}
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-accent/40 bg-siteWhite/80 p-3 text-primary shadow-lg transition hover:-translate-y-1 hover:bg-siteWhite"
                    onClick={() => handleNavigate('next')}
                    aria-label={galleryLabels.next}
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>
            <div className="space-y-2 text-center">
              <p className="text-lg font-semibold text-primary">
                {lang === 'en' ? selectedItem.title_en : selectedItem.title_mr}
              </p>
              {selectedItem.category && (
                <p className="text-xs uppercase tracking-[0.3em] text-primary/50">{selectedItem.category}</p>
              )}
              {filtered.length > 1 && <p className="text-xs text-primary/50">{galleryLabels.navigationHint}</p>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

