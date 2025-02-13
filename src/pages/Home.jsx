// src/pages/Home.jsx
import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import PlaceCard from '../components/places/PlaceCard'; 
import SearchBar from '../components/search/SearchBar';

const libraries = ['places'];

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
  };

const Home = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const placesService = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

// Update the searchNearbyPlaces function in Home.jsx
const searchNearbyPlaces = useCallback((location) => {
    if (!map || !placesService.current) return;
  
    // First search for places with sensory-friendly keywords
    const keywordSearch = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: '5000',
      keyword: 'sensory friendly OR quiet space OR autism friendly',
    };
  
    // Then search for specific types of places that are typically sensory-friendly
    const typeSearch = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: '5000',
      type: ['library', 'museum', 'park', 'aquarium', 'art_gallery'],
      keyword: 'quiet OR peaceful OR calm'
    };
  
    // Additional search for community centers and therapy centers
    const additionalSearch = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: '5000',
      keyword: 'occupational therapy OR community center OR sensory gym OR children therapy'
    };
  
    // Perform all searches and combine results
    Promise.all([
      new Promise((resolve) => {
        placesService.current.nearbySearch(keywordSearch, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      }),
      new Promise((resolve) => {
        placesService.current.nearbySearch(typeSearch, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      }),
      new Promise((resolve) => {
        placesService.current.nearbySearch(additionalSearch, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      })
    ]).then((allResults) => {
      // Combine and deduplicate results based on place_id
      const combinedResults = Array.from(
        new Map(
          allResults.flat().map(place => [place.place_id, place])
        ).values()
      );
  
      // Sort by rating (if available)
      const sortedResults = combinedResults.sort((a, b) => {
        if (!a.rating) return 1;
        if (!b.rating) return -1;
        return b.rating - a.rating;
      });
  
      console.log('Found places:', sortedResults);
      setNearbyPlaces(sortedResults);
    });
  }, [map]);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    // Get user's location
    placesService.current = new window.google.maps.places.PlacesService(mapInstance);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          mapInstance.panTo(location);
          searchNearbyPlaces(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          const defaultLocation = { lat: 37.7749, lng: -122.4194 };
          setUserLocation(defaultLocation);
          mapInstance.panTo(defaultLocation);
          searchNearbyPlaces(defaultLocation);
        }
      );
    }
  }, [searchNearbyPlaces]);

  if (loadError) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-600 p-4 text-center">
            <p>Error loading maps. Please make sure you have:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Enabled billing in Google Cloud Console</li>
              <li>Enabled Maps JavaScript API</li>
              <li>Enabled Places API</li>
              <li>Created a valid API key</li>
            </ul>
          </div>
        </div>
      );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm px-4 py-3 fixed top-0 w-full z-10">
        <h1 className="text-xl font-semibold text-blue-600 mb-2">SensePal</h1>
        <SearchBar 
            onSearch={(place) => {
            setSelectedPlace(place);
            if (place.geometry?.location) {
                map.panTo(place.geometry.location);
                map.setZoom(15);
            }
            }} 
            placesService={placesService.current}
        />
      </header>

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

        {/* Map */}
        <div className="h-[50vh] relative">
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={userLocation || { lat: 37.7749, lng: -122.4194 }}
            zoom={13}
            onLoad={onMapLoad}
            options={mapOptions}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: '#1E40AF',
                  fillOpacity: 1,
                  strokeColor: '#1E40AF',
                  strokeWeight: 2,
                  scale: 8
                }}
                title="Your Location"
              />
            )}
            {nearbyPlaces.map((place) => (
              <Marker
                key={place.place_id}
                position={place.geometry.location}
                onClick={() => setSelectedPlace(place)}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: '#3B82F6',
                  fillOpacity: 1,
                  strokeColor: '#2563EB',
                  strokeWeight: 2,
                  scale: 8
                }}
              />
            ))}
            {selectedPlace && (
              <InfoWindow
                position={selectedPlace.geometry.location}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div className="p-2">
                  <h3 className="font-medium">{selectedPlace.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPlace.vicinity}</p>
                  {selectedPlace.rating && (
                    <p className="text-sm mt-1">Rating: {selectedPlace.rating} ⭐</p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>

        {/* Places List */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold mb-3">
            Nearby Sensory-Friendly Places ({nearbyPlaces.length})
          </h2>
          <div className="space-y-3">
            {nearbyPlaces.map((place) => (
              <PlaceCard
              key={place.place_id}
              place={place}
              onClick={setSelectedPlace}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;