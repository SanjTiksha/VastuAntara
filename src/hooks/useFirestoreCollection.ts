import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, orderBy, query, type QueryConstraint } from 'firebase/firestore'
import { firestore } from '../lib/firebase'

export interface FirestoreCollectionOptions {
  orderField?: string | null
  constraints?: QueryConstraint[]
}

const EMPTY_CONSTRAINTS: QueryConstraint[] = []

export default function useFirestoreCollection<T = Record<string, unknown>>(
  collectionName: string,
  options: FirestoreCollectionOptions = {},
) {
  const { orderField = null, constraints } = options
  const constraintList = useMemo(() => constraints ?? EMPTY_CONSTRAINTS, [constraints])
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!collectionName) {
      setData([])
      setLoading(false)
      return
    }

    if (!firestore) {
      setLoading(false)
      return
    }

    const baseRef = collection(firestore, collectionName)
    const finalQuery =
      orderField && orderField.length > 0
        ? query(baseRef, orderBy(orderField, 'asc'), ...constraintList)
        : query(baseRef, ...constraintList)

    const unsubscribe = onSnapshot(
      finalQuery,
      snapshot => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[]
        setData(docs)
        setLoading(false)
      },
      snapshotError => {
        console.error(snapshotError)
        setError(snapshotError)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [collectionName, orderField, constraintList])

  return { data, loading, error }
}

