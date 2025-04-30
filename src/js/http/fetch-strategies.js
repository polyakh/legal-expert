/**
 * @interface FetchStrategy
 * @method fetch(url: string, options: RequestInit): Promise<Response>
 */

/**
 * Default implementation that delegates to the global `fetch`.
 */
export class DefaultFetchStrategy {
  async fetch(url, options) {
    return fetch(url, options);
  }
}
