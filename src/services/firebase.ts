import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Configuration priority:
// 1. Vite environment variables (VITE_FIREBASE_*) - essential for Vercel/GitHub deployments
// 2. Bundled firebase-applet-config.json - provided automatically by AI Studio
export const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    firebaseConfigJson.apiKey ||
    'AIzaSyDRBP_vAi0o_ueg68xmcYcAMRrayTO78Ew',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    firebaseConfigJson.authDomain ||
    'new-zazzle.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    firebaseConfigJson.projectId ||
    'new-zazzle',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    firebaseConfigJson.storageBucket ||
    'new-zazzle.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    firebaseConfigJson.messagingSenderId ||
    '358856200929',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    firebaseConfigJson.appId ||
    '1:358856200929:web:ffde587c974363fe371da0',
};

export const FIRESTORE_DATABASE_ID =
  import.meta.env.VITE_FIREBASE_DATABASE_ID ||
  firebaseConfigJson.firestoreDatabaseId ||
  '(default)';

// Initialize singletons
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Auth instance
export const auth: Auth = getAuth(app);

// Firestore instance (with databaseId support if custom, or default)
// Initialize with experimentalForceLongPolling to ensure reliable connections through proxies,
// preview iframes, and network environments where standard streaming WebChannel connections fail.
let firestoreDb: Firestore;
try {
  const settings = {
    experimentalForceLongPolling: true,
  };
  firestoreDb =
    FIRESTORE_DATABASE_ID && FIRESTORE_DATABASE_ID !== '(default)'
      ? initializeFirestore(app, settings, FIRESTORE_DATABASE_ID)
      : initializeFirestore(app, settings);
} catch {
  firestoreDb =
    FIRESTORE_DATABASE_ID && FIRESTORE_DATABASE_ID !== '(default)'
      ? getFirestore(app, FIRESTORE_DATABASE_ID)
      : getFirestore(app);
}

export const db: Firestore = firestoreDb;

// Storage instance
export const storage: FirebaseStorage = getStorage(app);

export default app;
