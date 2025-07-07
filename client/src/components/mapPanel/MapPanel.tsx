import React, { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import NavigationSvg from "@/assets/navigation-final.svg";
import { mapbox_access_token } from "@/utilities/Constance";
import useMap from "@/hooks/useMap";
import VehicleDetails from "../vehicleDetails/VehicleDetails";
import styles from "@/css/MapPanel.module.scss";

mapboxgl.accessToken = mapbox_access_token;

// Helper function for smooth interpolation
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const MapPanel = () => {
  const { vehicleDetails, lastLocation } = useMap();

  const [zoom] = useState(12);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 25.2048,
    lng: 55.2708,
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const animationRef = useRef<number | null>(null);
  const prevPositionRef = useRef<{
    lat: number;
    lng: number;
    angle?: number;
  } | null>(null);

  // Set current location from browser
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {}
    );
  }, []);

  // Initialize the map
  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [currentLocation.lng, currentLocation.lat],
      zoom,
    });

    const markerContainer = document.createElement("div");
    markerContainer.style.display = "flex";
    markerContainer.style.alignItems = "center";
    markerContainer.style.justifyContent = "center";
    markerContainer.style.transform = "translate(-50%, -50%)";

    const markerSvg = document.createElement("img");
    markerSvg.src = NavigationSvg;
    markerSvg.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    markerContainer.appendChild(markerSvg);

    markerRef.current = new mapboxgl.Marker({ element: markerContainer })
      .setLngLat([currentLocation.lng, currentLocation.lat])
      .addTo(mapRef.current);

    mapRef.current.addControl(new mapboxgl.NavigationControl());
  }, [currentLocation, zoom]);

  // Initialize the map when the component mounts
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  /**
   * animateMarker smoothly animates the marker from one position to another.
   * It uses requestAnimationFrame for smooth transitions and linear interpolation.
   */
  const animateMarker = useCallback(
    (
      from: { lat: number; lng: number; angle?: number },
      to: { lat: number; lng: number; angle?: number },
      duration = 500
    ) => {
      if (!markerRef.current) return;
      const start = performance.now();
      function animate(now: number) {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const lat = lerp(from.lat, to.lat, t);
        const lng = lerp(from.lng, to.lng, t);
        markerRef.current!.setLngLat([lng, lat]);
        // Rotate smoothly as well
        const markerEl = markerRef.current!.getElement();
        const img = markerEl.querySelector("img");
        if (img) {
          const angle = lerp(from.angle || 0, to.angle || 0, t);
          img.style.transform = `rotate(${angle}deg)`;
        }
        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          prevPositionRef.current = { ...to };
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    },
    []
  );

  // Update marker position based on lastLocation
  const updateMarkerPosition = useCallback(() => {
    if (!markerRef.current || !mapRef.current || !lastLocation) return;
    const prev = prevPositionRef.current || lastLocation;
    animateMarker(prev, lastLocation, 500);
  }, [lastLocation, animateMarker]);

  useEffect(() => {
    if (lastLocation) {
      prevPositionRef.current = { ...lastLocation };
    }
  }, []);

  // Update marker angle when lastLocation changes
  useEffect(() => {
    if (!markerRef.current || !mapRef.current || !lastLocation) return;

    markerRef.current.setLngLat([lastLocation.lng, lastLocation.lat]);

    const markerEl = markerRef.current.getElement();
    const img = markerEl.querySelector("img");
    if (img) {
      img.style.transform = `rotate(${lastLocation.angle || 0}deg)`;
    }
  }, [lastLocation]);

  // Center map on the first two vehicle locations
  useEffect(() => {
    if (!mapRef.current || !vehicleDetails.length) return;
    if (vehicleDetails.length < 2) {
      const lastLocation = vehicleDetails[0];
      mapRef.current.setCenter([lastLocation.lng, lastLocation.lat]);
    }
  }, [vehicleDetails]);

  // Update marker position when lastLocation changes
  useEffect(() => {
    updateMarkerPosition();
  }, [updateMarkerPosition]);

  // Draw vehicle path on the map
  useEffect(() => {
    if (!mapRef.current || vehicleDetails.length < 2) return;
    const map = mapRef.current;
    const sourceId = "vehiclePath";
    const layerId = "vehiclePath";

    const lineGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: vehicleDetails.map((v) => [v.lng, v.lat]),
      },
    };

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(lineGeoJSON);
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: lineGeoJSON,
      });

      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#1976d2",
          "line-width": 6,
        },
      });
    }
  }, [vehicleDetails]);

  return (
    <div className={styles.mapPanel}>
      <div ref={mapContainerRef} className={styles.mapContainer} />
      <VehicleDetails />
    </div>
  );
};

export default React.memo(MapPanel);
