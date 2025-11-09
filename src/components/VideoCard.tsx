import { cloudinaryTransform } from '../lib/cloudinary'

interface VideoCardProps {
  title: string
  youtubeId: string
  thumbnail?: string
  onPlay?: (youtubeId: string) => void
}

export default function VideoCard({ title, youtubeId, thumbnail, onPlay }: VideoCardProps) {
  const thumbUrl =
    thumbnail ||
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`

  return (
    <article className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => onPlay?.(youtubeId)}
        className="group relative block w-full"
        aria-label={`Play video ${title}`}
      >
        <img
          src={cloudinaryTransform(thumbUrl, 'c_fill,w_640,h_360,q_auto,f_auto')}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 grid place-content-center bg-black/40 transition group-hover:bg-black/50">
          <span className="grid place-items-center rounded-full bg-siteWhite p-4 text-primary shadow-lg">
            ►
          </span>
        </span>
      </button>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
      </div>
    </article>
  )
}

