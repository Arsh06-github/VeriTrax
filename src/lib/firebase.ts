// Firebase configuration and initialization
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('Dummy');

// Initialize Firebase only if configured
let app;
let auth;
let db;
let googleProvider;
let analytics;

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} else {
  console.warn('⚠️ Firebase is not configured. Please set up Firebase credentials in .env.local');
  console.warn('📖 See FIREBASE_SETUP_INSTRUCTIONS.md for setup guide');
  // Create mock instances to prevent errors
  auth = null as any;
  db = null as any;
  googleProvider = null as any;
  analytics = null as any;
}

export { auth, db, googleProvider, analytics, isFirebaseConfigured };

// User types
export type UserType = 'personal' | 'organization';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  userType: UserType;
  walletAddress?: string;
  organizationName?: string;
  organizationDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth functions
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
  userType: UserType,
  organizationName?: string
) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please set up Firebase credentials.');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile
  await updateProfile(user, { displayName });

  // Create user document in Firestore
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName,
    userType,
    organizationName: userType === 'organization' ? organizationName : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);

  return userCredential;
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please set up Firebase credentials.');
  }
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (userType: UserType) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please set up Firebase credentials.');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if user document exists
  const userDoc = await getDoc(doc(db, 'users', user.uid));

  if (!userDoc.exists()) {
    // Create new user document
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || 'Anonymous',
      userType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
  }

  return result;
};

export const logOut = async () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please set up Firebase credentials.');
  }
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!isFirebaseConfigured) {
    return null;
  }
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please set up Firebase credentials.');
  }
  await updateDoc(doc(db, 'users', uid), {
    ...updates,
    updatedAt: new Date(),
  });
};
