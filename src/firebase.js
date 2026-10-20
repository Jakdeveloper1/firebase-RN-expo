// Step 4 of the roadmap: initialise the Firebase SDK once and export auth + db.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const firstTime = getApps().length === 0;
const app = firstTime ? initializeApp(firebaseConfig) : getApp();

// On phones, keep the user signed in between app restarts using AsyncStorage.
// initializeAuth may only be called once, so guard against fast-refresh re-runs.
export const auth =
  Platform.OS === 'web' || !firstTime
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);
