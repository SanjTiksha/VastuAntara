import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description?: string
  image?: string
  canonical?: string
  noIndex?: boolean
  ogType?: string
}

function setMetaTag(attribute: 'name' | 'property', key: string, value: string | undefined) {
  if (typeof document === 'undefined') return
  const selector = `meta[${attribute}="${key}"]`
  let tag = document.head.querySelector<HTMLMetaElement>(selector)

  if (!value) {
    tag?.parentElement?.removeChild(tag)
    return
  }

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', value)
}

function setCanonicalLink(url?: string) {
  if (typeof document === 'undefined') return
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!url) {
    link?.parentElement?.removeChild(link)
    return
  }

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }

  link.setAttribute('href', url)
}

export default function PageMeta({
  title,
  description,
  image,
  canonical,
  noIndex = false,
  ogType = 'website',
}: PageMetaProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.title = title

    setMetaTag('name', 'description', description)
    setMetaTag('name', 'robots', noIndex ? 'noindex,nofollow' : undefined)

    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:image', image)

    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMetaTag('name', 'twitter:image', image)

    setCanonicalLink(canonical)
  }, [title, description, image, canonical, noIndex, ogType])

  return null
}
