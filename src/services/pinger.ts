import { request } from 'undici';

export interface PingResult {
  success: boolean;
  url: string;
  statusCode?: number;
  responseTime: number;
  error: string | null;
  attempt: number;
}

/**
 * Pings a URL with retry logic.
 * @param url - Target URL
 * @param retries - Number of retries on failure (default 0)
 * @returns Ping result object
 */
export async function ping(url: string, retries: number = 0): Promise<PingResult> {
  let lastResult: PingResult | undefined;

  for (let i = 0; i <= retries; i++) {
    const start = performance.now();
    try {
      const { statusCode } = await request(url, {
        method: 'GET',
        headersTimeout: 5000,
        bodyTimeout: 5000
      });

      const responseTime = Math.round(performance.now() - start);
      lastResult = {
        success: statusCode >= 200 && statusCode < 300,
        url,
        statusCode,
        responseTime,
        error: statusCode >= 300 ? `Status code: ${statusCode}` : null,
        attempt: i + 1
      };
    } catch (err: any) {
      const responseTime = Math.round(performance.now() - start);
      lastResult = {
        success: false,
        url,
        responseTime,
        error: err.message,
        attempt: i + 1
      };
    }

    // If successful, stop retrying
    if (lastResult.success) return lastResult;

    // If we have more retries, wait a bit before next attempt (backoff)
    if (i < retries) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  return lastResult!;
}
