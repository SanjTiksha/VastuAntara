import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { where } from 'firebase/firestore'
import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import PageMeta from '../components/PageMeta'

type ServiceEntry = {
  id: string
  slug: string
  title_en: string
  title_mr: string
  description_en: string
  description_mr: string
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { lang, dict } = useLocaleContext()
  const serviceQueryOptions = useMemo(() => {
    if (!slug) {
      return { orderField: null, constraints: undefined }
    }
    return { orderField: null, constraints: [where('slug', '==', slug)] }
  }, [slug])
  const { data: services } = useFirestoreCollection<ServiceEntry>('services', serviceQueryOptions)

  const service = useMemo(() => services[0], [services])

  const titleText = service
    ? lang === 'en'
      ? service.title_en
      : service.title_mr
    : slug?.replace('-', ' ') ?? ''
  const descriptionText = service
    ? lang === 'en'
      ? service.description_en
      : service.description_mr
    : dict.meta.serviceDetailDescription

  const pageTitle = `${dict.meta.siteName} | ${titleText}`
  const pageDescription = service ? descriptionText : dict.meta.serviceDetailDescription

  return (
    <article className="section-wrapper">
      <PageMeta title={pageTitle} description={pageDescription} image={dict.meta.defaultImage} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label={lang === 'mr' ? 'मागे जा' : 'Go back'}
        >
          <span>←</span>
          <span>{lang === 'mr' ? 'मागे' : 'Back'}</span>
        </button>
        <h1 className="section-heading capitalize">{titleText}</h1>
        <div className="gold-divider" />
        <p className="text-primary/70">{descriptionText}</p>
      </div>
    </article>
  )
}

