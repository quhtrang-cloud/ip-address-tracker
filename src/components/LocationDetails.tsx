
interface LocationDetailsProps {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  postalCode?: string;
}

function formatLocalTime(timezone: string): string {
  try {
    const match = /^([+-])(\d{2}):(\d{2})$/.exec(timezone);
    const options: Intl.DateTimeFormatOptions = {
      dateStyle: 'medium',
      timeStyle: 'short'
    };

    if (match) {
      const hours = Number(match[2]);
      const minutes = Number(match[3]);
      if (hours > 23 || minutes > 59) return 'Not available';

      const offsetMinutes = (hours * 60 + minutes) * (match[1] === '-' ? -1 : 1);
      const localDate = new Date(Date.now() + offsetMinutes * 60_000);

      return new Intl.DateTimeFormat('en-GB', {
        ...options,
        timeZone: 'UTC'
      }).format(localDate);
    }

    return new Intl.DateTimeFormat('en-GB', {
      ...options,
      timeZone: timezone
    }).format(new Date());
  } catch {
    return 'Not available';
  }
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

  // Calculate local time using an offset or an IANA timezone
  const localTime = formatLocalTime(timezone);
  const place = [city, region].filter(Boolean).join(', ') || 'Unknown location';

  const details = [
    { label: 'Latitude', value: formattedLatitude },
    { label: 'Longitude', value: formattedLongitude },
    { label: 'Local time', value: localTime },
    ...(postalCode ? [{ label: 'Postal code', value: postalCode }] : [])
  ];

  return (
    <section className="location-details" aria-labelledby="location-details-title">
      <h2 id="location-details-title">Location Details</h2>
      <p className="location-details-place">{place}</p>
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
