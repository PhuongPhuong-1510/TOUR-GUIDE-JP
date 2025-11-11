// src/constants/locationData.ts
import { NearbyCardProps } from "../types/places";

// Vị trí dev
export const DEV_LAT = 35.6895;
export const DEV_LON = 139.6917;

// Bán kính an toàn
export const SAFE_RADIUS = 50000; // 50 km

// Fake data fallback
export const fakePlaces: NearbyCardProps[] = [
  // { id: 1, name: "Tōchō", distance: "28 m", location: "Tokyo", icon: "📍", lat: 35.6895, lon: 139.6917 },
  // { id: 2, name: "Tokyo Metropolitan Government Building", distance: "16 m", location: "Shinjuku", icon: "🍽️", lat: 35.6897, lon: 139.692 },
];