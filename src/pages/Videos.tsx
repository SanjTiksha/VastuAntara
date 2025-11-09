import { useMemo, useState } from 'react'
import VideoCard from '../components/VideoCard'
import useLocalCollection from '../hooks/useLocalCollection'

type VideoEntry = {
  id: string
  title_en: string
  youtubeLink: string
  thumbnail?: string
}

const skeletonItems = Array.from({ length: 4 })

function extractYoutubeId(link: string) {
  try {
    const url = new URL(link)
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '')
    }
    return url.searchParams.get('v') ?? ''
  } catch (error) {
    console.error('Invalid YouTube url', error)
    return ''
  }
}

export default function Videos() {
  const { data: videos, loading } = useLocalCollection<VideoEntry>('videos')
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const hydratedVideos = useMemo(
    () =>
      videos.map(video => ({
        ...video,
        youtubeId: extractYoutubeId(video.youtubeLink),
      })),
    [videos],
  )

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">Videos</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">
            Watch in-depth sessions, case studies, and client transformations that showcase the VastuAntara approach.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {loading
            ? skeletonItems.map((_, index) => (
                <div key={`video-skeleton-${index}`} className="card-surface animate-pulse p-6">
                  <div className="h-40 w-full rounded-3xl bg-gray-200/70" />
                  <div className="mt-4 h-6 w-3/4 rounded-full bg-gray-200/60" />
                </div>
              ))
            : hydratedVideos.map(video => (
                <VideoCard
                  key={video.id}
                  title={video.title_en}
                  youtubeId={video.youtubeId}
                  thumbnail={video.thumbnail}
                  onPlay={setActiveVideo}
                />
              ))}
        </div>

        {activeVideo && (
          <div className="mt-10 aspect-video overflow-hidden rounded-3xl border border-primary/20 shadow-soft-card">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}`}
              title="VastuAntara video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}
      </div>
    </section>
  )
}

