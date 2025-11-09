import { useEffect, useState } from 'react'
import en from '../locales/en.json'
import mr from '../locales/mr.json'

const dictionaries = { en, mr }

export type SupportedLocale = keyof typeof dictionaries

export default function useLocale() {
  const [lang, setLang] = useState<SupportedLocale>(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('lang') as SupportedLocale | null) : null
    return stored ?? 'en'
  })

  const dict = dictionaries[lang]

  const toggleLang = () => {
    const next = lang === 'en' ? 'mr' : 'en'
    setLang(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', next)
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang
    document.body.classList.toggle('font-marathi', lang === 'mr')
  }, [lang])

  const setLangAndPersist = (value: SupportedLocale) => {
    setLang(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', value)
    }
  }

  return { lang, dict, toggleLang, setLang: setLangAndPersist }
}

