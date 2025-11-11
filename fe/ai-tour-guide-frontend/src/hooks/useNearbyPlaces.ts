// src/hooks/useNearbyPlaces.ts
import { useState, useEffect } from "react";
import { NearbyCardProps } from "../types/places"; // (Xem File 2)
import { getNearbyJapanesePlaces, NearbyPlace } from "../services/geocodeService";
import { fakePlaces, DEV_LAT, DEV_LON, SAFE_RADIUS } from "../constants/locationData"; // (Xem File 3)

export const useNearbyPlaces = () => {
  const [nearbyData, setNearbyData] = useState<NearbyCardProps[]>(fakePlaces);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lon: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    const loadPlaces = async () => {
      setIsLoading(true);
      const devMode = process.env.NODE_ENV === "development"; // Cách check dev mode tốt hơn
      const latitude = devMode ? DEV_LAT : undefined;
      const longitude = devMode ? DEV_LON : undefined;

      const fetchNearby = async (lat: number, lon: number) => {
        setCurrentPosition({ lat, lon });
        try {
          const places: NearbyPlace[] = await getNearbyJapanesePlaces(lat, lon, SAFE_RADIUS);
          if (places.length > 0) {
            const mapped: NearbyCardProps[] = places.map((p) => {
              let icon = "📍";
              if (p.category.includes("food") || p.category.includes("catering")) icon = "🍽️";
              else if (p.category.includes("temple") || p.category.includes("tourism")) icon = "🏯";
              else if (p.category.includes("castle") || p.category.includes("museum")) icon = "🏰";
              else if (p.category.includes("sushi")) icon = "🍣";
              else if (p.category.includes("leisure")) icon = "🏞️";

              return {
                id: p.id,
                name: p.name,
                distance: p.distance >= 1000 ? (p.distance / 1000).toFixed(1) + " km" : p.distance + " m",
                location: p.location,
                icon,
                lat: p.lat,
                lon: p.lon,
              };
            });
            setNearbyData(mapped);
          } else {
             setNearbyData(fakePlaces); // Vẫn dùng fake data nếu API trả về rỗng
          }
        } catch (err) {
          console.error("Error fetching nearby places:", err);
          setNearbyData(fakePlaces); // Fallback khi lỗi
        } finally {
          setIsLoading(false); // Dừng loading
        }
      };

      if (latitude && longitude) {
        await fetchNearby(latitude, longitude);
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude: lat, longitude: lon } = pos.coords;
            await fetchNearby(lat, lon);
          },
          (err) => {
            console.error("Geolocation error:", err);
            fetchNearby(DEV_LAT, DEV_LON); // Fallback về vị trí dev
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        fetchNearby(DEV_LAT, DEV_LON); // Fallback về vị trí dev
      }
    };

    loadPlaces();
  }, []); // Chỉ chạy 1 lần

  return { nearbyData, currentPosition, isLoading };
};