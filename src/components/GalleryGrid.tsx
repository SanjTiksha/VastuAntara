import { useState } from 'react'
import { cloudinaryTransform } from '../lib/cloudinary'

export interface GalleryItem {
  id: string
  title: string
  category?: string
  image: string
  thumb?: string
  alt?: string
}

interface GalleryGridProps {
  items: GalleryItem[]
  categories?: string[]
}

export default function GalleryGrid({ items, categories = [] }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered = activeCategory === 'all' ? items : items.filter(item => item.category === activeCategory)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`btn-secondary text-sm ${activeCategory === 'all' ? 'bg-accent/10' : ''}`}
        >
          All
        </button>
        {categories.map(category => (
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <figure key={item.id} className="card-surface overflow-hidden">
            <img
              src={cloudinaryTransform(item.thumb || item.image, 'c_fill,w_600,h_420,q_auto,f_auto')}
              alt={item.alt || item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
            <figcaption className="p-6">
              <p className="text-sm font-semibold text-primary">{item.title}</p>
              {item.category && <p className="text-xs uppercase tracking-[0.2em] text-primary/50">{item.category}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

