import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import admin from 'firebase-admin';

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

function resolveServiceAccount() {
  if (serviceAccountJson) {
    return JSON.parse(serviceAccountJson);
  }

  if (!serviceAccountPath) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in environment.');
  }

  const absolutePath = path.isAbsolute(serviceAccountPath)
    ? serviceAccountPath
    : path.resolve(process.cwd(), serviceAccountPath);

  return JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
}

if (!admin.apps.length) {
  const serviceAccount = resolveServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    ...(databaseURL ? { databaseURL } : {}),
  });
}

const auth = admin.auth();
const firestore = admin.firestore();
const rtdb = admin.database();

export { admin, auth, firestore, rtdb };
