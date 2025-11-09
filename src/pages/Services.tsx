import ServiceCard from '../components/ServiceCard'
import useLocalCollection from '../hooks/useLocalCollection'

type ServiceEntry = {
  id: string
  slug: string
  title_en: string
  description_en: string
  image?: string
}

const skeletonItems = Array.from({ length: 4 })

export default function Services() {
  const { data: services, loading } = useLocalCollection<ServiceEntry>('services')

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">Services</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">
            Each offering is crafted with deep traditional insight and delivered with contemporary clarity.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {loading
            ? skeletonItems.map((_, index) => (
                <div key={`services-skeleton-${index}`} className="card-surface animate-pulse p-6">
                  <div className="mb-4 h-40 w-full rounded-3xl bg-gray-200/70" />
                  <div className="h-6 w-2/3 rounded-full bg-gray-200/70" />
                  <div className="mt-3 h-4 w-5/6 rounded-full bg-gray-200/50" />
                  <div className="mt-2 h-4 w-3/4 rounded-full bg-gray-200/40" />
                </div>
              ))
            : services.map(service => (
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
  )
}

