import { useState, useEffect } from 'react';

// Tọa độ mặc định: Tokyo, Japan
const DEFAULT_CENTER: number[] = [35.6762, 139.6503];

// Giao diện (interface) cơ bản
interface Route {
  duration: number; // in seconds
  distance: number; // in meters
  legs: any[]; 
  geometry: any;
}

interface Step {
  maneuver: {
    instruction: string;
    bearing_after: number;
  };
  distance: number;
  duration: number;
}

interface MapNavigation {
  startText: string;
  setStartText: (text: string) => void;
  endText: string;
  setEndText: (text: string) => void;
  startCoord: number[] | null;
  setStartCoord: (coord: number[] | null) => void;
  endCoord: number[] | null;
  setEndCoord: (coord: number[] | null) => void;
  selectingOnMap: 'start' | 'end' | null;
  setSelectingOnMap: (value: 'start' | 'end' | null) => void;
  route: Route | null;
  steps: Step[];
  computeRoute: () => Promise<void>;
  handleGeocodeStart: () => Promise<void>;
  handleGeocodeEnd: () => Promise<void>;
  totalDuration: number;
  totalDistance: number;
  DEFAULT_CENTER: number[];
}

export const useMapNavigation = (): MapNavigation => {
  // State
  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');
  const [startCoord, setStartCoord] = useState<number[] | null>(null);
  const [endCoord, setEndCoord] = useState<number[] | null>(null);
  const [selectingOnMap, setSelectingOnMap] = useState<'start' | 'end' | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  
  // Lấy tổng thời gian và khoảng cách
  const totalDuration = route ? route.duration : 0;
  const totalDistance = route ? route.distance : 0;

  // --- Geocode via Nominatim (OpenStreetMap) ---
  const geocode = async (text: string) => {
    const q = encodeURIComponent(text);
    const boundedUrl = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&bounded=1&viewbox=100.0,0.0,150.0,50.0`; 
    
    try {
      const res = await fetch(boundedUrl, { headers: { 'Accept-Language': 'en' } });
      const arr = await res.json();
      if (arr && arr.length > 0) {
        const lat = parseFloat(arr[0].lat);
        const lon = parseFloat(arr[0].lon);
        return [lat, lon] as number[];
      }
      return null;
    } catch (err) {
      console.error('Geocode error', err);
      return null;
    }
  };

  // --- getRoute uses OSRM public API ---
  const getRoute = async (start: number[], end: number[]): Promise<Route | null> => {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        return data.routes[0] as Route;
      }
      return null;
    } catch (error) {
      console.error("OSRM Route Error:", error);
      return null;
    }
  };

  // Handler: when user clicks "Tìm đường"
  const computeRoute = async () => {
    if (!startCoord || !endCoord) return;
    const r = await getRoute(startCoord, endCoord);
    setRoute(r);
    
    if (r && r.legs && r.legs.length > 0) {
      const allSteps: Step[] = [];
      r.legs.forEach((leg: any) => {
        leg.steps.forEach((s: any) => allSteps.push(s as Step));
      });
      setSteps(allSteps);
    } else {
      setSteps([]);
    }
  };

  // Handlers for the inputs: geocode when pressing button "Tìm"
  const handleGeocodeStart = async () => {
    const coord = await geocode(startText);
    if (coord) setStartCoord(coord);
    else console.error('Không tìm thấy địa chỉ bắt đầu');
  };
  
  const handleGeocodeEnd = async () => {
    const coord = await geocode(endText);
    if (coord) setEndCoord(coord);
    else console.error('Không tìm thấy địa chỉ kết thúc');
  };

  return {
    startText, setStartText,
    endText, setEndText,
    startCoord, setStartCoord,
    endCoord, setEndCoord,
    selectingOnMap, setSelectingOnMap,
    route,
    steps,
    computeRoute,
    handleGeocodeStart,
    handleGeocodeEnd,
    totalDuration,
    totalDistance,
    DEFAULT_CENTER,
  };
};