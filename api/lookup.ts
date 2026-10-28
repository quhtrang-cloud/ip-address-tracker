import process from 'node:process';
import { isIP } from 'node:net';

function isValidDomain(value: string): boolean {
  if (value.length > 253 || !value.includes('.')) return false;

  const labels = value.split('.');
  const validLabel = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

  return labels.every((label) => validLabel.test(label)) &&
    /^[a-zA-Z]{2,63}$/.test(labels[labels.length - 1]);
}

// Validate requests before calling the external API
export default {
  async fetch(request: Request) {
    if (request.method !== 'GET') {
      return Response.json(
        { error: 'Method not allowed.' },
        { status: 405, headers: { Allow: 'GET' } }
      );
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.trim() ?? '';
    const ipVersion = isIP(query);

    if (!query || (!ipVersion && !isValidDomain(query))) {
      return Response.json(
        { error: 'Please enter a valid IP address or domain.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEOIPIFY_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'IP lookup service is not configured.' },
        { status: 503 }
      );
    }

    const endpoint = new URL('https://geo.ipify.org/api/v2/country,city');
    endpoint.searchParams.set('apiKey', apiKey);
    endpoint.searchParams.set(ipVersion ? 'ipAddress' : 'domain', query);

    try {
      const response = await fetch(endpoint, {
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        // Log only the upstream status, never the API key or request URL
        console.error('GeoIPify request failed:', response.status);

        return Response.json(
          { error: 'Unable to retrieve location data.' },
          { status: 502 }
        );
      }

      const data = await response.json();

      return Response.json(data, {
        headers: { 'Cache-Control': 'no-store' }
      });
    } catch (error) {
      console.error('GeoIPify request failed before receiving a response:',
        error instanceof Error ? error.name : 'Unknown error');

      return Response.json(
        { error: 'The lookup service is temporarily unavailable.' },
        { status: 502 }
      );
    }
  }
};
