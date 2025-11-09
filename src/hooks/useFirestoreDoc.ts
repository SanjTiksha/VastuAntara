import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '../lib/firebase'

export default function useFirestoreDoc<T = Record<string, unknown>>(collectionName: string, docId: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!docId) {
      setLoading(false)
      setData(null)
      return
    }

    if (!firestore) {
      setLoading(false)
      return
    }

    const ref = doc(firestore, collectionName, docId)

    const unsubscribe = onSnapshot(
      ref,
      snapshot => {
        setData((snapshot.data() as T) ?? null)
        setLoading(false)
      },
      snapshotError => {
        console.error(snapshotError)
        setError(snapshotError)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  return { data, loading, error }
}

