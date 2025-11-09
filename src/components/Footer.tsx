import { Link } from 'react-router-dom'
import logoEn from '../assets/logo-en.png'
import companyInfo from '../data/companyInfo.json'
import { useLocaleContext } from '../context/LocaleContext'

export default function Footer() {
  const { dict, lang } = useLocaleContext()
  const { phone, email, address, social } = companyInfo

  return (
    <footer className="bg-primary text-siteWhite">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="logo-frame border-white/50 bg-white/10">
              <img src={logoEn} alt="VastuAntara Footer Logo" className="h-12 w-auto rounded-xl object-contain" />
            </div>
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
              <a href={social.facebook} target="_blank" rel="noreferrer" className="hover:text-accent">
                Facebook
              </a>
              <a href={social.youtube} target="_blank" rel="noreferrer" className="hover:text-accent">
                YouTube
              </a>
              <a href={social.whatsapp} target="_blank" rel="noreferrer" className="hover:text-accent">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-6 text-xs uppercase tracking-[0.3em] text-white/60">
          {dict.footer.rights}
        </div>
      </div>
    </footer>
  )
}

