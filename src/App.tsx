
import { useEffect, useRef, useState } from 'react';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import IpSummary from './components/IpSummary';
import LocationMap from './components/LocationMap';
import LocationDetails from './components/LocationDetails';
import RecentSearches from './components/RecentSearches';

import { lookupIp, lookupMyIp } from './services/ipApi';
import type { IpLookupResult } from './types/ip';

import './App.css';

interface RecentSearch {
  query: string;
  location: string;
  searchedAt: string;
}

const STORAGE_KEY = 'iptracker-recent-searches';
const MAX_RECENT_SEARCHES = 5;

// Example data displayed before the first successful lookup
const DEFAULT_LOCATION = {
  ip: '8.8.8.8',
  city: 'Mountain View',
  region: 'California',
  country: 'United States',
  latitude: 37.3861,
  longitude: -122.0839,
  timezone: 'America/Los_Angeles',
  utcOffset: 'UTC−7',
  isp: 'Google LLC',
  asn: 'AS15169'
};

// Restore and validate locally saved searches
function loadRecentSearches(): RecentSearch[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is RecentSearch =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.query === 'string' &&
          typeof item.location === 'string' &&
          typeof item.searchedAt === 'string'
      )
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

// Format a readable location label
function formatLocation(
  city?: string,
  region?: string,
  fallback = 'Unknown location'
): string {
  return [city, region].filter(Boolean).join(', ') || fallback;
}

function App() {
  const [result, setResult] = useState<IpLookupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [recentSearches, setRecentSearches] =
    useState<RecentSearch[]>(loadRecentSearches);

  // Prevent overlapping requests before React updates state
  const requestInProgress = useRef(false);

  // Persist recent searches in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(recentSearches)
      );
    } catch {
      // Local storage may be unavailable
    }
  }, [recentSearches]);

  // Save a successful lookup to recent history
  function saveRecentSearch(
    query: string,
    data: IpLookupResult
  ) {
    const newSearch: RecentSearch = {
      query,
      location: formatLocation(
        data.location.city,
        data.location.region,
        data.location.country || 'Unknown location'
      ),
      searchedAt: new Date().toISOString()
    };

    setRecentSearches((previous) =>
      [
        newSearch,
        ...previous.filter(
          (item) =>
            item.query.toLowerCase() !== query.toLowerCase()
        )
      ].slice(0, MAX_RECENT_SEARCHES)
    );
  }

  // Shared request handler for manual and automatic lookup
  async function performLookup(
    request: () => Promise<IpLookupResult>,
    getHistoryQuery: (data: IpLookupResult) => string
  ) {
    if (requestInProgress.current) return;

    requestInProgress.current = true;
    setIsLoading(true);
    setError('');

    try {
      const data = await request();

      if (!data?.ip || !data.location) {
        throw new Error('The lookup service returned incomplete data.');
      }

      setResult(data);
      saveRecentSearch(getHistoryQuery(data), data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  }

  // Search a manually entered IP address or domain
  function handleSearch(query: string) {
    const value = query.trim();

    if (!value) return;

    return performLookup(
      () => lookupIp(value),
      () => value
    );
  }

  // Search the current visitor's public IP
  function handleUseMyIp() {
    return performLookup(
      lookupMyIp,
      (data) => data.ip
    );
  }

  function handleClearHistory() {
    setRecentSearches([]);
  }

  // Derive display values from the current result
  const location = result?.location;

  const city = location?.city ?? DEFAULT_LOCATION.city;
  const region = location?.region ?? DEFAULT_LOCATION.region;

  const latitude = location?.lat ?? DEFAULT_LOCATION.latitude;
  const longitude = location?.lng ?? DEFAULT_LOCATION.longitude;

  const timezone =
    location?.timezone ?? DEFAULT_LOCATION.timezone;

  const locationLabel = result
    ? formatLocation(
        location?.city,
        location?.region,
        location?.country || 'Unknown location'
      )
    : formatLocation(
        DEFAULT_LOCATION.city,
        DEFAULT_LOCATION.region
      );

  const utcOffset =
    location?.timezone &&
    /^[+-]\d{2}:\d{2}$/.test(location.timezone)
      ? `UTC${location.timezone}`
      : result
        ? 'Not available'
        : DEFAULT_LOCATION.utcOffset;

  const asn =
    result
      ? result.as?.asn != null
        ? `AS${result.as.asn}`
        : 'Not available'
      : DEFAULT_LOCATION.asn;

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {/* Hero and search */}
        <section className="intro-grid">
          <div className="hero-copy">
            <span className="hero-label">
              EXPLORE · LOCATE · UNDERSTAND
            </span>

            <h1>Trace any IP address in seconds.</h1>

            <p>
              Get location, ISP, timezone and more with a fast,
              beautifully simple IP lookup.
            </p>
          </div>

          <SearchBar
            onSearch={handleSearch}
            onUseMyIp={handleUseMyIp}
            isLoading={isLoading}
          />
        </section>

        {/* API feedback */}
        {error && (
          <p className="search-error" role="alert">
            {error}
          </p>
        )}

        {/* IP information cards */}
        <IpSummary
          ip={result?.ip ?? DEFAULT_LOCATION.ip}
          location={locationLabel}
          country={location?.country ?? DEFAULT_LOCATION.country}
          timezone={timezone}
          utcOffset={utcOffset}
          isp={result?.isp ?? DEFAULT_LOCATION.isp}
          asn={asn}
        />

        {/* Map and details */}
        <div className="results-grid">
          <LocationMap
            latitude={latitude}
            longitude={longitude}
            city={city}
            region={region}
          />

          <div className="results-sidebar">
            <LocationDetails
              city={city}
              region={region}
              latitude={latitude}
              longitude={longitude}
              timezone={timezone}
              postalCode={location?.postalCode}
            />

            <RecentSearches
              searches={recentSearches}
              onSelect={handleSearch}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <p className="footer-brand">
                IPTracker<span aria-hidden="true">.</span>
              </p>

              <p className="footer-tagline">
                A simpler way to explore IP locations.
              </p>
            </div>

            <nav
              className="footer-links"
              aria-label="Footer links"
            >
              <a
                href="https://github.com/quhtrang-cloud/ip-address-tracker"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>

              <a
                href="https://geo.ipify.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GeoIPify
              </a>

              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenStreetMap
              </a>
            </nav>
          </div>

          <div className="footer-bottom">
            <span>
              © 2026 IPTracker
            </span>

            <span>
              IP geolocation is approximate, not a precise GPS location.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
