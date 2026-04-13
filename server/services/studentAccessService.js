import { rtdb } from '../firebaseAdmin.js';

export async function isStudentAccount(uid) {
  if (!uid) {
    return false;
  }

  const snapshot = await rtdb.ref(`students/${uid}`).get();
  return snapshot.exists();
}
