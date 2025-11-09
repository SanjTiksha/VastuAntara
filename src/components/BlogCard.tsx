import { Link } from 'react-router-dom'
import { cloudinaryTransform } from '../lib/cloudinary'

export interface BlogCardProps {
  slug: string
  title: string
  excerpt: string
  image?: string
  publishDate?: string
}

export default function BlogCard({ slug, title, excerpt, image, publishDate }: BlogCardProps) {
  return (
    <article className="card-surface overflow-hidden">
      {image && (
        <img
          src={cloudinaryTransform(image, 'c_fill,w_640,h_360,q_auto,f_auto')}
          alt={title}
          loading="lazy"
          className="h-48 w-full object-cover"
        />
      )}
      <div className="p-6">
        {publishDate && (
          <div className="text-xs uppercase tracking-[0.2em] text-accent">
            {new Date(publishDate).toLocaleDateString()}
          </div>
        )}
        <h3 className="mt-2 text-xl font-semibold text-primary">{title}</h3>
        <p className="mt-3 text-sm text-primary/70 line-clamp-3">{excerpt}</p>
        <Link to={`/blogs/${slug}`} className="mt-6 inline-flex items-center text-sm font-semibold text-accent">
          Read Article →
        </Link>
      </div>
    </article>
  )
}

