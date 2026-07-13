const axios = require('axios');

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ── GEOCODE a city/address string → { lat, lng } ─────────
// TODO: set GOOGLE_MAPS_API_KEY in .env
const geocode = async (address) => {
  if (!MAPS_API_KEY) {
    console.warn('[Maps] GOOGLE_MAPS_API_KEY not set — skipping geocode');
    return { lat: null, lng: null };
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json`;
  const { data } = await axios.get(url, { params: { address, key: MAPS_API_KEY } });
  if (data.status !== 'OK' || !data.results.length) return { lat: null, lng: null };
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
};

// ── REVERSE GEOCODE { lat, lng } → address string ─────────
const reverseGeocode = async (lat, lng) => {
  if (!MAPS_API_KEY) return '';
  const url = `https://maps.googleapis.com/maps/api/geocode/json`;
  const { data } = await axios.get(url, { params: { latlng: `${lat},${lng}`, key: MAPS_API_KEY } });
  if (data.status !== 'OK' || !data.results.length) return '';
  return data.results[0].formatted_address;
};

// ── GET ROUTE between two lat/lng points ──────────────────
// Returns: { distanceKm, durationHrs, polyline }
const getRoute = async (originCoords, destCoords) => {
  if (!MAPS_API_KEY) return { distanceKm: null, durationHrs: null, polyline: '' };
  const url = `https://maps.googleapis.com/maps/api/directions/json`;
  const { data } = await axios.get(url, {
    params: {
      origin:      `${originCoords.lat},${originCoords.lng}`,
      destination: `${destCoords.lat},${destCoords.lng}`,
      mode: 'driving',
      key: MAPS_API_KEY,
    },
  });
  if (data.status !== 'OK' || !data.routes.length) return { distanceKm: null, durationHrs: null, polyline: '' };

  const leg = data.routes[0].legs[0];
  return {
    distanceKm: Math.round(leg.distance.value / 1000),
    durationHrs: Math.round((leg.duration.value / 3600) * 10) / 10,
    polyline: data.routes[0].overview_polyline.points,  // encoded polyline
  };
};

module.exports = { geocode, reverseGeocode, getRoute };
