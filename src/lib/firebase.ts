import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const defaultFirebaseConfig = Object.freeze({
  apiKey: 'AIzaSyAlBEEcMfNTl8uxZ02SrmalEUCdzqmvC3Y',
  authDomain: 'vastuantara-97813.firebaseapp.com',
  projectId: 'vastuantara-97813',
  storageBucket: 'vastuantara-97813.firebasestorage.app',
  messagingSenderId: '1093811332445',
  appId: '1:1093811332445:web:940974e8d9fe11578db4b4',
})

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? defaultFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? defaultFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? defaultFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? defaultFirebaseConfig.appId,
}

const requiredKeys: Array<keyof typeof firebaseConfig> = ['apiKey', 'authDomain', 'projectId', 'appId']

export const hasFirebaseConfig = requiredKeys.every(key => {
  const value = firebaseConfig[key]
  return typeof value === 'string' && value.length > 0 && !value.startsWith('VITE_')
})

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const firestore = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const storage = getStorage(app)


