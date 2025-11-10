import { withImageParams } from '../lib/helpers'

interface TestimonialCardProps {
  name: string
  message: string
  image?: string
  rating?: number
}

export default function TestimonialCard({ name, message, image, rating = 5 }: TestimonialCardProps) {
  return (
    <article className="card-surface flex h-full flex-col gap-5 p-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full border border-accent/40 bg-accent/10">
          {image ? (
            <img
              src={withImageParams(image)}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
              width={56}
              height={56}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary/40">{name[0]}</div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary">{name}</h3>
          <div className="flex items-center gap-1 text-accent">
            {Array.from({ length: rating }).map((_, idx) => (
              <span key={idx}>★</span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-primary/70">{message}</p>
    </article>
  )
}

