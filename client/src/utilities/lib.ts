import { VehicleDataState } from "@/models/Vehicle.interface";
import { mapbox_access_token, mapbox_places_url } from "./Constance";

/**
 * Haversine formula to calculate the distance between two points on the Earth
 */
const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default {
  /**
   * getAverageSpeed calculates the average speed.
   */
  getAverageSpeed: (vehicleDetails: VehicleDataState[]) => {
    if (vehicleDetails.length === 0) return 0;
    const total = vehicleDetails.reduce((sum, v) => sum + (v.speed || 0), 0);
    return (total / vehicleDetails.length).toFixed(1);
  },

  /**
   * getTripMileage calculates the total distance traveled based on an array of vehicle details.
   */
  getTripMileage: (vehicleDetails: VehicleDataState[]) => {
    if (vehicleDetails.length < 2) return 0;
    let distance = 0;
    for (let i = 1; i < vehicleDetails.length; i++) {
      const prev = vehicleDetails[i - 1];
      const curr = vehicleDetails[i];
      distance += haversine(prev.lat, prev.lng, curr.lat, curr.lng);
    }
    return distance.toFixed(2);
  },

  /**
   * getAddressFromLatLng fetches the address from latitude and longitude using Mapbox Places API.
   */
  getAddressFromLatLng: async (lat: number, lng: number): Promise<string> => {
    const accessToken = mapbox_access_token;
    const url = `${mapbox_places_url}/${lng},${lat}.json?access_token=${accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.features?.[0]?.place_name || "Unknown location";
  },
};
