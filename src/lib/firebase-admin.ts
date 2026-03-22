import * as admin from 'firebase-admin';

let isInitialized = false;

if (!admin.apps.length) {
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      isInitialized = true;
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase Admin initialization error', error);
    }
  } else {
    console.warn('Firebase Admin keys missing in .env.local; Admin SDK disabled.');
  }
} else {
  isInitialized = true;
}

export const adminAuth = isInitialized ? admin.auth() : null;
