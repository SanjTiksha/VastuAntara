import { useLocaleContext } from '../context/LocaleContext'

export default function LanguageToggle() {
  const { lang, toggleLang } = useLocaleContext()

  return (
    <button
      type="button"
      onClick={toggleLang}
      className="btn-secondary text-xs uppercase tracking-widest"
      aria-label="Toggle language between English and Marathi"
    >
      {lang === 'en' ? 'मराठी' : 'EN'}
    </button>
  )
}

