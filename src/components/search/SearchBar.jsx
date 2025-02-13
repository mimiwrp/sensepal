// src/components/search/SearchBar.jsx
import { useState } from 'react';

const SearchBar = ({ onSearch, placesService }) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (searchQuery) => {
    if (!searchQuery || !placesService) return;

    setIsLoading(true);
    const request = {
      query: searchQuery,
      fields: ['name', 'geometry', 'formatted_address', 'place_id']
    };

    placesService.findPlaceFromQuery(request, (results, status) => {
      setIsLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        onSearch(results[0]);
        setQuery('');
        setPredictions([]);
      }
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setPredictions([]);
      return;
    }

    // Use Google Places Autocomplete
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({
      input: value,
      types: ['establishment']
    }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setPredictions(predictions);
      }
    });
  };

  const handlePredictionClick = (prediction) => {
    handleSearch(prediction.description);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for sensory-friendly places..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {predictions.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => handlePredictionClick(prediction)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="font-medium">{prediction.structured_formatting.main_text}</div>
              <div className="text-sm text-gray-600">{prediction.structured_formatting.secondary_text}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;