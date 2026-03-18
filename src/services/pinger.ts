export interface PingResult {
  success: boolean;
  url: string;
  statusCode?: number;
  responseTime: number;
  error: string | null;
  attempt: number;
}

const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

export async function ping(url: string, retries = 0): Promise<PingResult> {
  let lastResult: PingResult = {
    success: false,
    url,
    responseTime: 0,
    error: 'No attempts made',
    attempt: 0,
  };

  for (let i = 0; i <= retries; i++) {
    const start = performance.now();
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
        redirect: 'follow',
      });

      const responseTime = Math.round(performance.now() - start);
      const statusCode = response.status;
      const success = statusCode >= 200 && statusCode < 400;

      lastResult = {
        success,
        url,
        statusCode,
        responseTime,
        error: success ? null : `HTTP ${statusCode}`,
        attempt: i + 1,
      };
    } catch (err: any) {
      lastResult = {
        success: false,
        url,
        responseTime: Math.round(performance.now() - start),
        error: err.message,
        attempt: i + 1,
      };
    }

    if (lastResult.success) return lastResult;

    // Don't retry on non-retryable status codes
    if (lastResult.statusCode && !RETRYABLE_STATUSES.has(lastResult.statusCode)) {
      return lastResult;
    }

    if (i < retries) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  return lastResult;
}