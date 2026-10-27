
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function Header() {
  // Restore the saved theme
  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  });

  // Apply and save the selected theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  }

  return (
    <header className="header">
      <a href="/" className="header-logo">
        <span className="header-icon" aria-hidden="true">
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c-3 2.5-4.5 5.5-4.5 9s1.5 6.5 4.5 9" />
            <path d="M12 3c3 2.5 4.5 5.5 4.5 9s-1.5 6.5-4.5 9" />
        </svg>
        </span>
        <span>IPTracker</span>
      </a>
      <nav className="header-nav" aria-label="Main navigation">
        <a href="#about" className="header-link">About</a>
        <button
          type="button"
          className="header-theme"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;
