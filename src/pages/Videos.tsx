import { useState } from 'react'
import VideoCard from '../components/VideoCard'

const sampleVideos = [
  { id: '1', title: 'Vastu for Peaceful Homes', youtubeId: 'dQw4w9WgXcQ' },
  { id: '2', title: 'Aligning Office Energies', youtubeId: 'M7lc1UVf-VE' },
]

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">Videos</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">
            Watch in-depth sessions, case studies, and client transformations. Content will sync with Firestore.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {sampleVideos.map(video => (
            <VideoCard
              key={video.id}
              title={video.title}
              youtubeId={video.youtubeId}
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

