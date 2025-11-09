import { useEffect, useState } from 'react'

type Locale = 'en' | 'mr'

export default function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('vastu_locale') as Locale | null) : null
    setLocale(stored ?? 'en')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('vastu_locale', locale)
    document.documentElement.setAttribute('lang', locale === 'en' ? 'en' : 'mr-IN')
    document.body.classList.toggle('font-marathi', locale === 'mr')
  }, [locale])

  const toggle = () => {
    setLocale(prev => (prev === 'en' ? 'mr' : 'en'))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-secondary text-xs uppercase tracking-widest"
      aria-label="Toggle language between English and Marathi"
    >
      {locale === 'en' ? 'मराठी' : 'EN'}
    </button>
  )
}

