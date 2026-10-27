
import { useEffect } from 'react';
import { Icon } from 'leaflet';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
}

const locationIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapView({ position }: { position: [number, number] }) {
  const map = useMap();

  // Recenter the map when a new IP is selected
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position[0], position[1]]);

  return null;
}

function LocationMap({ latitude, longitude, city, region }: LocationMapProps) {
  const position: [number, number] = [latitude, longitude];
  const place = [city, region].filter(Boolean).join(', ') || 'Unknown location';

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
            interactive: false
          }}
        />
        <Marker position={position} icon={locationIcon}>
          <Popup>Approximate location: {place}</Popup>
        </Marker>
      </MapContainer>
    </section>
  );
}

export default LocationMap;
