import React, { useEffect, useRef } from 'react';
// Import thư viện Leaflet và CSS
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity } from '../../types/smartTrip'; // Giả định đường dẫn này vẫn đúng

// Khắc phục lỗi icon Leaflet mặc định khi dùng Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Thiết lập icon mặc định cho Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// API Key của Geoapify (cần thiết lập trong .env)
const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;
console.log("Geoapify Key:", GEOAPIFY_API_KEY);

// Cấu hình Tile Layer của Geoapify (chọn kiểu 'osm-carto' hoặc kiểu khác)
const GEOAPIFY_TILE_URL = `https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;
const ATTRIBUTION =
  'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

interface MapWrapperProps {
  activities: Activity[];
  selectedActivityId: string | null;
  onActivitySelect: (id: string) => void;
}

const MapWrapper: React.FC<MapWrapperProps> = ({
  activities,
  selectedActivityId,
  onActivitySelect,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  // Thay đổi: map.current giờ là đối tượng L.Map
  const map = useRef<L.Map | null>(null);
  // Thay đổi: markersRef giờ lưu mảng đối tượng L.Marker
  const markersRef = useRef<L.Marker[]>([]);

  // 1. useEffect KHỞI TẠO BẢN ĐỒ (chạy 1 lần)
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Tọa độ dự phòng: TP.HCM
    const fallbackCenter: LatLngExpression = [10.762622, 106.660172]; 
    const initialCenter: LatLngExpression =
      activities.length > 0
        ? [activities[0].location_coords.lat, activities[0].location_coords.lng]
        : fallbackCenter;

    // --- Khởi tạo Leaflet Map ---
    map.current = L.map(mapContainer.current, {
      center: initialCenter,
      zoom: 12,
      // Thêm control zoom/pan mặc định của Leaflet
    });

    // --- Thêm Tile Layer của Geoapify ---
    L.tileLayer(GEOAPIFY_TILE_URL, {
      attribution: ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map.current);

    // Cleanup khi component unmount
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []); // <-- Mảng dependency rỗng, chỉ chạy 1 lần

  // 2. useEffect CẬP NHẬT GHIM (chạy khi 'activities' thay đổi)
  useEffect(() => {
    // Chỉ chạy khi map đã được khởi tạo
    if (!map.current) return;

    // --- A. DỌN DẸP GHIM CŨ ---
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // --- B. VẼ GHIM MỚI ---
    if (activities.length === 0) return;

    activities.forEach((activity) => {
      const latlng: LatLngExpression = [
        activity.location_coords.lat,
        activity.location_coords.lng,
      ];

      const marker = L.marker(latlng)
        .addTo(map.current!);

      // Khi click vào ghim trên bản đồ -> gọi hàm của Cha
      marker.on('click', () => {
        onActivitySelect(activity.id);
      });

      // Lưu marker mới vào ref
      markersRef.current.push(marker);
    });

    // --- C. (Nâng cao) Tự động zoom cho vừa tất cả ghim ---
    if (activities.length > 0) {
      // Lấy tất cả tọa độ để tạo Bounds
      const latLngs: LatLngExpression[] = activities.map((activity) => [
        activity.location_coords.lat,
        activity.location_coords.lng,
      ]);

      // Tạo bounds từ các điểm, sau đó điều chỉnh bản đồ
      const bounds = L.latLngBounds(latLngs);
      map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [activities, onActivitySelect]); // <-- Phụ thuộc vào activities

  // 3. useEffect "FLY" (bay) BẢN ĐỒ
  useEffect(() => {
    if (!selectedActivityId || !map.current) return;

    const selected = activities.find((a) => a.id === selectedActivityId);
    if (selected) {
      const latlng: LatLngExpression = [
        selected.location_coords.lat,
        selected.location_coords.lng,
      ];
      // Leaflet dùng .flyTo để di chuyển và phóng to/thu nhỏ
      map.current.flyTo(latlng, 15, { duration: 1.5 });
    }
  }, [selectedActivityId, activities]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default MapWrapper;