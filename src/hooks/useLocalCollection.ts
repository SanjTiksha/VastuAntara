import { useEffect, useState } from 'react'

export default function useLocalCollection<T>(fileName: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    if (!fileName) {
      setData([])
      setLoading(false)
      return () => {
        isMounted = false
      }
    }

    import(`../data/${fileName}.json`)
      .then(module => {
        if (!isMounted) return
        const collection = (module.default ?? []) as T[]
        setData(collection)
      })
      .catch(error => {
        console.error(`Error loading ${fileName}:`, error)
        if (isMounted) {
          setData([])
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [fileName])

  return { data, loading }
}

