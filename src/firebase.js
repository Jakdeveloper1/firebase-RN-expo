// Step 4 of the roadmap: initialise the Firebase SDK once and export auth + db.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCXf-kY8AVfZJpdmKbUZuLTEdMwFI02ZhI",
  authDomain: "sampleapp-63862.firebaseapp.com",
  projectId: "sampleapp-63862",
  storageBucket: "sampleapp-63862.firebasestorage.app",
  messagingSenderId: "354910534141",
  appId: "1:354910534141:web:49d001e0ef49443d2dc194",
  measurementId: "G-9TZJHNDXWD"
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
