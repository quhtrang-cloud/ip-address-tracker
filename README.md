
# IPTracker

![CI](https://github.com/quhtrang-cloud/ip-address-tracker/actions/workflows/ci.yml/badge.svg)

A responsive IP address and domain lookup application built with React and TypeScript. Explore approximate geolocation, network information, and interactive maps through a clean, accessible interface.

**[Live Demo](https://ip-address-trac-lovat.vercel.app/)**

## Features

- **IP & Domain Lookup** - Search IPv4, IPv6 addresses, and domains.
- **Use My IP** - Detect and look up the visitor's public IP address.
- **Interactive Map** - Visualise approximate locations with Leaflet and OpenStreetMap.
- **Location & Network Details** - View IP address, city, region, country, timezone, ISP, and available ASN information.
- **Recent Searches** - Store up to five searches locally, revisit previous results, and clear search history.
- **Light & Dark Mode** - Switch themes with preferences saved in localStorage.
- **About Dialog** - Learn about the application and its geolocation limitations.
- **Responsive Design** - Optimised for desktop, tablet, and mobile screens.
- **Accessibility** - Form validation, semantic HTML, accessible labels, keyboard navigation, and native dialog interactions.

## Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | CSS |
| Maps | React Leaflet, Leaflet, OpenStreetMap |
| IP Geolocation | GeoIPify API |
| Backend | Vercel Functions |
| Testing | Playwright, Chromium |
| CI | GitHub Actions |
| Deployment | Vercel |
| Version Control | Git, GitHub |

## How It Works

1. The user enters an IP address or domain, or selects **Use My IP**.
2. React sends a request to the `/api/lookup` endpoint.
3. A Vercel Function validates the input and communicates with GeoIPify using a server-side API key.
4. The response updates the information cards, interactive map, and location details.
5. Successful lookups are saved to localStorage for quick access.

### Architecture

```text
User
  |
  v
React + TypeScript
  |
  v
Vercel Function (/api/lookup)
  |
  v
GeoIPify API
  |
  v
IP Details + Interactive Leaflet Map
```

The GeoIPify API key is stored in server-side environment variables and is not exposed in client-side code.

## Getting Started

### Prerequisites

- Node.js compatible with Vite 8
- npm
- GeoIPify API key
- Vercel CLI for local API development

### Installation

Clone the repository:

```bash
git clone https://github.com/quhtrang-cloud/ip-address-tracker.git
cd ip-address-tracker
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
GEOIPIFY_API_KEY=your_geoipify_api_key
```

Keep API keys private. Environment files containing credentials are excluded from version control.

For production, configure `GEOIPIFY_API_KEY` in the Vercel project settings.

### Run Locally

To run the frontend and Vercel Functions together:

```bash
npx vercel dev
```

Open the local URL shown in the terminal.

Alternatively, start the Vite frontend:

```bash
npm run dev
```

**Note:** Vite alone does not execute the Vercel Function at `/api/lookup`. API-powered searches require a functioning backend. The **Use My IP** feature should be verified on the deployed website because local request headers may not provide the visitor's public IP.

## Testing

Automated end-to-end tests are implemented using **Playwright** with Chromium.

The test suite covers eight scenarios:

| Test | Description |
| --- | --- |
| Homepage UI | Verifies the main interface and search components |
| Input Validation | Checks error feedback for invalid IP input |
| IP Lookup | Uses a mocked API response to verify result rendering |
| Theme Persistence | Verifies that the selected theme persists after reloading |
| About Dialog | Tests opening and closing the dialog with Escape |
| Recent Searches | Verifies that search history can be saved and cleared |
| API Error Handling | Checks error feedback and retry availability when the API fails |
| Use My IP | Tests public IP lookup behaviour using a mocked response |

All eight tests passed locally on Chromium during development.

### Run Tests

Install the required browser:

```bash
npx playwright install chromium
```

Run the complete test suite:

```bash
npx playwright test
```

Run tests in interactive UI mode:

```bash
npx playwright test --ui
```

View the HTML test report:

```bash
npx playwright show-report
```

Playwright automatically starts the configured Vite development server.

API responses are mocked in relevant tests to ensure consistent results without consuming GeoIPify API quota. These tests validate frontend behaviour and do not replace live backend integration testing.

## Continuous Integration

GitHub Actions automatically runs the CI workflow when code is pushed to `main` or a pull request targets `main`.

The workflow performs:

1. **Dependency Installation** - Installs packages using `npm ci`.
2. **Code Quality Checks** - Runs Oxlint.
3. **Production Build** - Verifies that the application builds successfully.
4. **Browser Setup** - Installs Chromium and its dependencies.
5. **E2E Testing** - Executes the Playwright test suite.
6. **Test Reporting** - Uploads the Playwright HTML report as a workflow artifact.

The workflow configuration is available in `.github/workflows/ci.yml`.

**[View CI Workflow](https://github.com/quhtrang-cloud/ip-address-tracker/actions)**

Vercel handles deployment separately. A successful CI run does not currently guarantee that deployment is blocked when tests fail.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production frontend |
| `npm run lint` | Run Oxlint |
| `npx playwright test` | Run automated E2E tests |
| `npx playwright test --ui` | Open Playwright interactive test runner |
| `npx playwright show-report` | Open the latest HTML test report |
| `npm audit` | Check dependencies for known vulnerabilities |

## Project Structure

```text
ip-address-tracker/
├── .github/
│   └── workflows/
│       └── ci.yml
├── api/
│   └── lookup.ts
├── public/
│   ├── favicon.svg
│   └── ip-network-map.svg
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx
│   │   ├── Header.tsx
│   │   ├── IpSummary.tsx
│   │   ├── LocationDetails.tsx
│   │   ├── LocationMap.tsx
│   │   ├── RecentSearches.tsx
│   │   └── SearchBar.tsx
│   ├── services/
│   │   └── ipApi.ts
│   ├── types/
│   │   └── ip.ts
│   ├── utils/
│   │   └── validation.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── tests/
│   ├── api-error.spec.ts
│   ├── homepage.spec.ts
│   ├── interactions.spec.ts
│   ├── lookup.spec.ts
│   ├── my-ip.spec.ts
│   ├── recent-searches.spec.ts
│   └── validation.spec.ts
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.api.json
├── vite.config.ts
└── README.md
```

## Privacy & Limitations

- IP geolocation provides approximate locations, not precise GPS coordinates.
- Location accuracy depends on the network and geolocation provider.
- VPNs and proxies may affect the detected IP address and location.
- Search history is stored locally in the browser using localStorage.
- The server-side API key is not included in the frontend bundle.
- Geolocation lookups are subject to API availability and usage limits.
- Mocked API tests do not guarantee production API availability or geolocation accuracy.

## Data Attribution

- [GeoIPify](https://geo.ipify.org/) - IP geolocation and network information
- [OpenStreetMap](https://www.openstreetmap.org/copyright) - Map data
- [Leaflet](https://leafletjs.com/) - Interactive mapping library

## Author

Developed by [Quynh Trang Nguyen](https://github.com/quhtrang-cloud).
