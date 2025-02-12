// src/components/search/SearchBar.jsx
import { useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const SearchBar = ({ onSearch, mapInstance }) => {  // Change prop name to be clearer
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);

  const searchLocation = async (query) => {
    if (!query) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&types=place,address,poi`
      );
      const data = await response.json();
      
      const locations = data.features.map(feature => ({
        id: feature.id,
        name: feature.text,
        type: 'location',
        coordinates: feature.center,
        address: feature.place_name
      }));
      
      setSearchResults(locations);
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      searchLocation(value);
    }, 300);
  };

  const handleResultClick = (result) => {
    if (result.coordinates && mapInstance) {  // Check if map exists
      mapInstance.flyTo({
        center: result.coordinates,
        zoom: 15
      });
    }
    
    onSearch(result);
    setSearchResults([]);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search places, areas, or types..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
          {searchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="font-medium">{result.name}</div>
              {result.address && (
                <div className="text-sm text-gray-600">{result.address}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;