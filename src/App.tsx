
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import IpSummary from './components/IpSummary';
import LocationMap from './components/LocationMap';
import LocationDetails from './components/LocationDetails';
import RecentSearches from './components/RecentSearches';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {/* Hero and search layout */}
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
          <SearchBar />
        </section>

        {/* Demo IP lookup results */}
        <IpSummary
          ip="8.8.8.8"
          location="Mountain View, California"
          country="United States"
          timezone="America/Los_Angeles"
          utcOffset="UTC−7"
          isp="Google LLC"
          asn="AS15169"
        />

        {/* Map and location information */}
        <div className="results-grid">
          <LocationMap />
          <div className="results-sidebar">
            <LocationDetails
              city="Mountain View"
              region="California"
              latitude={37.3861}
              longitude={-122.0839}
              timezone="America/Los_Angeles"
            />
            <RecentSearches
              searches={[]}
              onSelect={() => {}}
              onClear={() => {}}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
