import { Link } from 'react-router-dom'

interface HeroBannerProps {
  heading?: string
  subheading?: string
  description?: string
  backgroundImage?: string
  ctaLabel?: string
  ctaLink?: string
}

export default function HeroBanner({
  heading = 'VastuAntara',
  subheading = 'Swasthya • Sampradaa • Sambandha',
  description = 'Transforming spaces into sanctuaries of balance and prosperity through personalised Vastu guidance.',
  backgroundImage,
  ctaLabel = 'Book Consultation',
  ctaLink = '/contact',
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-bgSoft">
      <div className="absolute inset-0 -z-10 hidden md:block" aria-hidden>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent" />
        <div
          className="absolute inset-y-0 left-0 w-4/5 rounded-r-[4rem] bg-primary"
          style={{
            backgroundImage: backgroundImage ? `linear-gradient(0deg, rgba(115,27,27,0.9), rgba(115,27,27,0.9)), url(${backgroundImage})` : undefined,
            backgroundSize: backgroundImage ? 'cover' : undefined,
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute bottom-12 left-12 h-32 w-32 rounded-full border border-accent/40 bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:py-24 lg:px-8">
        <div className="relative isolate w-full max-w-2xl overflow-hidden rounded-[3rem] border border-accent/40 bg-primary px-6 py-10 text-siteWhite shadow-soft-card sm:px-12 lg:px-16">
          <span className="inline-flex items-center rounded-full border border-accent/60 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Holistic Vastu Guidance
          </span>
          <div className="gold-divider" />
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{heading}</h1>
          <p className="mt-6 text-lg text-siteWhite/90">{subheading}</p>
          <p className="mt-4 text-base text-siteWhite/80">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to={ctaLink} className="btn-primary border-accent/60 bg-siteWhite text-primary hover:bg-siteWhite/90">
              {ctaLabel}
            </Link>
            <Link to="/services" className="btn-secondary border-siteWhite/60 text-siteWhite hover:bg-siteWhite/10">
              View Services
            </Link>
          </div>
          <div className="pointer-events-none absolute -left-24 top-1/2 hidden h-48 w-48 -translate-y-1/2 rounded-full border border-accent/40 bg-accent/10 blur-3xl lg:block" />
        </div>

        <div className="relative w-full rounded-[2.5rem] border border-accent/40 bg-siteWhite p-6 shadow-soft-card md:p-10">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-3xl bg-primary/5 backdrop-blur-sm transition duration-500 hover:scale-105 hover:bg-primary/10"
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-primary/5" />
        </div>
      </div>
    </section>
  )
}

