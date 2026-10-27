import { useEffect } from 'react';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
}

interface MapViewProps {
  position: [number, number];
}

function MapView({ position }: MapViewProps) {
  const map = useMap();

  // Update the map when the searched location changes
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position[0], position[1]]);

  return null;
}

function LocationMap({ latitude, longitude, city, region }: LocationMapProps) {
  const position: [number, number] = [latitude, longitude];
  const locationLabel = [city, region].filter(Boolean).join(', ') || 'Unknown location';

  return (
    <section className="location-map" aria-label="IP location map">
      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={false}
        className="map-container"
      >
        <MapView position={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Highlight the approximate location without implying accuracy */}
        <CircleMarker
          center={position}
          radius={42}
          pathOptions={{
            color: '#2855c5',
            weight: 1,
            opacity: 0.35,
            fillColor: '#2855c5',
            fillOpacity: 0.12,
            interactive: false,
          }}
        />
        <Marker position={position}>
          <Popup>Approximate location: {locationLabel}</Popup>
        </Marker>
      </MapContainer>
    </section>
  );
}

export default LocationMap;
