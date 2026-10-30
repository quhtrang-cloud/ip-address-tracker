
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { validateIpQuery } from '../utils/validation';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onUseMyIp: () => void;
  isLoading?: boolean;
}

function SearchBar({
  onSearch,
  onUseMyIp,
  isLoading = false
}: SearchBarProps) {
  const [query, setQuery] = useState('8.8.8.8');
  const [error, setError] = useState('');

  // Validate and submit a new lookup
  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();
    const validationError = validateIpQuery(value);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onSearch(value);
  }

  function selectExample(value: string) {
    setQuery(value);
    setError('');
  }

  function handleUseMyIp() {
    setError('');
    onUseMyIp();
  }

  return (
    <div className="search-panel">
      <form
        className="search-form"
        onSubmit={handleSearch}
        aria-busy={isLoading}
      >
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

        <button type="submit">
          {isLoading ? 'Search again →' : 'Search →'}
        </button>
      </form>

      {error && (
        <p
          id="search-error"
          className="search-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="search-examples">
        <span>Try an example:</span>

        <button
          type="button"
          onClick={() => selectExample('8.8.8.8')}
        >
          8.8.8.8
        </button>

        <button
          type="button"
          onClick={() => selectExample('1.1.1.1')}
        >
          1.1.1.1
        </button>

        <button
          type="button"
          onClick={() => selectExample('google.com')}
        >
          google.com
        </button>

        <button
          type="button"
          className="use-my-ip-button"
          onClick={handleUseMyIp}
        >
          Use My IP
        </button>
      </div>

      {isLoading && (
        <p className="sr-only" role="status">
          Looking up IP information. You can start another search.
        </p>
      )}
    </div>
  );
}

export default SearchBar;
