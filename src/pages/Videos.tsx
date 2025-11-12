import VideoCard from '../components/VideoCard'
import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreCollection from '../hooks/useFirestoreCollection'
import PageMeta from '../components/PageMeta'

type VideoEntry = {
  id: string
  title_en: string
  title_mr: string
  youtubeLink: string
  thumbnail?: string
  description_en?: string
  description_mr?: string
}

const skeletonItems = Array.from({ length: 4 })

export default function Videos() {
  const { dict } = useLocaleContext()
  const { data: videos, loading } = useFirestoreCollection<VideoEntry>('videos')
  const pageTitle = `${dict.meta.siteName} | ${dict.meta.videosTitle}`
  const pageDescription = dict.meta.videosDescription

  return (
    <section className="section-wrapper pt-16 sm:pt-16 lg:pt-16">
      <PageMeta title={pageTitle} description={pageDescription} image={dict.meta.defaultImage} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 animate-fadeIn">
          <h1 className="section-heading">{dict.sections.videosTitle}</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">{dict.sections.videosDescription}</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {loading
            ? skeletonItems.map((_, index) => (
                <div key={`video-skeleton-${index}`} className="card-surface animate-pulse p-6">
                  <div className="h-40 w-full rounded-3xl bg-gray-200/70" />
                  <div className="mt-4 h-6 w-3/4 rounded-full bg-gray-200/60" />
                </div>
              ))
            : videos.map(video => (
                <VideoCard
                  key={video.id}
                  title_en={video.title_en}
                  title_mr={video.title_mr}
                  youtubeLink={video.youtubeLink}
                  thumbnail={video.thumbnail}
                  description_en={video.description_en}
                  description_mr={video.description_mr}
                />
              ))}
        </div>
      </div>
    </section>
  )
}

