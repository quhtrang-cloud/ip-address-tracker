import { useEffect, useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import IpSummary from './components/IpSummary';
import LocationMap from './components/LocationMap';
import LocationDetails from './components/LocationDetails';
import RecentSearches from './components/RecentSearches';
import { lookupIp } from './services/ipApi';
import type { IpLookupResult } from './types/ip';
import './App.css';

interface RecentSearch {
  query: string;
  location: string;
  searchedAt: string;
}

const STORAGE_KEY = 'iptracker-recent-searches';
const MAX_RECENT_SEARCHES = 5;

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

function App() {
  const [result, setResult] = useState<IpLookupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);

  // Persist recent searches in this browser
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
      // Storage may be unavailable or full
    }
  }, [recentSearches]);

  // Look up an IP or domain and update successful search history
  async function handleSearch(query: string) {
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await lookupIp(query);
      setResult(data);

      const newSearch: RecentSearch = {
        query,
        location:
          [data.location.city, data.location.region].filter(Boolean).join(', ') ||
          data.location.country ||
          'Unknown location',
        searchedAt: new Date().toISOString()
      };

      setRecentSearches((previous) => [
        newSearch,
        ...previous.filter((item) => item.query.toLowerCase() !== query.toLowerCase())
      ].slice(0, MAX_RECENT_SEARCHES));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearHistory() {
    setRecentSearches([]);
  }

  const location = result?.location;
  const utcOffset = location?.timezone ? `UTC${location.timezone}` : 'UTC−7';

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {/* Hero and search layout */}
        <section className="intro-grid">
          <div className="hero-copy">
            <span className="hero-label">EXPLORE · LOCATE · UNDERSTAND</span>
            <h1>Trace any IP address in seconds.</h1>
            <p>
              Get location, ISP, timezone and more with a fast,
              beautifully simple IP lookup.
            </p>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {error && <p role="alert">{error}</p>}

        {/* IP lookup results */}
        <IpSummary
          ip={result?.ip ?? '8.8.8.8'}
          location={location
            ? [location.city, location.region].filter(Boolean).join(', ') || 'Unknown location'
            : 'Mountain View, California'}
          country={location?.country ?? 'United States'}
          timezone={location?.timezone ?? 'America/Los_Angeles'}
          utcOffset={utcOffset}
          isp={result?.isp ?? 'Google LLC'}
          asn={result ? (result.as?.asn != null ? `AS${result.as.asn}` : 'Not available') : 'AS15169'}
        />

        {/* Map and location information */}
        <div className="results-grid">
          <LocationMap
            latitude={location?.lat ?? 37.3861}
            longitude={location?.lng ?? -122.0839}
            city={location?.city ?? 'Mountain View'}
            region={location?.region ?? 'California'}
          />
          <div className="results-sidebar">
            <LocationDetails
              city={location?.city ?? 'Mountain View'}
              region={location?.region ?? 'California'}
              latitude={location?.lat ?? 37.3861}
              longitude={location?.lng ?? -122.0839}
              timezone={location?.timezone ?? 'America/Los_Angeles'}
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
    </div>
  );
}

export default App;
