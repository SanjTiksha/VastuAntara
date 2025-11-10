import clsx from 'clsx'
import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import type { CompanyInfo } from '../types/company'
import companyInfoSeed from '../data/companyInfo.json'

type BrandLogoProps = {
  className?: string
  tone?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  hideTextOnMobile?: boolean
  companyInfo?: CompanyInfo | null
}

const LOGO_SOURCES: Record<'en' | 'mr', { src: string; alt: string }> = {
  en: {
    src: '/images/kunal-01.png',
    alt: 'VastuAntara English Logo',
  },
  mr: {
    src: '/images/Marathi logo png.png',
    alt: 'वास्तुअंतरा लोगो',
  },
}

const FALLBACK_NAMES: Record<'en' | 'mr', string> = {
  en: companyInfoSeed.name_en,
  mr: companyInfoSeed.name_mr,
}

const FALLBACK_TAGLINES: Record<'en' | 'mr', string> = {
  en: companyInfoSeed.tagline_en,
  mr: companyInfoSeed.tagline_mr,
}

const IMAGE_SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 w-auto',
  md: 'h-12 w-auto',
  lg: 'h-16 w-auto',
}

const NAME_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl sm:text-2xl',
}

const TAGLINE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-xs sm:text-sm',
}

export default function BrandLogo({
  className,
  tone = 'dark',
  size = 'md',
  showText = true,
  hideTextOnMobile = false,
  companyInfo,
}: BrandLogoProps) {
  const { lang } = useLocaleContext()
  const locale: 'en' | 'mr' = lang === 'mr' ? 'mr' : 'en'

  const { data } = useFirestoreDoc<CompanyInfo>('companyInfo', 'default')
  const resolvedCompany = companyInfo ?? data ?? null

  const displayName =
    (locale === 'mr' ? resolvedCompany?.name_mr : resolvedCompany?.name_en) ?? FALLBACK_NAMES[locale]
  const tagline =
    (locale === 'mr' ? resolvedCompany?.tagline_mr : resolvedCompany?.tagline_en) ?? FALLBACK_TAGLINES[locale]
  const logo = LOGO_SOURCES[locale]

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <img
        src={logo.src}
        alt={`${logo.alt} ${displayName}`}
        className={clsx('rounded-xl object-contain', IMAGE_SIZE_CLASSES[size])}
        loading="lazy"
        width={160}
        height={size === 'lg' ? 64 : size === 'md' ? 48 : 32}
      />
      {showText && (
        <div
          className={clsx(
            'flex flex-col',
            hideTextOnMobile ? 'hidden sm:flex' : 'flex',
            tone === 'light' ? 'text-siteWhite' : 'text-primary',
          )}
        >
          <span className={clsx('font-semibold tracking-wide', NAME_CLASSES[size])}>{displayName}</span>
          <span
            className={clsx(
              'font-medium uppercase tracking-[0.3em]',
              tone === 'light' ? 'text-siteWhite/80' : 'text-accent',
              TAGLINE_CLASSES[size],
            )}
          >
            {tagline}
          </span>
        </div>
      )}
    </div>
  )
}


