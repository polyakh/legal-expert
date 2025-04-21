import { doubleCsrf } from 'csrf-csrf';

export const {
  doubleCsrfProtection
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: '_csrf',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  },
  getTokenFromRequest: req => {
    if (req.body && req.body.csrfToken) return req.body.csrfToken;
    if (req.headers && req.headers['x-csrf-token']) return req.headers['x-csrf-token'];
    return null;
  }
});
