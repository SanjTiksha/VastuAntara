import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import type { CompanyInfo } from '../types/company'
import type { SocialLink } from '../types/socialLink'
import ReachVastuAntaraForm from '../components/ReachVastuAntaraForm'
import PageMeta from '../components/PageMeta'
import { formatPhoneNumber } from '../lib/helpers'

function extractWhatsappNumber(phone?: string | null) {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 10) {
    return digits
  }
  return undefined
}

export default function Contact() {
  const { dict, lang } = useLocaleContext()
  const { data: companyInfo } = useFirestoreDoc<CompanyInfo>('companyInfo', 'default')
  const location = useLocation()
  const whatsappNumber = extractWhatsappNumber(companyInfo?.phone)
  const pageTitle = `${dict.meta.siteName} | ${dict.meta.contactTitle}`
  const pageDescription = dict.meta.contactDescription

  const officeSectionDict = dict.contactPage?.officeSection ?? {}
  const contactSectionDict = dict.contactPage?.contactSection ?? {}
  const socialSectionDict = dict.contactPage?.socialSection ?? {}
  const mapSectionDict = dict.contactPage?.mapSection ?? {}

  const officeHeading = officeSectionDict.title ?? (lang === 'mr' ? 'आमचे कार्यालय' : 'Visit our office')
  const preferLocalizedField = (field: 'officeBlurb' | 'reachTitle' | 'reachSubtitle') => {
    const localizedKey = `${field}_${lang}` as const
    const fallbackKey = `${field}_${lang === 'mr' ? 'en' : 'mr'}` as const
    const record = companyInfo ?? {}
    return (record as Record<string, string | undefined>)[localizedKey] || (record as Record<string, string | undefined>)[fallbackKey]
  }

  const coerceString = (value: unknown) => (typeof value === 'string' && value.trim().length > 0 ? value : undefined)
  const resolveOfficeImageField = (key: 'url' | 'alt_en' | 'alt_mr') => {
    const direct = coerceString(companyInfo?.officeImage?.[key])
    if (direct) return direct
    const dottedTop = coerceString((companyInfo as Record<string, unknown> | undefined)?.[`officeImage.${key}`])
    if (dottedTop) return dottedTop
    const nested = coerceString((companyInfo?.officeImage as Record<string, unknown> | undefined)?.[`officeImage.${key}`])
    if (nested) return nested
    return undefined
  }

  const officeBlurb =
    preferLocalizedField('officeBlurb') ??
    officeSectionDict.subtitle ??
    (lang === 'mr'
      ? 'आमच्या पुणे स्टुडिओला भेट द्या आणि वैयक्तिकृत वास्तु मार्गदर्शन अनुभववा.'
      : 'Drop by our Pune studio for a personalised Vastu consultation experience.')
  const officeImageUrl = resolveOfficeImageField('url') ?? ''
  const officeImageAlt =
    (lang === 'mr'
      ? resolveOfficeImageField('alt_mr') ?? resolveOfficeImageField('alt_en')
      : resolveOfficeImageField('alt_en') ?? resolveOfficeImageField('alt_mr')) ??
    (lang === 'mr' ? 'वास्तुअंतरा कार्यालय' : 'VastuAntara office exterior')
  const addressLabel = officeSectionDict.addressLabel ?? (lang === 'mr' ? 'कार्यालयाचा पत्ता' : 'Office address')
  const address = companyInfo?.address ?? officeSectionDict.addressFallback ?? (lang === 'mr' ? 'पत्ता लवकरच उपलब्ध होईल.' : 'Address will be shared soon.')

  const reachTitle =
    (lang === 'mr' ? companyInfo?.reachTitle_mr ?? companyInfo?.reachTitle_en : companyInfo?.reachTitle_en ?? companyInfo?.reachTitle_mr) ??
    dict.contactPage?.form?.title ??
    (lang === 'mr' ? 'वास्तुअंतराशी संपर्क साधा' : 'Reach VastuAntara')
  const reachSubtitle =
    (lang === 'mr'
      ? companyInfo?.reachSubtitle_mr ?? companyInfo?.reachSubtitle_en
      : companyInfo?.reachSubtitle_en ?? companyInfo?.reachSubtitle_mr) ??
    dict.contactPage?.form?.subtitle ??
    (lang === 'mr'
      ? 'आपली माहिती आमच्यासोबत शेअर करा आणि आमचा संघ २४ तासांत संपर्क साधेल.'
      : 'Share your details and our team will connect within 24 hours.')

  const phoneLabel = contactSectionDict.phoneLabel ?? (lang === 'mr' ? 'फोन' : 'Phone')
  const emailLabel = contactSectionDict.emailLabel ?? (lang === 'mr' ? 'ईमेल' : 'Email')
  const contactHeading = contactSectionDict.title ?? (lang === 'mr' ? 'आमच्या संघाशी संपर्क साधा' : 'Contact our team')
  const socialHeading = socialSectionDict.title ?? (lang === 'mr' ? 'ऑनलाइन जोडा' : 'Connect online')
  const socialSubtitle =
    socialSectionDict.subtitle ??
    (lang === 'mr' ? 'दैनिक वास्तु टिप्ससाठी आम्हाला फॉलो करा.' : 'Follow us for daily Vastu insights.')
  const mapHeading = mapSectionDict.title ?? (lang === 'mr' ? 'नकाशावर आम्हाला शोधा' : 'Find us on the map')
  const mapDescription =
    mapSectionDict.description ??
    (lang === 'mr' ? 'दिशा जाणून घेण्यासाठी आणि भेट नियोजित करण्यासाठी नकाशा वापरा.' : 'Use the map to plan your visit and get directions.')
  const mapCta = mapSectionDict.cta ?? (lang === 'mr' ? 'Google Maps मध्ये उघडा' : 'Open in Google Maps')
  const mapFallback =
    mapSectionDict.placeholder ??
    (lang === 'mr' ? 'नकाशा लवकरच उपलब्ध होईल.' : 'Map information will be available soon.')
  const directionsUrl = companyInfo?.mapDirectionsUrl
  const directionsLabel =
    mapSectionDict.directionsCta ?? (lang === 'mr' ? 'भेटीचे मार्गदर्शन' : 'Get directions')

  const primaryContact = companyInfo?.primaryContact
  const secondaryContact = companyInfo?.secondaryContact
  const contacts = [primaryContact, secondaryContact].filter(
    (contact): contact is NonNullable<typeof contact> => Boolean(contact?.name),
  )

  const { data: allSocialLinks = [] } = useFirestoreCollection<SocialLink>('social_links', {
    orderField: 'order',
  })
  
  const socialLinks = allSocialLinks.filter(link => link.active)

  const getLocalizedName = (link: SocialLink): string => {
    if (lang === 'mr' && link.name_mr) return link.name_mr
    if (lang === 'en' && link.name_en) return link.name_en
    return link.name // Fallback to default name
  }

  const displayPhone = (value?: string) => {
    if (!value) return undefined
    const digits = value.replace(/\D/g, '')
    if (digits.length === 0) return value
    if (digits.length >= 10) {
      const lastTen = digits.slice(-10)
      return formatPhoneNumber(lastTen)
    }
    return value
  }

  const phoneHref = (value?: string) => {
    if (!value) return undefined
    const digits = value.replace(/\D/g, '')
    if (!digits) return undefined
    const prefixed = digits.length === 10 ? `91${digits}` : digits
    return `tel:+${prefixed}`
  }

  useEffect(() => {
    if (!location.hash) return undefined
    const scrollToAnchor = () => {
      const id = location.hash.replace('#', '')
      if (!id) return
      const target = document.getElementById(id)
      if (target) {
        return target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return undefined
    }
    const timeout = window.setTimeout(scrollToAnchor, 100)
    return () => window.clearTimeout(timeout)
  }, [location.hash])

  useEffect(() => {
    if (location.hash === '#reach-form') {
      const target = document.getElementById('reach-form')
      if (target) {
        target.focus({ preventScroll: true })
      }
    }
  }, [location.hash])

  return (
    <section className="section-wrapper pt-16 sm:pt-16 lg:pt-16 bg-gradient-to-br from-primary/5 via-bgSoft to-accent/10">
      <PageMeta title={pageTitle} description={pageDescription} image={dict.meta.defaultImage} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">{dict.contactPage.title}</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">{dict.contactPage.description}</p>
        </header>

        <div className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <article className="card-surface overflow-hidden rounded-3xl bg-white shadow-soft-card">
              {officeImageUrl && (
                <div className="aspect-[4/3] w-full bg-primary/5 overflow-hidden rounded-t-3xl">
                  <img
                    src={officeImageUrl}
                    alt={officeImageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="space-y-5 p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-primary md:text-3xl">{officeHeading}</h2>
                <p className="text-sm text-primary/70 md:text-base md:leading-relaxed">{officeBlurb}</p>
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-primary/50">{addressLabel}</span>
                  <p className="text-sm text-primary/80 md:text-base md:leading-relaxed whitespace-pre-line">{address}</p>
                </div>
                {companyInfo?.mapEmbedUrl && (
                  <a
                    href={companyInfo.mapDirectionsUrl ?? companyInfo.mapEmbedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent hover:text-accent/80"
                  >
                    {mapCta} →
                  </a>
                )}
              </div>
            </article>

            <div className="space-y-6">
              {contacts.length > 0 && (
                <article className="card-surface space-y-5 rounded-3xl bg-white p-6 shadow-soft-card md:p-8">
                  <h3 className="text-xl font-semibold text-primary md:text-2xl">{contactHeading}</h3>
                  <div className="space-y-4">
                    {contacts.map(contact => (
                      <div
                        key={contact.email ?? contact.phone ?? contact.name}
                        className="flex gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4"
                      >
                        {contact.photoUrl && (
                          <div className="hidden shrink-0 overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm sm:block">
                            <img
                              src={contact.photoUrl}
                              alt={contact.name}
                              className="h-20 w-20 object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-base font-semibold text-primary md:text-lg">{contact.name}</p>
                          {contact.role && <p className="text-sm text-primary/60">{contact.role}</p>}
                          <div className="mt-3 space-y-1 text-sm text-primary/70">
                            {contact.phone && (
                              <a
                                href={phoneHref(contact.phone)}
                                className="flex items-center gap-2 transition hover:text-accent"
                              >
                                <span className="font-semibold">{phoneLabel}:</span>
                                <span>{displayPhone(contact.phone)}</span>
                              </a>
                            )}
                            {contact.email && (
                              <a
                                href={`mailto:${contact.email}`}
                                className="flex items-center gap-2 transition hover:text-accent"
                              >
                                <span className="font-semibold">{emailLabel}:</span>
                                <span>{contact.email}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {socialLinks.length > 0 && (
                <article className="card-surface space-y-4 rounded-3xl bg-white p-6 shadow-soft-card md:p-8">
                  <header className="space-y-1">
                    <h3 className="text-xl font-semibold text-primary md:text-2xl">{socialHeading}</h3>
                    <p className="text-sm text-primary/60">{socialSubtitle}</p>
                  </header>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map(link => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:border-accent hover:text-accent"
                      >
                        {getLocalizedName(link)}
                      </a>
                    ))}
                  </div>
                </article>
              )}
            </div>
          </div>

          {companyInfo?.mapEmbedUrl ? (
            <article className="card-surface overflow-hidden rounded-3xl bg-white shadow-soft-card">
              <header className="space-y-2 px-6 pt-6 md:px-8">
                <h3 className="text-xl font-semibold text-primary md:text-2xl">{mapHeading}</h3>
                <p className="text-sm text-primary/60 md:text-base">{mapDescription}</p>
              </header>
              <div className="mt-4 aspect-[4/3] w-full">
                <iframe
                  src={companyInfo.mapEmbedUrl}
                  title={mapHeading}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              {directionsUrl && (
                <div className="flex flex-wrap items-center gap-2 px-6 pb-6 pt-4 md:px-8">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent hover:text-accent/80"
                  >
                    {directionsLabel} →
                  </a>
                </div>
              )}
            </article>
          ) : (
            <article className="card-surface space-y-3 rounded-3xl bg-white p-6 text-primary/60 shadow-soft-card md:p-8">
              <h3 className="text-xl font-semibold text-primary md:text-2xl">{mapHeading}</h3>
              <p className="text-sm md:text-base">{mapFallback}</p>
            </article>
          )}

          <ReachVastuAntaraForm
            id="reach-form"
            whatsappNumber={whatsappNumber}
            title={reachTitle}
            subtitle={reachSubtitle}
          />
        </div>
      </div>
    </section>
  )
}

