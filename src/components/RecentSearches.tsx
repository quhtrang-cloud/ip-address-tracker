interface RecentSearch {
  query: string;
  location: string;
  searchedAt: string;
}

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  return (
    <section className="recent-searches" aria-labelledby="recent-searches-heading">
      <div className="recent-searches-header">
        <h2 id="recent-searches-heading">Recent Searches</h2>
        {searches.length > 0 && (
          <button type="button" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      {searches.length === 0 ? (
        <div className="recent-searches-empty">
          <span className="recent-searches-empty-icon" aria-hidden="true">
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <p className="recent-searches-empty-title">No recent searches</p>
          <p className="recent-searches-empty-description">
            Your searches will appear here.
          </p>
        </div>
      ) : (
        <ul className="recent-searches-list">
          {searches.map((search) => (
            <li key={search.query}>
              <button
                type="button"
                className="recent-search-item"
                onClick={() => onSelect(search.query)}
                aria-label={`Search again for ${search.query}`}
              >
                <span className="recent-search-query">{search.query}</span>
                <span className="recent-search-location">{search.location}</span>
                <time
                  className="recent-search-time"
                  dateTime={search.searchedAt}
                >
                  {new Date(search.searchedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </time>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentSearches;
