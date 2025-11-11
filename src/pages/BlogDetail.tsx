import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
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
  const { lang, dict } = useLocaleContext()
  const constraints = slug ? [where('slug', '==', slug)] : []
  const { data: blogs } = useFirestoreCollection<BlogEntry>('blogs', { orderField: null, constraints })

  const blog = useMemo(() => blogs[0], [blogs])
  const titleText = blog ? (lang === 'en' ? blog.title_en : blog.title_mr) : slug?.replace(/-/g, ' ')
  const contentHtml = blog ? (lang === 'en' ? blog.content_en : blog.content_mr ?? blog.content_en) : ''
  const descriptionSource = blog ? stripHtml(contentHtml) : dict.meta.blogDetailDescription
  const metaDescription = descriptionSource.slice(0, 155)
  const pageTitle = `${dict.meta.siteName} | ${titleText}`
  const ogImage = blog?.image ?? dict.meta.defaultImage

  return (
    <article className="section-wrapper bg-bgSoft">
      <PageMeta title={pageTitle} description={metaDescription} image={ogImage} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

