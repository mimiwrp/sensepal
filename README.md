# SensePal

SensePal is a mobile-first Progressive Web Application (PWA) designed to help parents and caregivers find sensory-friendly places for children with autism spectrum disorder (ASD). The app provides an interactive map interface to locate and explore suitable venues with detailed sensory information.

## Features

- 🗺️ **Interactive Map**
  - Real-time location tracking
  - Sensory-friendly place markers
  - Detailed place information windows

- 🔍 **Smart Search**
  - Place search with autocomplete
  - Filter by place type
  - Location-based search

- 📱 **Mobile-First Design**
  - Responsive interface
  - Touch-friendly controls
  - Smooth navigation

- ℹ️ **Detailed Place Information**
  - Sensory environment details
  - Opening hours
  - Ratings and reviews
  - Direct links to directions

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. Start the development server:
```bash
npm run dev
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
- Quick filters functionality
- Place saving/favorites feature
- Enhanced sensory information for places
- User reviews and ratings
- Offline support

## Note

This is a private development project. The repository is not open for contributions at this time.

## Contact

For any inquiries about the project, please contact the development team.
