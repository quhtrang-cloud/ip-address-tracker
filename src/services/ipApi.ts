
import type { IpLookupResult } from '../types/ip';

export async function lookupIp(query: string): Promise<IpLookupResult> {
  const params = new URLSearchParams({ query: query.trim() });
  const response = await fetch(`/api/lookup?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to look up this IP address or domain.');
  }

  return (await response.json()) as IpLookupResult;
}
