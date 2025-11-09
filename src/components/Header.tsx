import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoEn from '../assets/logo-en.png'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { dict } = useLocaleContext()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="logo-frame">
          <div className="flex items-center gap-3">
            <img src={logoEn} alt="VastuAntara Logo" className="h-10 w-auto rounded-xl object-contain" />
            <div className="hidden flex-col text-primary sm:flex">
              <span className="text-lg font-semibold tracking-wide">VastuAntara</span>
              <span className="text-xs uppercase tracking-[0.3em] text-accent">Swasthya • Sampradaa • Sambandha</span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link to="/contact" className="btn-primary hidden sm:inline-flex">
            {dict.cta.book}
          </Link>
          <button
            type="button"
            className="btn-secondary inline-flex items-center justify-center rounded-full px-3 py-2 text-sm md:hidden"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsMenuOpen(false)} />
          <div className="brand-container fixed inset-y-0 right-0 z-50 w-4/5 max-w-xs overflow-y-auto bg-siteWhite p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
                {dict.nav.home}
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close navigation"
                className="btn-secondary px-3 py-1 text-xs"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {navLinks.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                      isActive ? 'bg-primary text-siteWhite' : 'text-primary hover:bg-primary/10',
                    ].join(' ')
                  }
                >
                  {dict.nav[item.key]}
                </NavLink>
              ))}
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="btn-primary mt-4 justify-center">
                {dict.cta.book}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

