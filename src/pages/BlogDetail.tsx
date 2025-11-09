import { useParams } from 'react-router-dom'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <article className="section-wrapper">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="section-heading capitalize">{slug?.replace(/-/g, ' ')}</h1>
        <div className="gold-divider" />
        <div className="prose prose-lg max-w-none text-primary/80">
          <p>Blog content will render here from Firestore rich text fields.</p>
        </div>
      </div>
    </article>
  )
}

