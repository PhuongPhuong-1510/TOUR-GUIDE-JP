// components/RealMap.tsx
import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

export type Coord = [number, number];

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapRoute {
  // geometry coordinates from ORS (GeoJSON: [lon, lat] pairs)
  geometry?: {
    coordinates: number[][];
  };
  properties?: any;
}

export interface RealMapProps {
  center: Coord;
  startCoord: Coord | null;
  endCoord: Coord | null;
  route: MapRoute | null;
  onMapClick: (coord: Coord) => void;
  zoom?: number;
  showZoomControl?: boolean;
  hoveredStep?: number | null;
}

const MapEffects: React.FC<{
  center: Coord;
  startCoord: Coord | null;
  endCoord: Coord | null;
  route: MapRoute | null;
  onMapClick: (coord: Coord) => void;
}> = ({ center, startCoord, endCoord, route, onMapClick }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (startCoord && endCoord) {
      // fitBounds expects LatLng tuples; convert tuple -> Leaflet accepts [lat,lng]
      const bounds = L.latLngBounds(
        startCoord as LatLngExpression,
        endCoord as LatLngExpression
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (startCoord || endCoord) {
      map.setView((startCoord || endCoord) as LatLngExpression, 15);
    } else {
      map.setView(center as LatLngExpression, 13);
    }
  }, [startCoord, endCoord, center, map]);

  useEffect(() => {
    if (!route || !route.geometry || !route.geometry.coordinates) return;
    const coords = route.geometry.coordinates.map((c) => [c[1], c[0]] as Coord);
    const bounds = L.latLngBounds(coords as unknown as LatLngExpression[]);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [route, map]);

  return null;
};

const RealMap: React.FC<RealMapProps> = ({
  center,
  startCoord,
  endCoord,
  route,
  onMapClick,
  zoom = 13,
  showZoomControl = true,
}) => {
  const polylinePositions = useMemo(() => {
    if (!route || !route.geometry) return [];
    // ORS geometry coordinates: [lon, lat] -> convert to [lat, lon]
    return route.geometry.coordinates.map((c) => [c[1], c[0]] as Coord);
  }, [route]);

  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
      zoomControl={showZoomControl}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapEffects
        center={center}
        startCoord={startCoord}
        endCoord={endCoord}
        route={route}
        onMapClick={onMapClick}
      />

      {startCoord && <Marker position={startCoord as LatLngExpression} />}
      {endCoord && <Marker position={endCoord as LatLngExpression} />}

      {polylinePositions.length > 0 && (
        <Polyline positions={polylinePositions as LatLngExpression[]} />
      )}
    </MapContainer>
  );
};

export default RealMap;
