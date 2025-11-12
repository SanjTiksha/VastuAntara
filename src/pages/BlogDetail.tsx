import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { where } from 'firebase/firestore'
import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import PageMeta from '../components/PageMeta'

type BlogEntry = {
  id: string
  slug: string
  title_en: string
  title_mr: string
  content_en: string
  content_mr?: string
  image?: string
  createdAt?: string
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ')
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { lang, dict } = useLocaleContext()
  const blogQueryOptions = useMemo(() => {
    if (!slug) {
      return { orderField: null, constraints: undefined }
    }
    return { orderField: null, constraints: [where('slug', '==', slug)] }
  }, [slug])
  const { data: blogs } = useFirestoreCollection<BlogEntry>('blogs', blogQueryOptions)

  const blog = useMemo(() => blogs[0], [blogs])
  const titleText = blog ? (lang === 'en' ? blog.title_en : blog.title_mr) : slug?.replace(/-/g, ' ')
  const contentHtml = blog ? (lang === 'en' ? blog.content_en : blog.content_mr ?? blog.content_en) : ''
  const descriptionSource = blog ? stripHtml(contentHtml) : dict.meta.blogDetailDescription
  const metaDescription = descriptionSource.slice(0, 155)
  const pageTitle = `${dict.meta.siteName} | ${titleText}`
  const ogImage = blog?.image ?? dict.meta.defaultImage

  return (
    <article className="section-wrapper pt-16 sm:pt-16 lg:pt-16 bg-bgSoft">
      <PageMeta title={pageTitle} description={metaDescription} image={ogImage} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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
        <div className="prose prose-lg max-w-none text-primary/80">
          {blog ? (
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          ) : (
            <p>{dict.meta.blogDetailDescription}</p>
          )}
        </div>
      </div>
    </article>
  )
}

