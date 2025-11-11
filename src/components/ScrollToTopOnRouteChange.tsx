import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
