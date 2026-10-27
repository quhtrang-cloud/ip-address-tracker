interface LocationDetailsProps {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  postalCode?: string;
}

function LocationDetails({
  city,
  region,
  latitude,
  longitude,
  timezone,
  postalCode
}: LocationDetailsProps) {
  // Format coordinates with compass directions
  const formattedLatitude = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}`;
  const formattedLongitude = `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;

  // Calculate local time from the location's timezone
  const localTime = (() => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date());
    } catch {
      return 'Not available';
    }
  })();

  const details = [
    { label: 'Latitude', value: formattedLatitude },
    { label: 'Longitude', value: formattedLongitude },
    { label: 'Local time', value: localTime },
    ...(postalCode ? [{ label: 'Postal code', value: postalCode }] : [])
  ];

  return (
    <section className="location-details" aria-labelledby="location-details-title">
      <h2 id="location-details-title">Location Details</h2>
      <p className="location-details-place">{city}, {region}</p>
      <dl className="location-details-list">
        {details.map((item) => (
          <div className="location-details-row" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <p className="location-details-note">
        Location data is approximate and based on public IP geolocation.
      </p>
    </section>
  );
}

export default LocationDetails;
