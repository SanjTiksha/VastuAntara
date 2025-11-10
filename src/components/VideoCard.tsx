import { useMemo, useState } from 'react'
import Modal, { type Styles } from 'react-modal'
import { useLocaleContext } from '../context/LocaleContext'
import { getYouTubeId, withImageParams } from '../lib/helpers'

interface VideoCardProps {
  title_en: string
  title_mr: string
  youtubeLink: string
  thumbnail?: string
  description_en?: string
  description_mr?: string
}

const modalStyles: Styles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '1rem',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    border: 'none',
    background: 'transparent',
    padding: 0,
    overflow: 'visible',
  },
}

export default function VideoCard({
  title_en,
  title_mr,
  youtubeLink,
  thumbnail,
  description_en,
  description_mr,
}: VideoCardProps) {
  const { lang, dict } = useLocaleContext()
  const [isOpen, setIsOpen] = useState(false)

  const youtubeId = getYouTubeId(youtubeLink)
  const baseThumbnail = thumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
  const thumbnailUrl = withImageParams(baseThumbnail, 'auto=format&q=auto&f=auto&w=800')
  const translatedTitle = lang === 'en' ? title_en : title_mr
  const translatedDescription = useMemo(
    () =>
      lang === 'en'
        ? description_en ?? dict.videos.shortCaption
        : description_mr ?? description_en ?? dict.videos.shortCaption,
    [description_en, description_mr, dict.videos.shortCaption, lang],
  )
  const embedUrl = isOpen
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`
    : undefined

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
          <div className="w-full overflow-hidden rounded-t-3xl aspect-video">
            <img
              src={thumbnailUrl}
              alt={translatedTitle}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
              width={800}
              height={450}
            />
          </div>
          <span className="absolute inset-0 grid place-content-center bg-black/40 transition group-hover:bg-black/50">
            <span className="grid place-items-center rounded-full border border-accent bg-siteWhite p-4 text-primary shadow-lg">
              ►
            </span>
          </span>
        </button>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-primary">{translatedTitle}</h3>
          <p className="mt-2 text-sm text-primary/60">{translatedDescription}</p>
        </div>
      </article>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          shouldCloseOnOverlayClick
          style={modalStyles}
          contentLabel={translatedTitle}
        >
          <div className="w-[min(90vw,1024px)] max-w-4xl rounded-2xl border-2 border-accent/40 bg-white p-4 shadow-xl sm:p-6">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-siteWhite p-2 text-primary transition hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                aria-label="Close video"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ paddingTop: '56.25%' }}>
              <iframe
                key={`${youtubeId}-playing`}
                className="absolute left-0 top-0 h-full w-full rounded-xl"
                src={embedUrl}
                title={translatedTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                frameBorder="0"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

