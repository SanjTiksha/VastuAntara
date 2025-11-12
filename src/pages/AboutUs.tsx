import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import OwnerCard from '../components/OwnerCard'
import SectionTitle from '../components/SectionTitle'
import Spinner from '../components/Spinner'
import { fetchAboutUs, type AboutUsContent } from '../services/aboutUs'
import { useLocaleContext } from '../context/LocaleContext'
import PageMeta from '../components/PageMeta'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import type { CompanyInfo } from '../types/company'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'

export default function AboutUs() {
  const [content, setContent] = useState<AboutUsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const { lang, dict } = useLocaleContext()
  const { data: companyInfo } = useFirestoreDoc<CompanyInfo>('companyInfo', 'default')

  const labels = lang === 'mr'
    ? {
        vision: 'आपली दृष्टी',
        mission: 'आपले ध्येय',
        websitePurpose: 'हे संकेतस्थळ का तयार केले',
        office: 'आमचे कार्यालय',
        messageTitle: 'यांचा संदेश',
        lastUpdated: 'शेवटचे अद्यतन',
        officeSubtitle: 'आमच्या कार्यालयाविषयी अधिक जाणून घेण्यासाठी खालील दुव्यावर क्लिक करा.'
      }
    : {
        vision: 'Our Vision',
        mission: 'Our Mission',
        websitePurpose: 'Why We Created This Website',
        office: 'Our Office',
        messageTitle: 'Message from',
        lastUpdated: 'Last updated on',
        officeSubtitle: 'Tap the link below to explore the full address and contact details.'
      }

  const officeBlurb = useMemo(() => {
    if (!companyInfo) return labels.officeSubtitle
    const preferred = lang === 'mr' ? companyInfo.officeBlurb_mr ?? companyInfo.officeBlurb_en : companyInfo.officeBlurb_en ?? companyInfo.officeBlurb_mr
    return preferred || labels.officeSubtitle
  }, [companyInfo, lang, labels.officeSubtitle])

  const visitCtaLabel =
    dict.contactPage?.officeSection?.visitLink ??
    (lang === 'mr' ? 'आम्हाला भेट द्या' : 'Visit us at VastuAntara')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchAboutUs()
        if (isMounted) {
          setContent(data)
        }
      } catch (error) {
        console.error('[about-us] Failed to fetch content', error)
        toast.error('Unable to load about us content right now.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const pageTitle = 'VastuAntara | About Us'
  const ownerName = lang === 'mr' ? content?.ownerName_mr || content?.ownerName_en : content?.ownerName_en
  const careerDetails = lang === 'mr' ? content?.careerDetails_mr || content?.careerDetails_en : content?.careerDetails_en
  const vision = lang === 'mr' ? content?.vision_mr || content?.vision_en : content?.vision_en
  const mission = lang === 'mr' ? content?.mission_mr || content?.mission_en : content?.mission_en
  const websitePurpose =
    lang === 'mr' ? content?.websitePurpose_mr || content?.websitePurpose_en : content?.websitePurpose_en
  const messageFromOwner =
    lang === 'mr' ? content?.messageFromOwner_mr || content?.messageFromOwner_en : content?.messageFromOwner_en

  const pageDescription =
    vision ?? 'Discover the story, mission, and vision behind VastuAntara and how we empower communities through technology.'

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!content) {
    return (
      <section className="section-wrapper">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-heading">About VastuAntara</h1>
          <div className="gold-divider mx-auto" />
          <p className="mt-6 text-primary/70">We are updating this section. Please check back soon.</p>
        </div>
      </section>
    )
  }

  const formattedDate = (() => {
    if (!content.lastUpdated) return null
    let date: Date | null = null
    if (typeof content.lastUpdated === 'string') {
      date = new Date(content.lastUpdated)
    } else if (typeof content.lastUpdated === 'object' && content.lastUpdated !== null) {
      const maybeTimestamp = content.lastUpdated as {
        seconds?: number
        toDate?: () => Date
      }
      if (typeof maybeTimestamp.toDate === 'function') {
        date = maybeTimestamp.toDate()
      } else if (typeof maybeTimestamp.seconds === 'number') {
        date = new Date(maybeTimestamp.seconds * 1000)
      }
    }

    if (!date || Number.isNaN(date.getTime())) return null

    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  })()

  return (
    <section className="section-wrapper bg-gradient-to-br from-primary/5 via-bgSoft to-accent/10">
      <PageMeta title={pageTitle} description={pageDescription} image={content.ownerPhoto || FALLBACK_IMAGE} />
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-fadeIn">
          <OwnerCard
            name={ownerName || (lang === 'mr' ? 'वास्तुअंतरा' : 'VastuAntara')}
            careerDetails={careerDetails || ''}
            photoUrl={content.ownerPhoto || FALLBACK_IMAGE}
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 animate-fadeIn">
          <div className="card-surface space-y-3 p-6 md:p-8">
            <h3 className="text-xl font-semibold text-primary md:text-2xl">{labels.vision}</h3>
            <p className="text-sm text-primary/70 md:text-base md:leading-relaxed">{vision}</p>
          </div>
          <div className="card-surface space-y-3 p-6 md:p-8">
            <h3 className="text-xl font-semibold text-primary md:text-2xl">{labels.mission}</h3>
            <p className="text-sm text-primary/70 md:text-base md:leading-relaxed">{mission}</p>
          </div>
          <div className="card-surface space-y-3 p-6 md:p-8 md:col-span-2">
            <h3 className="text-xl font-semibold text-primary md:text-2xl">{labels.websitePurpose}</h3>
            <p className="text-sm text-primary/70 md:text-base md:leading-relaxed">{websitePurpose}</p>
          </div>
        </div>

        <div className="animate-fadeIn space-y-6 text-center">
          <SectionTitle title={labels.office} subtitle={officeBlurb} align="center" />
          <div>
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2"
            >
              {visitCtaLabel} →
            </Link>
          </div>
        </div>

        <div className="space-y-6 animate-fadeIn">
          <SectionTitle
            title={`${labels.messageTitle} ${ownerName || (lang === 'mr' ? 'वास्तुअंतरा' : 'VastuAntara')}`}
            subtitle={lang === 'mr' ? 'कृतज्ञतेचा आणि प्रेरणेचा संदेश' : 'A note of gratitude and inspiration'}
            align="center"
          />
          <blockquote className="mx-auto max-w-4xl rounded-3xl border border-accent/20 bg-white/90 p-6 text-center text-primary/80 shadow-soft-card md:p-10">
            <p className="text-base italic md:text-lg">“{messageFromOwner}”</p>
          </blockquote>
          {formattedDate && (
            <p className="text-center text-xs uppercase tracking-[0.3em] text-primary/50">
              {labels.lastUpdated} {formattedDate}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
