import ContactForm from '../components/ContactForm'
import GalleryGrid from '../components/GalleryGrid'
import HeroBanner from '../components/HeroBanner'
import ServiceCard from '../components/ServiceCard'
import TestimonialCard from '../components/TestimonialCard'
import { useLocaleContext } from '../context/LocaleContext'
import useLocalCollection from '../hooks/useLocalCollection'

type ServiceEntry = {
  id: string
  slug: string
  title_en: string
  title_mr: string
  description_en: string
  description_mr: string
  image?: string
}

type TestimonialEntry = {
  id: string
  name: string
  text_en: string
  text_mr?: string
  rating?: number
  image?: string
}

const skeletonItems = Array.from({ length: 3 })

export default function Home() {
  const { lang, dict } = useLocaleContext()
  const { data: services, loading: servicesLoading } = useLocalCollection<ServiceEntry>('services')
  const { data: testimonials, loading: testimonialsLoading } =
    useLocalCollection<TestimonialEntry>('testimonials')

  return (
    <main>
      <HeroBanner />

      <section className="section-wrapper bg-bgSoft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 animate-fadeIn">
            <h2 className="section-heading">{dict.sections.servicesTitle}</h2>
            <div className="gold-divider" />
            <p className="text-primary/70">{dict.sections.servicesDescription}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {servicesLoading
              ? skeletonItems.map((_, index) => (
                  <div key={`service-skeleton-${index}`} className="card-surface h-full animate-pulse p-6">
                    <div className="mb-4 h-40 w-full rounded-3xl bg-gray-200/70" />
                    <div className="h-6 w-2/3 rounded-full bg-gray-200/70" />
                    <div className="mt-3 h-4 w-full rounded-full bg-gray-200/50" />
                    <div className="mt-2 h-4 w-5/6 rounded-full bg-gray-200/50" />
                  </div>
                ))
              : services.slice(0, 3).map(service => (
                  <ServiceCard
                    key={service.id}
                    slug={service.slug}
                    title={lang === 'en' ? service.title_en : service.title_mr}
                    description={lang === 'en' ? service.description_en : service.description_mr}
                    image={service.image}
                  />
                ))}
          </div>
        </div>
      </section>

      <section className="section-wrapper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 animate-fadeIn">
            <h2 className="section-heading">{dict.sections.galleryTitle}</h2>
            <div className="gold-divider" />
            <p className="text-primary/70">{dict.sections.galleryDescription}</p>
          </div>
          <GalleryGrid limit={6} />
        </div>
      </section>

      <section className="section-wrapper bg-bgSoft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 animate-fadeIn">
            <h2 className="section-heading">{dict.sections.testimonialsTitle}</h2>
            <div className="gold-divider" />
            <p className="text-primary/70">{dict.sections.testimonialsDescription}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonialsLoading ? (
              skeletonItems.slice(0, 2).map((_, index) => (
                <div key={`testimonial-skeleton-${index}`} className="card-surface animate-pulse p-6">
                  <div className="h-20 w-full rounded-3xl bg-gray-200/70" />
                  <div className="mt-4 h-4 w-2/3 rounded-full bg-gray-200/60" />
                  <div className="mt-2 h-4 w-5/6 rounded-full bg-gray-200/50" />
                </div>
              ))
            ) : testimonials.length > 0 ? (
              testimonials.slice(0, 2).map(testimonial => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  message={lang === 'en' ? testimonial.text_en : testimonial.text_mr ?? testimonial.text_en}
                  rating={testimonial.rating}
                  image={testimonial.image}
                />
              ))
            ) : (
              <div className="card-surface p-6 text-primary/60">{dict.sections.testimonialsEmpty}</div>
            )}
          </div>
        </div>
      </section>

      <section className="section-wrapper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 animate-fadeIn">
            <h2 className="section-heading">{dict.sections.contactTitle}</h2>
            <div className="gold-divider" />
            <p className="text-primary/70">{dict.sections.contactDescription}</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}

