
import process from 'node:process';
import { isIP } from 'node:net';
import { ipAddress } from '@vercel/functions';

function isValidDomain(value: string): boolean {
  if (value.length > 253 || !value.includes('.')) return false;

  const labels = value.split('.');
  const validLabel =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

  return (
    labels.every((label) => validLabel.test(label)) &&
    /^[a-zA-Z]{2,63}$/.test(labels[labels.length - 1])
  );
}

function getUpstreamErrorCode(value: unknown): string | null {
  if (typeof value !== 'object' || value === null) return null;

  const data = value as Record<string, unknown>;
  const code = data.code ?? data.errorCode;

  return typeof code === 'string' &&
    /^[A-Za-z0-9_-]{1,60}$/.test(code)
    ? code
    : null;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return Response.json(
        { error: 'Method not allowed.' },
        { status: 405, headers: { Allow: 'GET' } }
      );
    }

    const url = new URL(request.url);
    const useMyIp = url.searchParams.get('self') === '1';

    // Read the visitor IP from Vercel's request headers
    const query = useMyIp
      ? ipAddress(request) ?? ''
      : url.searchParams.get('query')?.trim() ?? '';

    // Validate the detected IP before using it
    if (useMyIp && !isIP(query)) {
      return Response.json(
        {
          error:
            'Unable to detect your public IP. Please try the deployed website.'
        },
        { status: 422 }
      );
    }

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

    const endpoint = new URL(
      'https://geo.ipify.org/api/v2/country,city'
    );

    endpoint.searchParams.set('apiKey', apiKey);
    endpoint.searchParams.set(
      ipVersion ? 'ipAddress' : 'domain',
      query
    );

    try {
      const response = await fetch(endpoint, {
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        let errorCode: string | null = null;

        try {
          const errorData: unknown = await response.json();
          errorCode = getUpstreamErrorCode(errorData);
        } catch {
          // Upstream response may not be JSON
        }

        console.error('GeoIPify upstream error:', {
          status: response.status,
          code: errorCode ?? 'Not provided'
        });

        return Response.json(
          { error: 'Unable to retrieve location data.' },
          { status: 502 }
        );
      }

      const data: unknown = await response.json();

      return Response.json(data, {
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    } catch (error) {
      console.error(
        'GeoIPify connection error:',
        error instanceof Error ? error.name : 'Unknown'
      );

      return Response.json(
        { error: 'The lookup service is temporarily unavailable.' },
        { status: 502 }
      );
    }
  }
};
