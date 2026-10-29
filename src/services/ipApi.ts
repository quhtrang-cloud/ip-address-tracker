
import type { IpLookupResult } from '../types/ip';

async function requestLookup(url: string): Promise<IpLookupResult> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });
  } catch {
    throw new Error('Could not connect to the lookup service.');
  }

  const contentType = response.headers.get('content-type') ?? '';

  // Detect incorrectly configured local API routes
  if (!contentType.includes('application/json')) {
    throw new Error(
      'The lookup API is not available. Run the project with Vercel Dev or use the deployed website.'
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error('The lookup service returned invalid JSON.');
  }

  if (!response.ok) {
    if (
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof data.error === 'string'
    ) {
      throw new Error(data.error);
    }

    throw new Error('Unable to retrieve IP location data.');
  }

  return data as IpLookupResult;
}

// Search a specific IP address or domain
export function lookupIp(query: string): Promise<IpLookupResult> {
  const params = new URLSearchParams({ query: query.trim() });

  return requestLookup(`/api/lookup?${params.toString()}`);
}

// Search the current visitor's public IP
export function lookupMyIp(): Promise<IpLookupResult> {
  return requestLookup('/api/lookup?self=1');
}
