import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { forceLongPolling, forceWebSockets, getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCGBKzLFsXam01kCw_QMjHJmeHfFYfelzE',
  authDomain: 'bvf-student-support.firebaseapp.com',
  projectId: 'bvf-student-support',
  storageBucket: 'bvf-student-support.firebasestorage.app',
  messagingSenderId: '783465744194',
  appId: '1:783465744194:web:dcc8a99142b29ddbebaadb',
  measurementId: 'G-VMYG2ZGJQ4',
  databaseURL: 'https://bvf-student-support-default-rtdb.firebaseio.com',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const defaultDatabaseTransportPreference = import.meta.env.DEV ? 'long-polling' : 'auto';

const databaseTransportPreference = String(
  import.meta.env.VITE_FIREBASE_DATABASE_TRANSPORT || defaultDatabaseTransportPreference,
)
  .trim()
  .toLowerCase();

if (databaseTransportPreference === 'long-polling') {
  forceLongPolling();
} else if (databaseTransportPreference === 'websocket') {
  forceWebSockets();
}

const db = getDatabase(app);

export { app, auth, db, firebaseConfig, googleProvider };
