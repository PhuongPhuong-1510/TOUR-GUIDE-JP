// src/types/smartTrip.ts

// Định nghĩa một Hoạt động (có tọa độ)
export interface Activity {
  id: string;
  time: string;
  activity_name: string;
  description: string;
  type: 'sightseeing' | 'food' | 'transport' | 'shopping' | 'other';
  location_name: string;
  location_coords: {
    lat: number;
    lng: number;
  };
  estimated_duration_minutes: number;
}

// Định nghĩa một Ngày trong lịch trình
export interface ItineraryItem {
  day: number;
  theme_of_the_day: string;
  activities: Activity[];
  image?: string;
}