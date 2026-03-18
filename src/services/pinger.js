import { request } from 'undici';

export async function ping(url) {
  const start = performance.now();
  try {
    const { statusCode } = await request(url, {
      method: 'GET',
      headersTimeout: 5000,
      bodyTimeout: 5000
    });

    const responseTime = Math.round(performance.now() - start);
    if (statusCode >= 200 && statusCode < 300) {
      return { success: true, url, statusCode, responseTime };
    }
    return { success: false, url, statusCode, responseTime, error: `Status code: ${statusCode}` };
  } catch (err) {
    const responseTime = Math.round(performance.now() - start);
    return { success: false, url, responseTime, error: err.message };
  }
}
