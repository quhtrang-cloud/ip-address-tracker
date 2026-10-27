import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const position: [number, number] = [37.3861, -122.0839];

function LocationMap() {
  return (
    <section className="location-map" aria-label="IP location map">
      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={false}
        className="map-container"
      >
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
        <Marker position={position}>
          <Popup>Approximate location: Mountain View, California</Popup>
        </Marker>
      </MapContainer>
    </section>
  );
}

export default LocationMap;
