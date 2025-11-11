import { memo } from 'react'
import { Link } from 'react-router-dom'
import { cloudinaryTransform } from '../lib/cloudinary'
import { withImageParams } from '../lib/helpers'

export interface ServiceCardProps {
  slug: string
  title: string
  description: string
  image?: string
  accent?: string
}

function ServiceCardComponent({ slug, title, description, image, accent }: ServiceCardProps) {
  return (
    <article className="card-surface flex h-full flex-col overflow-hidden">
      <div className="relative w-full overflow-hidden bg-primary/5 aspect-[16/11] md:aspect-[4/3]">
        {image ? (
          <img
            src={withImageParams(cloudinaryTransform(image, 'c_fill,w_600,h_420,f_auto,q_auto'))}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            width={600}
            height={420}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/40">Image coming soon</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-siteWhite px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {accent ?? 'Vastu'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-primary">{title}</h3>
        <p className="mt-3 flex-1 text-sm text-primary/70 line-clamp-3">{description}</p>
        <Link
          to={`/services/${slug}`}
          className="mt-6 inline-flex items-center text-sm font-semibold text-accent hover:text-accent/80"
        >
          Explore Service →
        </Link>
      </div>
    </article>
  )
}

const ServiceCard = memo(ServiceCardComponent)

export default ServiceCard

