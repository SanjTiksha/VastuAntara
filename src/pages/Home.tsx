import HeroBanner from '../components/HeroBanner'
import ServiceCard from '../components/ServiceCard'
import GalleryGrid from '../components/GalleryGrid'
import TestimonialCard from '../components/TestimonialCard'
import ContactForm from '../components/ContactForm'

const mockServices = [
  {
    id: '1',
    slug: 'residential-vastu',
    title: 'Residential Vastu',
    description: 'Balanced homes aligned with the five elements for harmony and prosperity.',
  },
  {
    id: '2',
    slug: 'commercial-vastu',
    title: 'Commercial Vastu',
    description: 'Energise your business spaces to attract growth and stability.',
  },
  {
    id: '3',
    slug: 'plot-selection',
    title: 'Plot Selection',
    description: 'Detailed analysis for selecting auspicious plots for new constructions.',
  },
]

const mockGallery = [
  {
    id: 'g1',
    title: 'Sacred Puja Room',
    image: '',
    category: 'home',
  },
  {
    id: 'g2',
    title: 'Meditation Corner',
    image: '',
    category: 'home',
  },
]

const mockTestimonials = [
  {
    id: 't1',
    name: 'Sanjana Kulkarni',
    message:
      'Our home feels vibrant and peaceful after the consultation. The guidance was practical and deeply insightful.',
  },
  {
    id: 't2',
    name: 'Rajat Deshpande',
    message:
      'The energy shift in our office is remarkable. Productivity and morale have both improved significantly.',
  },
]

export default function Home() {
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
            {mockServices.map(service => (
              <ServiceCard key={service.id} {...service} image="" />
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
          <GalleryGrid items={mockGallery} categories={['home', 'office']} />
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
            {mockTestimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} name={testimonial.name} message={testimonial.message} />
            ))}
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

