
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

function RecentSearches({
  searches,
  onSelect,
  onClear
}: RecentSearchesProps) {
  return (
    <section className="recent-searches" aria-labelledby="recent-searches-title">
      <div className="recent-searches-header">
        <h2 id="recent-searches-title">Recent Searches</h2>
        {searches.length > 0 && (
          <button type="button" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      {searches.length === 0 ? (
        <p className="recent-searches-empty">
          No recent searches yet.
        </p>
      ) : (
        <ul className="recent-searches-list">
          {searches.map((search) => (
            <li key={`${search.query}-${search.searchedAt}`}>
              <button
                type="button"
                className="recent-search-item"
                onClick={() => onSelect(search.query)}
              >
                <span className="recent-search-query">{search.query}</span>
                <span className="recent-search-location">{search.location}</span>
                <time
                  className="recent-search-time"
                  dateTime={search.searchedAt}
                >
                  {new Date(search.searchedAt).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
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
