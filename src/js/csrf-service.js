import { HttpError } from "./http/errors.js";
import { DefaultFetchStrategy } from "./http/fetch-strategies.js";
import { ExponentialBackoff } from "./http/backoff.js";
import { JsonParser } from "./http/response-parsers.js";
import { RetryFetchService } from "./http/retry-fetch.js";

const defaultFetchStrategy = new DefaultFetchStrategy();
const defaultBackoff = new ExponentialBackoff();
const csrfJsonParser = new JsonParser("csrfToken");

const csrfRetryService = new RetryFetchService({
  fetchStrategy: defaultFetchStrategy,
  backoffStrategy: defaultBackoff,
  responseParser: csrfJsonParser,
  timeoutMs: 5000,
  maxRetries: 3,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
});

/**
 * Fetches and injects CSRF token into the specified input.
 *
 * @param {string} tokenSelector – CSS selector for the <input>
 * @returns {Promise<string|null>}
 */
export async function loadCsrfToken(tokenSelector = "#csrfToken") {
  try {
    const token = await csrfRetryService.fetch("/api/csrf-token", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    const input = document.querySelector(tokenSelector);
    if (input) {
      input.value = token;
      console.info("✅ CSRF token injected.");
    } else {
      console.warn(`⚠️ No element matches selector "${tokenSelector}"`);
    }

    return token;
  } catch (err) {
    if (err instanceof HttpError) {
      switch (err.status) {
        case 404:
          console.error("❌ CSRF endpoint not found (404).");
          break;
        case 401:
          console.error("❌ Unauthorized (401).");
          break;
        default:
          console.error(`❌ HTTP ${err.status}: ${err.response.statusText}`);
      }
    } else if (err.name === "AbortError") {
      console.error("❌ CSRF token request timed out.");
    } else {
      console.error("❌ Failed to load CSRF token:", err);
    }
    return undefined;
  }
}
