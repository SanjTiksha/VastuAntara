import ServiceCard from '../components/ServiceCard'
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

const skeletonItems = Array.from({ length: 4 })

export default function Services() {
  const { lang, dict } = useLocaleContext()
  const { data: services, loading } = useLocalCollection<ServiceEntry>('services')

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 animate-fadeIn">
          <h1 className="section-heading">{dict.nav.services}</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">{dict.sections.servicesDescription}</p>
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
                  title={lang === 'en' ? service.title_en : service.title_mr}
                  description={lang === 'en' ? service.description_en : service.description_mr}
                  image={service.image}
                />
              ))}
        </div>
      </div>
    </section>
  )
}

