import { randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';

const TEMP_PASSWORD_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$';

export function generateTempPassword(length = 10) {
  let password = '';

  for (let index = 0; index < length; index += 1) {
    const charIndex = randomInt(TEMP_PASSWORD_CHARSET.length);
    password += TEMP_PASSWORD_CHARSET.charAt(charIndex);
  }

  return password;
}

export function generateResetOtp(length = 6) {
  let otp = '';

  for (let index = 0; index < length; index += 1) {
    otp += String(randomInt(10));
  }

  return otp;
}

export function hashPassword(plainText, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(plainText, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(plainText, salt, expectedHash) {
  const computedHash = scryptSync(plainText, salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, 'hex');

  if (computedHash.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(computedHash, expectedBuffer);
}
