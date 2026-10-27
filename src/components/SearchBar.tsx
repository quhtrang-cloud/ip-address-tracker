
import { useState } from 'react';
import type { SubmitEvent } from 'react';

function SearchBar() {
  // Store search input and validation errors
  const [query, setQuery] = useState('8.8.8.8');
  const [error, setError] = useState('');

  // Handle search submission
  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();

    if (!value) {
      setError('Please enter an IP address or domain.');
      return;
    }

    setError('');
    console.log('Searching for:', value);
  }

  return (
    <div className="search-panel">
      <form className="search-form" onSubmit={handleSearch}>
        <label htmlFor="ip-search" className="sr-only">
          IP address or domain
        </label>
        <span className="search-icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </span>
        <input
          id="ip-search"
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setError('');
          }}
          placeholder="Enter an IP address or domain"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'search-error' : undefined}
        />
        <button type="submit">Search →</button>
      </form>

      {error && (
        <p id="search-error" className="search-error" role="alert">
          {error}
        </p>
      )}

      <div className="search-examples">
        <span>Try an example:</span>
        <button type="button" onClick={() => setQuery('8.8.8.8')}>
          8.8.8.8
        </button>
        <button type="button" onClick={() => setQuery('1.1.1.1')}>
          1.1.1.1
        </button>
        <button type="button" onClick={() => setQuery('google.com')}>
          google.com
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
