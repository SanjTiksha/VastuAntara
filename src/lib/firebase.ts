import type { FirebaseApp } from 'firebase/app'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredKeys: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
]

const hasFirebaseConfig = requiredKeys.every(key => {
  const value = firebaseConfig[key]
  return typeof value === 'string' && value.length > 0 && !value.startsWith('VITE_')
})

let app: FirebaseApp | undefined
let firestoreInstance: Firestore | null = null
let authInstance: Auth | null = null
let googleProviderInstance: GoogleAuthProvider | null = null

if (hasFirebaseConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  firestoreInstance = getFirestore(app)
  authInstance = getAuth(app)
  googleProviderInstance = new GoogleAuthProvider()
} else if (import.meta.env.DEV) {
  console.warn(
    '[firebase] Missing configuration. Firebase services are disabled. Add VITE_FIREBASE_* variables to enable auth and Firestore.',
  )
}

export { hasFirebaseConfig }
export const firestore = firestoreInstance
export const auth = authInstance
export const googleProvider = googleProviderInstance

