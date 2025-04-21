
import crypto from 'crypto';
import { doubleCsrf } from 'csrf-csrf';

export function generateCustomToken(res) {
  const token = crypto.randomBytes(32).toString('hex');
  
  // Create a secret for the server to validate against
  const secret = process.env.CSRF_SECRET || 'default-secret-for-development';
  
  // Set the cookie manually
  res.cookie('_csrf', secret, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  });
  
  return token;
}
export function sendCsrfToken(_req, res) {
    const token = generateCustomToken(res);
    res.status(200).json({ csrfToken: token });
  }