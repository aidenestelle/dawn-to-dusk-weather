# Dawn to Dusk Weather App

A modern, responsive weather application providing detailed current, hourly, and daily forecasts with a beautiful and informative UI.

## Features

- **Current Weather**: Prominent display of current conditions, temperature, feels-like, wind, humidity, and precipitation.
- **Hourly Forecast**:
  - Vertical, scrollable list starting from the current hour
  - Each card shows time (12h format), weather icon, temperature, precipitation probability, wind, humidity, and feels-like
  - Optimized layout for mobile and desktop
  - Current hour is visually highlighted
- **Daily Forecast**:
  - 7-day outlook with detailed cards
- **Search Functionality**:
  - Search for any city/location
  - Search bar and dropdown fully themed for light and dark mode
  - Recent searches and suggestions
- **Unit Preferences**:
  - Toggle between Celsius/Fahrenheit and km/h/mph
  - Precipitation automatically shown in mm (metric) or inches (imperial)
- **Dark Mode**: Fully responsive and visually tuned for both light and dark themes
- **Accessibility**: Keyboard and screen reader friendly, with clear focus and hover states

## Tech Stack
- **React** (TypeScript)
- **Vite** (build tooling)
- **Tailwind CSS** (utility-first styling)
- **shadcn-ui** (UI components)
- **Lucide-react** (icons)
- **Axios** (API requests)
- **Sonner** (toast notifications)

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- npm or yarn

### Installation
```sh
# Clone the repository
 git clone <your-repo-url>
 cd dawn-to-dusk-weather

# Install dependencies
 npm install
# or
yarn install

# Start the development server
 npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Customization
- **API Keys**: If using a weather API that requires a key, add your key to the appropriate `.env` file and update the API logic in `src/lib/api.ts`.
- **Styling**: Tailwind and component classes can be easily customized in each component file.
- **Units**: The app auto-detects and toggles units based on user preference.

## Deployment
- The app is ready for deployment with Vite. You can deploy to Vercel, Netlify, or any static hosting provider.

## Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you would like to change.

## License
MIT

---

*Built with ❤️ for weather enthusiasts.*
