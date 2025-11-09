import ContactForm from '../components/ContactForm'
import GalleryGrid from '../components/GalleryGrid'
import HeroBanner from '../components/HeroBanner'
import ServiceCard from '../components/ServiceCard'
import TestimonialCard from '../components/TestimonialCard'
import useLocalCollection from '../hooks/useLocalCollection'

type ServiceEntry = {
  id: string
  slug: string
  title_en: string
  description_en: string
  image?: string
}

type GalleryEntry = {
  id: string
  title_en: string
  category?: string
  image: string
}

type TestimonialEntry = {
  id: string
  name: string
  text_en: string
  rating?: number
  image?: string
}

const skeletonItems = Array.from({ length: 3 })

export default function Home() {
  const { data: services, loading: servicesLoading } = useLocalCollection<ServiceEntry>('services')
  const { data: galleryItems, loading: galleryLoading } = useLocalCollection<GalleryEntry>('gallery')
  const { data: testimonials, loading: testimonialsLoading } =
    useLocalCollection<TestimonialEntry>('testimonials')

  return (
    <main>
      <HeroBanner />

      <section className="section-wrapper bg-bgSoft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading">Our Core Services</h2>
            <div className="gold-divider" />
            <p className="text-primary/70">
              Customised Vastu solutions that honour tradition while aligning with modern lifestyles.
            </p>
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
                    title={service.title_en}
                    description={service.description_en}
                    image={service.image}
                  />
                ))}
          </div>
        </div>
      </section>

      <section className="section-wrapper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading">Gallery</h2>
            <div className="gold-divider" />
            <p className="text-primary/70">
              Explore our curated collection of harmonised spaces and design inspirations.
            </p>
          </div>
          {galleryLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {skeletonItems.map((_, index) => (
                <div key={`gallery-skeleton-${index}`} className="card-surface animate-pulse p-6">
                  <div className="h-56 w-full rounded-3xl bg-gray-200/70" />
                </div>
              ))}
            </div>
          ) : (
            <GalleryGrid
              items={galleryItems.slice(0, 6).map(item => ({
                id: item.id,
                title: item.title_en,
                image: item.image,
                category: item.category,
              }))}
              categories={['home', 'office']}
            />
          )}
        </div>
      </section>

      <section className="section-wrapper bg-bgSoft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading">Testimonials</h2>
            <div className="gold-divider" />
            <p className="text-primary/70">
              The stories of transformation from our clients across homes, offices, and sacred spaces.
            </p>
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
                  message={testimonial.text_en}
                  rating={testimonial.rating}
                  image={testimonial.image}
                />
              ))
            ) : (
              <div className="card-surface p-6 text-primary/60">
                Testimonials are on their way. Stay tuned for inspiring stories.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-wrapper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="section-heading">Book a Consultation</h2>
            <div className="gold-divider" />
            <p className="text-primary/70">
              Share your details and our team will connect to craft a personalised Vastu roadmap.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}

