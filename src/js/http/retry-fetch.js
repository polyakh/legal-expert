import { HttpError } from "./errors.js";
import { sleep } from "./shared.js";

/**
 * @implements {FetchStrategy}
 *
 * A retrying fetch service following SOLID principles.
 */
export class RetryFetchService {
  constructor({
    fetchStrategy,
    backoffStrategy,
    responseParser,
    timeoutMs = 5000,
    retryStatusCodes = [408, 429, 500, 502, 503, 504],
    maxRetries = 3,
    onRetry = (attempt, err, delay) =>
      console.warn(
        `⚠️ Attempt ${attempt}/${maxRetries + 1} failed: ${err.message}. Retrying in ${delay}ms…`
      ),
  }) {
    this.fetcher = fetchStrategy;
    this.backoff = backoffStrategy;
    this.parser = responseParser;
    this.timeoutMs = timeoutMs;
    this.retryStatusCodes = retryStatusCodes;
    this.maxRetries = maxRetries;
    this.onRetry = onRetry;
  }

  async fetch(url, options = {}) {
    this.backoff.reset();
    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const res = await this.fetcher.fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new HttpError(res);
        return this.parser.parse(res);
      } catch (err) {
        clearTimeout(timeoutId);

        if (attempt > this.maxRetries) throw err;

        const isAbort = err.name === "AbortError";
        const isHttpRetry = err instanceof HttpError && this.retryStatusCodes.includes(err.status);
        if (!isAbort && !isHttpRetry) throw err;

        const delay = this.backoff.getNextDelay();
        this.onRetry(attempt, err, delay);
        await sleep(delay);
      }
    }
  }
}
