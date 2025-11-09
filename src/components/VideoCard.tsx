import { useState } from 'react'
import Modal from 'react-modal'
import { useLocaleContext } from '../context/LocaleContext'
import { getYouTubeId } from '../lib/helpers'

interface VideoCardProps {
  title_en: string
  title_mr: string
  youtubeLink: string
  thumbnail?: string
}

export default function VideoCard({ title_en, title_mr, youtubeLink, thumbnail }: VideoCardProps) {
  const { lang } = useLocaleContext()
  const [isOpen, setIsOpen] = useState(false)

  const youtubeId = getYouTubeId(youtubeLink)
  const baseThumbnail = thumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
  const thumbnailUrl = baseThumbnail.includes('?')
    ? `${baseThumbnail}&auto=format&fit=crop&w=800`
    : `${baseThumbnail}?auto=format&fit=crop&w=800`
  const translatedTitle = lang === 'en' ? title_en : title_mr

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <article className="card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
        <button
          type="button"
          onClick={openModal}
          className="group relative block w-full"
          aria-label={translatedTitle}
        >
          <img
            src={thumbnailUrl}
            alt={translatedTitle}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 grid place-content-center bg-black/40 transition group-hover:bg-black/50">
            <span className="grid place-items-center rounded-full border border-accent bg-siteWhite p-4 text-primary shadow-lg">
              ►
            </span>
          </span>
        </button>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-primary">{translatedTitle}</h3>
        </div>
      </article>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="max-w-4xl mx-4 md:mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-xl outline-none border-2 border-accent/40"
        overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      >
        <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute left-0 top-0 h-full w-full rounded-xl"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={translatedTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </Modal>
    </>
  )
}

