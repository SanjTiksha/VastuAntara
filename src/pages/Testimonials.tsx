import { useMemo, useCallback } from 'react'
import TestimonialCard from '../components/TestimonialCard'
import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import LazySwiper from '../components/LazySwiper'
import PageMeta from '../components/PageMeta'

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
  const { data: testimonials, loading } = useFirestoreCollection<TestimonialEntry>('testimonials')
  const pageTitle = `${dict.meta.siteName} | ${dict.meta.testimonialsTitle}`
  const pageDescription = dict.meta.testimonialsDescription

  const loadSwiperModules = useCallback(async () => {
    const mod = await import('swiper/modules')
    return [mod.Autoplay, mod.Pagination]
  }, [])

  const swiperProps = useMemo(
    () =>
      ({
        spaceBetween: 24,
        autoplay: { delay: 6000, disableOnInteraction: false },
        pagination: { clickable: true },
        breakpoints: {
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
        },
        className:
          '[&_.swiper-pagination-bullet]:bg-accent [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:bg-primary',
      }) satisfies Record<string, unknown>,
    [],
  )

  const testimonialSlides = useMemo(
    () =>
      testimonials.map(item => (
        <div key={item.id} className="pb-12">
          <TestimonialCard
            name={item.name}
            message={lang === 'en' ? item.text_en : item.text_mr ?? item.text_en}
            rating={item.rating}
            image={item.image}
          />
        </div>
      )),
    [lang, testimonials],
  )

  return (
    <section className="section-wrapper">
      <PageMeta title={pageTitle} description={pageDescription} image={dict.meta.defaultImage} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center animate-fadeIn">
          <h1 className="section-heading">{dict.sections.testimonialsTitle}</h1>
          <div className="mx-auto gold-divider" />
          <p className="text-primary/70">{dict.sections.testimonialsDescription}</p>
        </header>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {skeletonItems.map((_, index) => (
              <div key={`testimonial-skeleton-${index}`} className="card-surface animate-pulse p-6">
                <div className="h-16 w-16 rounded-full bg-gray-200/70" />
                <div className="mt-4 h-5 w-1/2 rounded-full bg-gray-200/60" />
                <div className="mt-2 h-4 w-full rounded-full bg-gray-200/50" />
                <div className="mt-2 h-4 w-5/6 rounded-full bg-gray-200/40" />
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <LazySwiper swiperProps={swiperProps} placeholderHeight={280} modulesLoader={loadSwiperModules}>
            {testimonialSlides}
          </LazySwiper>
        ) : (
          <div className="card-surface p-6 text-center text-primary/60">{dict.sections.testimonialsEmpty}</div>
        )}
      </div>
    </section>
  )
}

