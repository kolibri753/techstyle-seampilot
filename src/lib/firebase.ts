import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  onAuthStateChanged,
  signOut,
  browserLocalPersistence,
  type User,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { env } from './env'

const config = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MSG_SENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID,
}

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(config)

export const auth = getAuth(app)
auth.setPersistence(browserLocalPersistence)

export const db = getFirestore(app)
export const storage = getStorage(app)

export let analytics: Analytics | undefined
if (typeof window !== 'undefined' && import.meta.env.MODE === 'production') {
  isSupported().then((ok) => {
    if (ok) analytics = getAnalytics(app)
  })
}

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const listenAuth = (cb: (u: User | null) => void) => onAuthStateChanged(auth, cb)
export const signInAnon = () => signInAnonymously(auth)
export const signInWithGoogle = () => signInWithPopup(auth, provider)

export const upgradeAnonymousWithGoogle = async () => {
  const u = auth.currentUser
  if (u?.isAnonymous) {
    try {
      await linkWithPopup(u, provider)
    } catch (e: unknown) {
      await signInWithPopup(auth, provider)
    }
  } else {
    await signInWithPopup(auth, provider)
  }
}

export const signOutUser = () => signOut(auth)
