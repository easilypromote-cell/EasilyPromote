const crypto = require("crypto");

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_LENGTH = 6;

const otpStore = new Map();

function generateOTP() {
  const buffer = crypto.randomBytes(Math.ceil(OTP_LENGTH / 2));
  return buffer.toString("hex").slice(0, OTP_LENGTH).toUpperCase();
}

function storeOTP(email, purpose) {
  const otp = generateOTP();
  const key = `${email}:${purpose}`;
  otpStore.set(key, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  });
  return otp;
}

function verifyOTP(email, purpose, candidate) {
  const key = `${email}:${purpose}`;
  const record = otpStore.get(key);

  if (!record) {
    return { valid: false, error: "No OTP found. Request a new one." };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return { valid: false, error: "OTP has expired. Request a new one." };
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(key);
    return { valid: false, error: "Too many attempts. Request a new OTP." };
  }

  if (record.otp !== candidate.toUpperCase()) {
    return { valid: false, error: "Invalid OTP." };
  }

  otpStore.delete(key);
  return { valid: true };
}

module.exports = { generateOTP, storeOTP, verifyOTP };
