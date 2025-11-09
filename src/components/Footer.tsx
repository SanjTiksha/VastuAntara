import { Link } from 'react-router-dom'
import logoEn from '../assets/logo-en.png'

export default function Footer() {
  return (
    <footer className="bg-primary text-siteWhite">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="logo-frame border-white/50 bg-white/10">
              <img src={logoEn} alt="VastuAntara Footer Logo" className="h-12 w-auto rounded-xl object-contain" />
            </div>
            <p className="mt-4 text-sm text-white/80">
              Expert Vastu Shastra guidance blending tradition with modern living for harmonious spaces.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent">Explore</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/75">
              <Link to="/about" className="hover:text-accent">
                About
              </Link>
              <Link to="/services" className="hover:text-accent">
                Services
              </Link>
              <Link to="/gallery" className="hover:text-accent">
                Gallery
              </Link>
              <Link to="/blogs" className="hover:text-accent">
                Blog
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li>Phone: +91-00000 00000</li>
              <li>Email: hello@vastuantara.com</li>
              <li>Pune, Maharashtra</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent">Connect</h3>
            <div className="mt-4 flex gap-3 text-white/75">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-accent">
                Facebook
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-accent">
                YouTube
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="hover:text-accent">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-6 text-xs uppercase tracking-[0.3em] text-white/60">
          © {new Date().getFullYear()} VastuAntara. Crafted with tradition & harmony.
        </div>
      </div>
    </footer>
  )
}

