import { Link } from 'react-router-dom'
import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import type { CompanyInfo } from '../types/company'
import { withImageParams } from '../lib/helpers'

type GalleryEntry = {
  id: string
  image: string
  title_en: string
  title_mr: string
}

interface HeroBannerProps {
  ctaLink?: string
}

export default function HeroBanner({ ctaLink = '/contact' }: HeroBannerProps) {
  const { lang, dict } = useLocaleContext()
  const { data: galleryImages } = useFirestoreCollection<GalleryEntry>('gallery')
  const { data: companyInfo } = useFirestoreDoc<CompanyInfo>('companyInfo', 'default')
  const collageImages = galleryImages.slice(0, 4)
  const placeholderCount = Math.max(0, 4 - collageImages.length)

  const heading =
    lang === 'en' ? companyInfo?.name_en ?? 'VastuAntara' : companyInfo?.name_mr ?? 'वास्तुअंतरा'
  const subheading =
    lang === 'en'
      ? companyInfo?.tagline_en ?? 'Swasthya | Sampradaa | Sambandha'
      : companyInfo?.tagline_mr ?? 'स्वास्थ्य | संप्रदा | संबंध'
  const description =
    lang === 'en'
      ? 'Transforming spaces into sanctuaries of balance and prosperity through personalised Vastu guidance.'
      : 'वैयक्तिक वास्तु मार्गदर्शनाद्वारे जागांना संतुलित व समृद्ध अनुभव देण्याची प्रक्रिया.'

  return (
    <section className="relative w-full flex items-center justify-center bg-[#fff9f5] min-h-[90vh] py-12 md:py-16 overflow-hidden">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-10 items-center px-6 md:grid-cols-2 md:gap-12 md:px-12 lg:px-20">
        <div className="relative isolate flex h-full flex-col justify-center rounded-3xl border border-[#dcb87c]/30 bg-gradient-to-br from-[#6b0f1a] via-[#7f3124] to-[#c9a24b] p-8 text-siteWhite shadow-[0_8px_30px_rgba(107,15,26,0.15)] md:p-10 lg:p-12 animate-fadeIn">
          <span className="inline-flex items-center rounded-full border border-accent/60 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {lang === 'en' ? 'Holistic Vastu Guidance' : 'समग्र वास्तु मार्गदर्शन'}
          </span>
          <div className="gold-divider" />
          <h1 className="text-4xl font-semibold tracking-wide sm:text-5xl lg:text-6xl">{heading}</h1>
          <p className="mt-6 text-lg text-siteWhite/90">{subheading}</p>
          <p className="mt-4 text-base text-siteWhite/80">{description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
            <Link
              to={ctaLink}
              className="px-6 py-3 font-semibold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6b0f1a] to-[#c9a24b] hover:opacity-90"
            >
              {dict.cta.book}
            </Link>
            <Link
              to="/services"
              className="px-6 py-3 font-semibold transition-all duration-300 rounded-full border border-[#c9a24b] text-[#6b0f1a] bg-transparent hover:bg-gradient-to-r hover:from-[#6b0f1a] hover:to-[#c9a24b] hover:text-white"
            >
              {lang === 'en' ? 'View Services' : 'सेवा पहा'}
            </Link>
          </div>
        </div>

        <div className="h-full rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(107,15,26,0.12)] md:p-8 lg:p-10">
          <div className="grid h-full grid-cols-2 gap-5 md:gap-6 lg:gap-8">
            {collageImages.map(item => (
              <img
                key={item.id}
                src={withImageParams(item.image, 'f_auto,q_auto,w=500,h=500,c_fill')}
                alt={lang === 'en' ? item.title_en : item.title_mr}
                className="w-full rounded-2xl object-cover transition duration-500 hover:scale-105"
                loading="lazy"
                width={250}
                height={250}
                decoding="async"
              />
            ))}
            {Array.from({ length: placeholderCount }).map((_, idx) => (
              <div key={`placeholder-${idx}`} className="w-full rounded-2xl bg-gray-200/60" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

