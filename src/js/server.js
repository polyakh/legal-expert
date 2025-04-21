
import './config/env.js'

import { app } from './app.js'

import { NODE_ENV, PORT } from './config/env.js'
// import { ENVIRONMENTS , CORS_ORIGINS} from './env.constants.js'


// const formLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,  // 15‑minute window
//     max: 5,                  // limit each IP to 200 form submissions per window
//     standardHeaders: true,     // RFC‑compliant RateLimit headers
//     legacyHeaders: false,      // disable X‑RateLimit-* headers
//     message: {
//       status: 429,
//       error: 'Too many submissions; please wait before trying again.',
//     },

//   });
  
// export async function applyCorsIfNeeded(app, env) {
//     if (NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
//       const { default: cors } = await import('cors');
//       app.use(cors({
//         origin: CORS_ORIGINS[env],
//         // credentials: true
//       }));
//     }
//   }



// app.listen(PORT)


const server = app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});



// app.post('/submit-form', formLimiter, (req, res) => {
//   // Log headers to debug
// console.log('Headers:', req.headers);
// // your form‑handling logic
// res.json({ status: 'success' });
// });