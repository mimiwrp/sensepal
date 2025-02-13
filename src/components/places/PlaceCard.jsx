const PlaceCard = ({ place, onClick }) => {
    // Helper function to get type label
    const getTypeLabel = (types) => {
      const typeMap = {
        library: '📚 Library',
        museum: '🏛️ Museum',
        park: '🌳 Park',
        art_gallery: '🎨 Art Gallery',
        aquarium: '🐠 Aquarium',
        school: '🏫 School',
        health: '🏥 Health Center',
        point_of_interest: '📍 Point of Interest'
      };
  
      return types
        .map(type => typeMap[type] || type.replace(/_/g, ' '))
        .find(label => typeMap[label]) || types[0].replace(/_/g, ' ');
    };
  
    return (
      <div
        onClick={() => onClick(place)}
        className="bg-white rounded-lg p-4 shadow-sm active:bg-gray-50 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{place.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {getTypeLabel(place.types)}
            </p>
          </div>
          {place.rating && (
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-700">{place.rating}</span>
              <span className="text-yellow-400">⭐</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">{place.vicinity}</p>
        {place.opening_hours && (
          <p className="text-sm text-green-600 mt-1">
            {place.opening_hours.open_now ? '✅ Open Now' : '❌ Closed'}
          </p>
        )}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name)}&destination_place_id=${place.place_id}`, '_blank');
            }}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
          >
            🗺️ Directions
          </button>
          {place.website && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(place.website, '_blank');
              }}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
            >
              🌐 Website
            </button>
          )}
        </div>
      </div>
    );
  };
  
  export default PlaceCard;