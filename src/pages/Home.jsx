// src/pages/Home.jsx
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import SearchBar from '../components/search/SearchBar';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

// Default coordinates (we'll update these with user's location)
const DEFAULT_CENTER = [-122.4376, 37.7577]; // San Francisco coordinates

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(12);
  const [loading, setLoading] = useState(true);
  const [searchMarker, setSearchMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    // Get user's location first
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          setMapCenter(userLocation);
          setLoading(false);
        },
        (error) => {
          console.log("Geolocation error:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Initialize map after we have the center coordinates
  useEffect(() => {
    if (loading) return; // Wait until we have location info
    if (map.current) return; // Don't initialize map more than once

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: mapCenter,
      zoom: zoom
    });

    // Add navigation controls
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker if we're using their location
    if (mapCenter !== DEFAULT_CENTER) {
        new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat(mapCenter)
          .addTo(newMap);
      }
    map.current = newMap;
    setMapInstance(newMap);  // Store map instance in state
    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapInstance(null);
      }
    };
  }, [loading, mapCenter, zoom]);

  const handleSearch = (result) => {
    // Remove previous search marker if it exists
    if (searchMarker) {
      searchMarker.remove();
    }

    // Add new marker for search result
    if (result.coordinates && mapInstance) {
      const newMarker = new mapboxgl.Marker({ color: "#4B5563" })
        .setLngLat(result.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(
          `<h3 class="font-medium">${result.name}</h3>
           <p class="text-sm text-gray-600">${result.address || ''}</p>`
        ))
        .addTo(mapInstance);
      
      setSearchMarker(newMarker);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <header className="bg-white shadow-sm px-4 py-3 fixed top-0 w-full z-10">
        <h1 className="text-xl font-semibold text-blue-600">SensePal</h1>
        <SearchBar onSearch={handleSearch} mapInstance={mapInstance} />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 pb-16">
        {/* Quick Filters */}
        <div className="px-4 py-3 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <div className="flex gap-2 w-max pb-2">
              <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                🔈 Quiet Places
              </button>
              <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                🚪 Break Room
              </button>
              <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                ☀️ Natural Light
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-[50vh]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-600">Loading map...</span>
            </div>
          )}
          <div ref={mapContainer} className="h-full w-full" />
        </div>

        {/* Places List */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold mb-3">Nearby Places</h2>
          <div className="space-y-3">
            {[
              {
                id: 1,
                name: "Quiet Library",
                type: "Library",
                distance: "0.5 mi",
                noiseLevel: "Quiet",
                hasBreakRoom: true
              },
              {
                id: 2,
                name: "Sensory Museum",
                type: "Museum",
                distance: "1.2 mi",
                noiseLevel: "Moderate",
                hasBreakRoom: true
              }
            ].map(place => (
              <div 
                key={place.id}
                className="bg-white rounded-lg p-4 shadow-sm active:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{place.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {place.type} • {place.distance}
                    </p>
                  </div>
                  <span className="text-sm text-blue-600">Details →</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    🔈 {place.noiseLevel}
                  </span>
                  {place.hasBreakRoom && (
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      🚪 Break Room
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white shadow-lg fixed bottom-0 w-full flex justify-around items-center py-3 px-4">
        <button className="text-blue-600 flex flex-col items-center">
          <span className="text-xl">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button className="text-gray-500 flex flex-col items-center">
          <span className="text-xl">🗺️</span>
          <span className="text-xs">Map</span>
        </button>
        <button className="text-gray-500 flex flex-col items-center">
          <span className="text-xl">❤️</span>
          <span className="text-xs">Saved</span>
        </button>
      </nav>
    </div>
  );
};

export default Home;