import path from 'path';
import dotenvx from '@dotenvx/dotenvx';           // ESModule import  [oai_citation_attribution:4‡dotenvx](https://dotenvx.com/docs/install?utm_source=chatgpt.com)

dotenvx.config({
  path: path.resolve(process.cwd(), '.env'),                                   // default, can specify multiple
});                                               // Initializes config per Twelve‑Factor  [oai_citation_attribution:5‡12factor.net](https://12factor.net/?utm_source=chatgpt.com)

export const {
  PORT = 3000,                                    // default port
  NODE_ENV = 'development',
  ...restEnv
} = process.env;