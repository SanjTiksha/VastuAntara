import { useMemo } from 'react'
import BlogCard from '../components/BlogCard'
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
  category?: string
}

const skeletonItems = Array.from({ length: 4 })

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ')
}

export default function Blogs() {
  const { lang, dict } = useLocaleContext()
  const { data: blogs, loading } = useFirestoreCollection<BlogEntry>('blogs', { orderField: null })

  const processedBlogs = useMemo(() => {
    return blogs.map(blog => {
      const contentRaw = lang === 'en' ? blog.content_en : blog.content_mr ?? blog.content_en
      const plain = stripHtml(contentRaw)
      const words = plain.trim() === '' ? 0 : plain.trim().split(/\s+/).length
      const minutes = Math.max(1, Math.round(words / 180))
      const excerpt = plain.split(/\s+/).slice(0, 32).join(' ')
      const readTimeLabel = dict.blog.readTime.replace('{{minutes}}', String(minutes))
      const title = lang === 'en' ? blog.title_en : blog.title_mr

      return {
        id: blog.id,
        slug: blog.slug,
        title,
        excerpt: `${excerpt}${plain.split(/\s+/).length > 32 ? '...' : ''}`,
        image: blog.image,
        publishDate: blog.createdAt,
        category: blog.category ?? dict.blog.tagInsights,
        readTimeLabel,
      }
    })
  }, [blogs, dict.blog.readTime, dict.blog.tagInsights, lang])

  const pageTitle = `${dict.meta.siteName} | ${dict.meta.blogsTitle}`
  const pageDescription = dict.meta.blogsDescription

  return (
    <section className="section-wrapper">
      <PageMeta title={pageTitle} description={pageDescription} image={dict.meta.defaultImage} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">{dict.sections.blogsTitle}</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">{dict.sections.blogsDescription}</p>
        </header>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {skeletonItems.map((_, index) => (
              <div key={`blog-skeleton-${index}`} className="card-surface animate-pulse p-6">
                <div className="h-40 w-full rounded-3xl bg-gray-200/60" />
                <div className="mt-4 h-4 w-24 rounded-full bg-gray-200/70" />
                <div className="mt-3 h-5 w-3/4 rounded-full bg-gray-200/60" />
                <div className="mt-2 h-4 w-full rounded-full bg-gray-200/50" />
              </div>
            ))}
          </div>
        ) : processedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {processedBlogs.map(blog => (
              <BlogCard
                key={blog.id}
                slug={blog.slug}
                title={blog.title}
                excerpt={blog.excerpt}
                image={blog.image}
                publishDate={blog.publishDate}
                category={blog.category}
                readTimeLabel={blog.readTimeLabel}
              />
            ))}
          </div>
        ) : (
          <div className="card-surface p-6 text-primary/60">{dict.sections.blogsEmpty}</div>
        )}
      </div>
    </section>
  )
}

