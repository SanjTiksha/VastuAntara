import ServiceCard from '../components/ServiceCard'

const placeholderServices = [
  {
    id: '1',
    slug: 'residential-vastu',
    title: 'Residential Vastu',
    description: 'Holistic evaluation and optimisation of living spaces for health and harmony.',
  },
  {
    id: '2',
    slug: 'commercial-vastu',
    title: 'Commercial Vastu',
    description: 'Strategic layouts for businesses to enhance prosperity and team alignment.',
  },
]

export default function Services() {
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
          {placeholderServices.map(service => (
            <ServiceCard key={service.id} {...service} image="" />
          ))}
        </div>
      </div>
    </section>
  )
}

