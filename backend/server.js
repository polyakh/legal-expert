import "./config/env.js";

import { app } from "./app.js";
import { NODE_ENV, PORT } from "./config/env.js";

// export async function applyCorsIfNeeded(app, env) {
//     if (NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
//       const { default: cors } = await import('cors');
//       app.use(cors({
//         origin: CORS_ORIGINS[env],
//         // credentials: true
//       }));
//     }
//   }

const server = app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
