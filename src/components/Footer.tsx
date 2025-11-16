import { Link } from 'react-router-dom'
import { useLocaleContext } from '../context/LocaleContext'
import { hasFirebaseConfig } from '../lib/firebase'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import type { CompanyInfo } from '../types/company'
import type { SocialLink } from '../types/socialLink'

export default function Footer() {
  const { dict, lang } = useLocaleContext()
  const { data: companyInfo } = useFirestoreDoc<CompanyInfo>('companyInfo', 'default')
  const phone = companyInfo?.phone ?? '+91-0000000000'
  const email = companyInfo?.email ?? 'info@example.com'
  const address = companyInfo?.address ?? 'Pune, Maharashtra, India'

  const { data: allSocialLinks = [] } = useFirestoreCollection<SocialLink>('social_links', {
    orderField: 'order',
  })
  
  const socialLinks = allSocialLinks.filter(link => link.active)

  const getLocalizedName = (link: SocialLink): string => {
    if (lang === 'mr' && link.name_mr) return link.name_mr
    if (lang === 'en' && link.name_en) return link.name_en
    return link.name // Fallback to default name
  }

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-accent/80 text-siteWhite">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <img
              src={lang === 'mr' ? '/images/Marathi logo png.png' : '/images/kunal-01.png'}
              alt="VastuAntara Logo"
              className="h-12 w-auto rounded-lg border-2 border-white sm:h-14 md:h-16 lg:h-20 object-contain"
              loading="lazy"
            />
            <p className="mt-4 text-sm text-white/80">
              {lang === 'en'
                ? 'Expert Vastu Shastra guidance blending tradition with modern living for harmonious spaces.'
                : 'परंपरा आणि आधुनिक जीवन यांचा सुंदर मेळ घालणारे संतुलित वास्तु मार्गदर्शन.'}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent">{dict.nav.home}</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/75">
              <Link to="/about" className="hover:text-accent">
                {dict.nav.about}
              </Link>
              <Link to="/services" className="hover:text-accent">
                {dict.nav.services}
              </Link>
              <Link to="/gallery" className="hover:text-accent">
                {dict.nav.gallery}
              </Link>
              <Link to="/blogs" className="hover:text-accent">
                {dict.nav.blogs}
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent">
              {lang === 'en' ? 'Contact' : 'संपर्क'}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li>{lang === 'en' ? `Phone: ${phone}` : `फोन: ${phone}`}</li>
              <li>{lang === 'en' ? `Email: ${email}` : `ईमेल: ${email}`}</li>
              <li>{lang === 'en' ? address : 'पुणे, महाराष्ट्र, भारत'}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent">
              {lang === 'en' ? 'Connect' : 'कनेक्ट'}
            </h3>
            <div className="mt-4 flex flex-wrap gap-3 text-white/75">
              {socialLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                  aria-label={getLocalizedName(link)}
                >
                  {getLocalizedName(link)}
                </a>
              ))}
            </div>
            {hasFirebaseConfig && (
              <div className="mt-4 border-t border-white/20 pt-4">
                <Link
                  to="/login"
                  className="text-sm text-white/75 hover:text-accent"
                  aria-label={dict.footer?.social?.adminLogin ?? 'Admin Login'}
                >
                  {dict.footer?.social?.adminLogin ?? (lang === 'en' ? 'Admin Login' : 'प्रशासक लॉगिन')}
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-6 text-white/70">
          <div className="flex flex-col items-center gap-3 text-center text-xs uppercase tracking-[0.3em] sm:flex-row sm:justify-between">
            <span>{dict.footer.rights}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              <span className="text-white/70">Powered by</span>
              <span className="tracking-normal text-siteWhite">SanjTiksha Roots And Wings</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

