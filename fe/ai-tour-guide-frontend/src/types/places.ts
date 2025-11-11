// src/types/places.ts
export interface NearbyCardProps {
  id: string | number;
  name: string;
  distance: string;
  location: string;
  icon: string;
  lat?: number;
  lon?: number;
}