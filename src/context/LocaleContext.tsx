/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { SupportedLocale } from '../hooks/useLocale'
import useLocale from '../hooks/useLocale'

type LocaleContextValue = {
  lang: SupportedLocale
  dict: typeof import('../locales/en.json')
  toggleLang: () => void
  setLang: (lang: SupportedLocale) => void
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useLocale()

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocaleContext() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocaleContext must be used within a LocaleProvider')
  }
  return context
}

