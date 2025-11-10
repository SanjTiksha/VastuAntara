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

export function withImageParams(url: string, params = 'auto=format&q=auto&f=auto') {
  if (!url) return url
  try {
    const hostname = new URL(url).hostname
    if (hostname.includes('ytimg.com') || hostname.includes('youtube.com')) {
      return url
    }
  } catch (error) {
    console.warn('withImageParams: invalid URL, returning as-is', error)
    return url
  }
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${params}`
}

export function getYouTubeId(link: string) {
  try {
    const url = new URL(link)
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '')
    }
    if (url.searchParams.has('v')) {
      return url.searchParams.get('v') ?? link
    }
    const segments = url.pathname.split('/')
    return segments.pop() ?? link
  } catch (error) {
    console.error('Unable to parse YouTube link', error)
    return link
  }
}

