import TestimonialCard from '../components/TestimonialCard'
import { useLocaleContext } from '../context/LocaleContext'
import useLocalCollection from '../hooks/useLocalCollection'

type TestimonialEntry = {
  id: string
  name: string
  text_en: string
  text_mr?: string
  rating?: number
  image?: string
}

const skeletonItems = Array.from({ length: 4 })

export default function Testimonials() {
  const { lang, dict } = useLocaleContext()
  const { data: testimonials, loading } = useLocalCollection<TestimonialEntry>('testimonials')

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center animate-fadeIn">
          <h1 className="section-heading">{dict.sections.testimonialsTitle}</h1>
          <div className="mx-auto gold-divider" />
          <p className="text-primary/70">{dict.sections.testimonialsDescription}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            skeletonItems.map((_, index) => (
              <div key={`testimonial-skeleton-${index}`} className="card-surface animate-pulse p-6">
                <div className="h-16 w-16 rounded-full bg-gray-200/70" />
                <div className="mt-4 h-5 w-1/2 rounded-full bg-gray-200/60" />
                <div className="mt-2 h-4 w-full rounded-full bg-gray-200/50" />
                <div className="mt-2 h-4 w-5/6 rounded-full bg-gray-200/40" />
              </div>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map(item => (
              <TestimonialCard
                key={item.id}
                name={item.name}
                message={lang === 'en' ? item.text_en : item.text_mr ?? item.text_en}
                rating={item.rating}
                image={item.image}
              />
            ))
          ) : (
            <div className="card-surface p-6 text-center text-primary/60 md:col-span-2">
              {dict.sections.testimonialsEmpty}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

