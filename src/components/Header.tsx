import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLocaleContext } from '../context/LocaleContext'
import LanguageToggle from './LanguageToggle'

type NavKey = 'home' | 'about' | 'services' | 'gallery' | 'videos' | 'blogs' | 'contact'

const navLinks: Array<{ to: string; key: NavKey }> = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/services', key: 'services' },
  { to: '/gallery', key: 'gallery' },
  { to: '/videos', key: 'videos' },
  { to: '/blogs', key: 'blogs' },
  { to: '/contact', key: 'contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { dict, lang } = useLocaleContext()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const headerClassName = clsx(
    'sticky top-0 z-50 bg-white/80 backdrop-blur-md transition-all duration-300',
    scrolled ? 'border-b border-primary/10 shadow-md' : 'border-b border-transparent',
  )

  return (
    <header className={headerClassName}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="logo-frame" aria-label="VastuAntara Home">
          <div className="flex items-center justify-center rounded-2xl bg-[#7A1B1B] px-4 py-2 text-white shadow-md sm:px-3 sm:py-1">
            <img
              src="/images/Swastik.png"
              alt="VastuAntara"
              className="mr-3 h-12 w-12 flex-shrink-0 sm:mr-2 sm:h-10 sm:w-10"
              loading="eager"
            />
            <div className="flex flex-col justify-center text-left">
              <h1 className="text-2xl font-semibold leading-tight text-white sm:text-xl">
                {lang === 'mr' ? 'वास्तुअंतरा' : 'VastuAntara'}
              </h1>
              <div className="mt-0.5 flex flex-wrap items-center text-[11px] font-medium tracking-wide text-[#FFD65A] sm:text-[10px]">
                {(lang === 'mr'
                  ? ['स्वास्थ्य', 'संप्रदा', 'संबंध']
                  : ['Swasthya', 'Sampradaa', 'Sambandha']
                ).map((word, index, array) => (
                  <span key={word} className="flex items-center">
                    {word}
                    {index < array.length - 1 && (
                      <span className="mx-1 text-[#FFD65A]">{lang === 'mr' ? '•' : '|'}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navLinks.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-siteWhite shadow-soft-card' : 'text-primary hover:bg-primary/5',
                ].join(' ')
              }
            >
              {dict.nav[item.key]}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <Link to="/contact" className="btn-primary hidden sm:inline-flex">
            {dict.cta.book}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-accent px-3 py-2 text-sm text-primary transition duration-200 hover:bg-accent/10"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div className="border-t border-accent/20 bg-white shadow-md">
            <nav className="flex flex-col gap-4 px-4 py-6" aria-label="Mobile navigation">
              <LanguageToggle />
              {navLinks.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 text-base font-semibold transition-colors',
                      isActive ? 'bg-primary text-siteWhite shadow-soft-card' : 'text-primary hover:bg-primary/10',
                    ].join(' ')
                  }
                >
                  {dict.nav[item.key]}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-2 justify-center"
              >
                {dict.cta.book}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

