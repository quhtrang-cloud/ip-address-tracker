# IP Address Tracker

A responsive IP address tracker built with React, TypeScript, and Leaflet. It allows users to look up IP addresses and domains, explore approximate geolocation data on an interactive map, and view network information through a clean, accessible interface.

**Live Demo:** [View IPTracker](https://ip-address-trac-lovat.vercel.app/)

## Tech Stack

- React
- TypeScript
- Vite
- React Leaflet & OpenStreetMap
- CSS
- GeoIPify API
- Vercel Serverless Functions

## Features

- Search for IPv4, IPv6 addresses, and domains
- Display geolocation, timezone, ISP, and ASN information
- Interactive map with location markers and approximate location highlights
- Responsive layout with light and dark modes
- Recent search history stored in localStorage
- Input validation and error handling
- Copy IP address functionality

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/quhtrang-cloud/ip-address-tracker.git
   cd ip-address-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root:

   ```env
   GEOIPIFY_API_KEY=your_api_key_here
   ```

4. Run the application with Vercel CLI:

   ```bash
   npm install -g vercel
   vercel login
   vercel link
   vercel dev
   ```

The application is available at the local URL displayed in the terminal.

## API Configuration

IP geolocation data is provided by [GeoIPify](https://geo.ipify.org/).

API requests are handled through a Vercel Serverless Function to keep the API key out of client-side code.

For deployment, configure `GEOIPIFY_API_KEY` in the Vercel project's environment variables.

## Project Status

The core IP lookup functionality is implemented. Further improvements to error handling, accessibility, and automated testing are planned.

## Credits

Based on the [IP Address Tracker challenge](https://www.frontendmentor.io/challenges/ip-address-tracker-I8-0yYAH0) from Frontend Mentor.

Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).