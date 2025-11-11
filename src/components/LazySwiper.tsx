import { Children, useEffect, useMemo, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'

interface LazySwiperProps {
  children: ReactNode | ReactNode[]
  swiperProps?: Record<string, unknown>
  placeholderHeight?: number
  modulesLoader?: () => Promise<unknown[]>
}

interface SwiperState {
  Swiper: ComponentType<Record<string, unknown>>
  SwiperSlide: ComponentType<Record<string, unknown>>
  modules?: unknown[]
}

const DEFAULT_PLACEHOLDER_HEIGHT = 200

export default function LazySwiper({
  children,
  swiperProps,
  placeholderHeight = DEFAULT_PLACEHOLDER_HEIGHT,
  modulesLoader,
}: LazySwiperProps) {
  const [components, setComponents] = useState<SwiperState | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadSwiper() {
      try {
        const [reactModule] = await Promise.all([
          import('swiper/react'),
          import('swiper/css'),
          import('swiper/css/pagination'),
        ])

        const loadedModules = modulesLoader ? await modulesLoader() : undefined

        if (!mounted) return

        setComponents({
          Swiper: reactModule.Swiper,
          SwiperSlide: reactModule.SwiperSlide,
          modules: loadedModules,
        })
      } catch (error) {
        console.error('Failed to load Swiper dynamically', error)
      }
    }

    loadSwiper()

    return () => {
      mounted = false
    }
  }, [modulesLoader])

  const slides = useMemo(() => Children.toArray(children), [children])

  if (!components) {
    return <div className="swiper-placeholder" style={{ minHeight: placeholderHeight }} />
  }

  const { Swiper, SwiperSlide, modules } = components

  return (
    <Swiper modules={modules} {...(swiperProps ?? {})}>
      {slides.map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  )
}
