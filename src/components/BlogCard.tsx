import { Link } from 'react-router-dom'
import { cloudinaryTransform } from '../lib/cloudinary'
import { withImageParams } from '../lib/helpers'

export interface BlogCardProps {
  slug: string
  title: string
  excerpt: string
  image?: string
  publishDate?: string
  category?: string
  readTimeLabel?: string
}

export default function BlogCard({ slug, title, excerpt, image, publishDate, category, readTimeLabel }: BlogCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white shadow-soft-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-x-0 top-0 z-0 h-1 bg-gradient-to-r from-accent/50 via-accent/40 to-accent/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {image ? (
        <div className="relative w-full overflow-hidden aspect-[16/10]">
          <img
            src={withImageParams(cloudinaryTransform(image, 'c_fill,w_640,h_360,q_auto,f_auto'))}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
            width={640}
            height={360}
          />
          {category && (
            <span className="absolute left-4 top-4 rounded-full border border-accent/30 bg-siteWhite/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow">
              {category}
            </span>
          )}
        </div>
      ) : (
        <div className="flex aspect-[16/10] w-full items-center justify-center bg-primary/5 text-primary/40">Image coming soon</div>
      )}
      <div className="relative z-10 space-y-3 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-accent">
          {publishDate && <span>{new Date(publishDate).toLocaleDateString()}</span>}
          {readTimeLabel && <span className="text-primary/60">{readTimeLabel}</span>}
        </div>
        <h3 className="text-lg font-semibold text-primary transition-colors duration-300 group-hover:text-primary/90 md:text-xl">
          {title}
        </h3>
        <p className="text-sm text-primary/70 line-clamp-3 md:text-base md:leading-relaxed">{excerpt}</p>
        <Link
          to={`/blogs/${slug}`}
          className="inline-flex items-center text-sm font-semibold text-accent transition hover:text-accent/80 md:text-base"
        >
          Read Article →
        </Link>
      </div>
    </article>
  )
}

