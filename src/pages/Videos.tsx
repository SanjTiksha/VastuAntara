import VideoCard from '../components/VideoCard'
import { useLocaleContext } from '../context/LocaleContext'
import useLocalCollection from '../hooks/useLocalCollection'

type VideoEntry = {
  id: string
  title_en: string
  title_mr: string
  youtubeLink: string
  thumbnail?: string
}

const skeletonItems = Array.from({ length: 4 })

export default function Videos() {
  const { dict } = useLocaleContext()
  const { data: videos, loading } = useLocalCollection<VideoEntry>('videos')

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 animate-fadeIn">
          <h1 className="section-heading">{dict.sections.videosTitle}</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">{dict.sections.videosDescription}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
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
                />
              ))}
        </div>
      </div>
    </section>
  )
}

