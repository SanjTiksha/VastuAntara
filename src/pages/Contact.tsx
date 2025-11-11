import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import type { CompanyInfo } from '../types/company'
import ReachVastuAntaraForm from '../components/ReachVastuAntaraForm'
import PageMeta from '../components/PageMeta'

function extractWhatsappNumber(phone?: string | null) {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 10) {
    return digits
  }
  return undefined
}

export default function Contact() {
  const { dict } = useLocaleContext()
  const { data: companyInfo } = useFirestoreDoc<CompanyInfo>('companyInfo', 'default')
  const whatsappNumber = extractWhatsappNumber(companyInfo?.phone)
  const pageTitle = `${dict.meta.siteName} | ${dict.meta.contactTitle}`
  const pageDescription = dict.meta.contactDescription

  return (
    <section className="section-wrapper bg-gradient-to-br from-primary/5 via-bgSoft to-accent/10">
      <PageMeta title={pageTitle} description={pageDescription} image={dict.meta.defaultImage} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">{dict.contactPage.title}</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">{dict.contactPage.description}</p>
        </header>
        <ReachVastuAntaraForm whatsappNumber={whatsappNumber} />
      </div>
    </section>
  )
}

