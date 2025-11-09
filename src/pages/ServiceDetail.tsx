import { useParams } from 'react-router-dom'

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <article className="section-wrapper">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="section-heading capitalize">{slug?.replace('-', ' ')}</h1>
        <div className="gold-divider" />
        <p className="text-primary/70">
          Detailed service description will appear here, fetched from Firestore based on the slug.
        </p>
      </div>
    </article>
  )
}

