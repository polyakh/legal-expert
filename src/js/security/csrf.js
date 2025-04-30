import { doubleCsrf } from "csrf-csrf";

const isProduction = process.env.NODE_ENV === "production";

export const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,

  // If using sessions, bind token to session ID for extra security
  // getSessionIdentifier: (req) => req.session?.id || "",  // '' if no session

  // Use Host prefix in production for cookie name, fallback to non-prefixed in dev
  cookieName: isProduction ? "__Host-csrf-token" : "_csrf",

  cookieOptions: {
    httpOnly: true, // JS can't access the cookie
    secure: isProduction, // cookie sent only over HTTPS in prod
    sameSite: "strict", // or "lax" based on application needs
    path: "/", // cookie is valid for entire site
    // no 'domain' specified -> cookie is host-only
  },

  // Accept token from body or header. (Never pull from the cookie here!)
  getTokenFromRequest: (req) => {
    return req.body.csrfToken || req.headers["x-csrf-token"] || req.headers["x-xsrf-token"]; // (include common alternate header name just in case)
  },

  // Use default ignoredMethods (GET, HEAD, OPTIONS) - no need to redefine if unchanged
  // ignoredMethods: ["GET", "HEAD", "OPTIONS"],

  // 64-byte tokens for strong entropy (default). Could use 32 for smaller token if needed.
  size: 64,
});
