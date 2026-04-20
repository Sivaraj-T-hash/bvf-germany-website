import { auth, firestore } from '../firebaseAdmin.js';
import { sendTemporaryPasswordEmail, sendWelcomeEmail } from '../services/mailService.js';
import { generateTempPassword, hashPassword, verifyPassword } from '../services/tempPasswordService.js';
import { isStudentAccount } from '../services/studentAccessService.js';

const PASSWORD_RESET_FLAGS_COLLECTION = 'passwordResetFlags';
const WELCOME_EMAIL_FLAGS_COLLECTION = 'welcomeEmailFlags';
const TEMP_PASSWORD_TTL_MS = 15 * 60 * 1000;

const FORGOT_PASSWORD_RESPONSE = {
  success: true,
  message: 'If the account exists, a temporary password has been sent.',
};

function getIdTokenFromRequest(req) {
  const rawHeader = req.headers.authorization;
  if (rawHeader?.startsWith('Bearer ')) {
    return rawHeader.slice(7).trim();
  }

  if (typeof req.body.idToken === 'string') {
    return req.body.idToken.trim();
  }

  return '';
}

async function verifyUserFromRequest(req) {
  const idToken = getIdTokenFromRequest(req);
  if (!idToken) {
    return null;
  }

  return auth.verifyIdToken(idToken);
}

function buildPasswordStatus(docData) {
  if (!docData || !docData.mustChangePassword) {
    return {
      mustChangePassword: false,
      isExpired: false,
      expiresAt: null,
    };
  }

  const expiresAt = Number(docData.tempPasswordExpiresAt || 0);
  const isExpired = Number.isFinite(expiresAt) && expiresAt > 0 ? Date.now() > expiresAt : false;

  return {
    mustChangePassword: true,
    isExpired,
    expiresAt: Number.isFinite(expiresAt) && expiresAt > 0 ? expiresAt : null,
  };
}

export async function forgotPassword(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error) {
      if (error?.code === 'auth/user-not-found') {
        return res.json(FORGOT_PASSWORD_RESPONSE);
      }
      throw error;
    }

    const studentAccount = await isStudentAccount(userRecord.uid);
    if (!studentAccount) {
      return res.json(FORGOT_PASSWORD_RESPONSE);
    }

    const temporaryPassword = generateTempPassword();
    const { salt, hash } = hashPassword(temporaryPassword);
    const expiresAt = Date.now() + TEMP_PASSWORD_TTL_MS;

    await auth.updateUser(userRecord.uid, {
      password: temporaryPassword,
    });

    await firestore.collection(PASSWORD_RESET_FLAGS_COLLECTION).doc(userRecord.uid).set(
      {
        email,
        mustChangePassword: true,
        tempPasswordHash: hash,
        tempPasswordSalt: salt,
        tempPasswordExpiresAt: expiresAt,
        updatedAt: Date.now(),
      },
      { merge: true },
    );

    await sendTemporaryPasswordEmail(email, temporaryPassword);

    return res.json(FORGOT_PASSWORD_RESPONSE);
  } catch (error) {
    console.error('forgotPassword failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to process forgot password request.',
    });
  }
}

export async function passwordStatus(req, res) {
  try {
    const decoded = await verifyUserFromRequest(req);

    if (!decoded?.uid) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const flagsSnapshot = await firestore.collection(PASSWORD_RESET_FLAGS_COLLECTION).doc(decoded.uid).get();
    const status = buildPasswordStatus(flagsSnapshot.exists ? flagsSnapshot.data() : null);

    return res.json({ success: true, ...status });
  } catch (error) {
    console.error('passwordStatus failed:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
}

export async function changePassword(req, res) {
  try {
    const decoded = await verifyUserFromRequest(req);

    if (!decoded?.uid) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const temporaryPassword = String(req.body.temporaryPassword || '');
    const newPassword = String(req.body.newPassword || '');
    const confirmPassword = String(req.body.confirmPassword || '');

    if (!temporaryPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const studentAccount = await isStudentAccount(decoded.uid);
    if (!studentAccount) {
      return res.status(403).json({ success: false, message: 'This action is only available for student accounts.' });
    }

    const flagsRef = firestore.collection(PASSWORD_RESET_FLAGS_COLLECTION).doc(decoded.uid);
    const flagsSnapshot = await flagsRef.get();

    if (!flagsSnapshot.exists) {
      return res.status(400).json({ success: false, message: 'No temporary password flow is active for this account.' });
    }

    const flags = flagsSnapshot.data();
    const status = buildPasswordStatus(flags);

    if (!status.mustChangePassword) {
      return res.status(400).json({ success: false, message: 'No temporary password flow is active for this account.' });
    }

    if (status.isExpired) {
      return res.status(400).json({ success: false, message: 'Temporary password expired. Request a new one.' });
    }

    if (!flags?.tempPasswordSalt || !flags?.tempPasswordHash) {
      return res.status(400).json({ success: false, message: 'Temporary password data is missing. Request a new one.' });
    }

    const temporaryPasswordMatches = verifyPassword(
      temporaryPassword,
      String(flags.tempPasswordSalt),
      String(flags.tempPasswordHash),
    );

    if (!temporaryPasswordMatches) {
      return res.status(400).json({ success: false, message: 'Temporary password is incorrect.' });
    }

    await auth.updateUser(decoded.uid, {
      password: newPassword,
    });

    await flagsRef.set(
      {
        mustChangePassword: false,
        tempPasswordHash: null,
        tempPasswordSalt: null,
        tempPasswordExpiresAt: null,
        passwordChangedAt: Date.now(),
        updatedAt: Date.now(),
      },
      { merge: true },
    );

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('changePassword failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to update password.' });
  }
}

export async function sendWelcomeSignupEmail(req, res) {
  try {
    const decoded = await verifyUserFromRequest(req);

    if (!decoded?.uid || !decoded.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const studentAccount = await isStudentAccount(decoded.uid);
    if (!studentAccount) {
      return res.status(403).json({ success: false, message: 'This action is only available for student accounts.' });
    }

    const flagsRef = firestore.collection(WELCOME_EMAIL_FLAGS_COLLECTION).doc(decoded.uid);
    const flagsSnapshot = await flagsRef.get();
    if (flagsSnapshot.exists && flagsSnapshot.data()?.sentAt) {
      return res.json({ success: true, message: 'Welcome email already sent.' });
    }

    const requestedName = String(req.body.name || '').trim();
    const safeName = requestedName || String(decoded.name || decoded.email.split('@')[0] || 'Student');

    await sendWelcomeEmail(decoded.email, safeName);

    await flagsRef.set(
      {
        email: decoded.email,
        sentAt: Date.now(),
        updatedAt: Date.now(),
      },
      { merge: true },
    );

    return res.json({ success: true, message: 'Welcome email sent.' });
  } catch (error) {
    console.error('sendWelcomeSignupEmail failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to send welcome email right now.' });
  }
}
