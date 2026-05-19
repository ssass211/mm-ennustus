const venueTimezones: Record<string, string> = {
  'Estadio Azteca, Mexico City': 'America/Mexico_City',
  'Estadio Akron, Guadalajara': 'America/Mexico_City',
  'Estadio BBVA, Monterrey': 'America/Monterrey',
  'BMO Field, Toronto': 'America/Toronto',
  'BC Place, Vancouver': 'America/Vancouver',
  'MetLife Stadium, New York/New Jersey': 'America/New_York',
  'Gillette Stadium, Boston': 'America/New_York',
  'Lincoln Financial Field, Philadelphia': 'America/New_York',
  'Hard Rock Stadium, Miami': 'America/New_York',
  'Mercedes-Benz Stadium, Atlanta': 'America/New_York',
  'NRG Stadium, Houston': 'America/Chicago',
  'AT&T Stadium, Dallas': 'America/Chicago',
  'Arrowhead Stadium, Kansas City': 'America/Chicago',
  'SoFi Stadium, Los Angeles': 'America/Los_Angeles',
  "Levi's Stadium, San Francisco Bay Area": 'America/Los_Angeles',
  'Lumen Field, Seattle': 'America/Los_Angeles',
};

export function getLocalTimeForVenue(date: Date, venue?: string | null): string | null {
  if (!venue) return null;
  
  const tz = venueTimezones[venue];
  if (!tz) return null;

  return new Intl.DateTimeFormat('et-EE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz
  }).format(date);
}
