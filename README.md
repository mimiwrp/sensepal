# SensePal 🌟

SensePal is a mobile-first Progressive Web Application (PWA) designed to help parents, caregivers, and individuals find sensory-friendly places. Whether you're looking for quiet spaces, places with natural lighting, or sensory-accommodating venues, SensePal helps you discover comfortable spaces that meet your sensory needs.

## Features

- 🗺️ **Interactive Map**
  - Real-time location tracking
  - Sensory-friendly place markers
  - Detailed place information windows

- 🔍 **Smart Search**
  - Place search with autocomplete
  - Filter by place type
  - Location-based recommendations

- 📱 **Mobile-First Design**
  - Responsive interface
  - Touch-friendly controls
  - Quick filters for different sensory preferences

- ℹ️ **Detailed Place Information**
  - Sensory environment details
  - Opening hours
  - Ratings and reviews
  - Direct links to directions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd sensepal
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Google Maps API key:
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
4. Create API credentials
5. Enable billing for your project

## Tech Stack

- React (Vite)
- Tailwind CSS
- Google Maps JavaScript API
- Google Places API

## Current Development Status

This project is currently in active development. Future enhancements planned include:
- Enhanced sensory information for places
- User reviews and ratings system
- Place saving/favorites feature
- Offline support
- Community-contributed tips

## Contributing

This project is currently under development. Contributions, ideas, and feedback are welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ for accessibility and inclusion.
