
import type { IpLookupResult } from '../types/ip';

async function requestLookup(
  url: string,
  signal?: AbortSignal
): Promise<IpLookupResult> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      },
      signal
    });
  } catch (error) {
    // Preserve intentional request cancellation
    if (signal?.aborted) {
      throw error;
    }

    throw new Error(
      'Could not connect to the lookup service.'
    );
  }

  // Check if the backend returned JSON
  const contentType =
    response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    throw new Error(
      'The lookup API is not available. Run the project with Vercel Dev or use the deployed website.'
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    // Do not report cancelled requests as invalid JSON
    if (signal?.aborted) {
      throw new DOMException(
        'Request cancelled.',
        'AbortError'
      );
    }

    throw new Error(
      'The lookup service returned invalid JSON.'
    );
  }

  // Handle unsuccessful API responses
  if (!response.ok) {
    if (
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof data.error === 'string'
    ) {
      throw new Error(data.error);
    }

    throw new Error(
      'Unable to retrieve IP location data.'
    );
  }

  // Handle cancellation that happened during response processing
  if (signal?.aborted) {
    throw new DOMException(
      'Request cancelled.',
      'AbortError'
    );
  }

  return data as IpLookupResult;
}

// Look up an IPv4, IPv6 address, or domain
export function lookupIp(
  query: string,
  signal?: AbortSignal
): Promise<IpLookupResult> {
  const params = new URLSearchParams({
    query: query.trim()
  });

  return requestLookup(
    `/api/lookup?${params.toString()}`,
    signal
  );
}

// Look up the visitor's public IP address
export function lookupMyIp(
  signal?: AbortSignal
): Promise<IpLookupResult> {
  return requestLookup(
    '/api/lookup?self=1',
    signal
  );
}
