import { DEFAULT_LANGUAGE, LOCALE_STORAGE_KEY } from './constants'

export type LanguageCode = 'en' | 'mr'

export function getStoredLanguage(): LanguageCode {
  const stored = typeof window !== 'undefined' ? (localStorage.getItem(LOCALE_STORAGE_KEY) as LanguageCode | null) : null
  return stored ?? DEFAULT_LANGUAGE
}

export function setStoredLanguage(value: LanguageCode) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCALE_STORAGE_KEY, value)
}

export function translateField<T extends Record<string, unknown>>(data: T, field: string, language: LanguageCode) {
  const languageKey = `${field}_${language}`
  const fallbackKey = `${field}_${DEFAULT_LANGUAGE}`
  return (data[languageKey] as string | undefined) ?? (data[fallbackKey] as string | undefined) ?? ''
}

export function formatPhoneNumber(phone: string) {
  return phone.replace(/(\d{5})(\d{5})/, '+91 $1 $2')
}

