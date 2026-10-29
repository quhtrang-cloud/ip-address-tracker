
# IPTracker

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

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production frontend |
| `npm run lint` | Run Oxlint |
| `npm audit` | Check dependencies for known vulnerabilities |

## Project Structure

```text
ip-address-tracker/
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
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
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

## Data Attribution

- [GeoIPify](https://geo.ipify.org/) - IP geolocation and network information
- [OpenStreetMap](https://www.openstreetmap.org/copyright) - Map data
- [Leaflet](https://leafletjs.com/) - Interactive mapping library

## Author

Developed by [Quynh Trang Nguyen](https://github.com/quhtrang-cloud).
