import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity } from '../../types/smartTrip'; 

// ⚠️ Cần phải import lại icon mặc định của Leaflet để áp dụng CSS Filter
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png'; // Không cần thiết cho việc đổi màu ghim chính

// API Key của Geoapify (cần thiết lập trong .env)
const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;
console.log("Geoapify Key:", GEOAPIFY_API_KEY);

// Cấu hình Tile Layer của Geoapify
const GEOAPIFY_TILE_URL = `https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;
const ATTRIBUTION =
  'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// 🚩 KHỐI CSS FILTER ĐỂ ĐỔI MÀU GỐC (XANH) SANG MÀU ĐỎ (RED)
// Chúng ta sẽ áp dụng class này cho element của marker
const CUSTOM_MARKER_CSS = `
  /* Class dùng để ghim được chọn */
  .leaflet-marker-icon.selected-red {
    /* CSS Filter để chuyển màu xanh dương sang màu đỏ */
    /* Giá trị filter này được tính toán dựa trên màu gốc của Leaflet Icon */
    filter: hue-rotate(240deg) brightness(1.2) saturate(2);
    /* Tùy chọn: Làm ghim nổi bật hơn */
    transform: translate3d(0px, 0px, 0px) scale(1.1); 
  }
`;

// Tùy chọn: Thêm CSS này vào DOM để kiểm tra nhanh.
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = CUSTOM_MARKER_CSS;
  document.head.appendChild(style);
}


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
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // 🚩 KHỞI TẠO DEFAULT ICON CƠ SỞ (Icon ghim Leaflet gốc)
  const baseIcon = useRef(L.icon({
    iconUrl: markerIcon,
    // Bạn có thể giữ markerShadow nếu muốn
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }));

  // 1. useEffect KHỞI TẠO BẢN ĐỒ (chạy 1 lần) - KHÔNG ĐỔI
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // ... (Logic khởi tạo map không đổi)
    const fallbackCenter: LatLngExpression = [10.762622, 106.660172];
    const initialCenter: LatLngExpression =
      activities.length > 0
        ? [activities[0].location_coords.lat, activities[0].location_coords.lng]
        : fallbackCenter;

    map.current = L.map(mapContainer.current, {
      center: initialCenter,
      zoom: 12,
    });

    L.tileLayer(GEOAPIFY_TILE_URL, {
      attribution: ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []); 

  // 2. useEffect CẬP NHẬT GHIM (chạy khi 'activities' HOẶC 'selectedActivityId' thay đổi)
  useEffect(() => {
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

      const isSelected = activity.id === selectedActivityId;
      
      // 🚩 Tạo một Icon mới dựa trên Base Icon, thêm class nếu được chọn
      const currentIcon = L.icon({
        ...baseIcon.current.options, // Kế thừa các thuộc tính kích thước, neo,...
        className: isSelected ? 'selected-red' : '', // Áp dụng class CSS Filter
      });

      // Tạo Marker với icon tùy chỉnh
      const marker = L.marker(latlng, { icon: currentIcon })
        .addTo(map.current!);

      // Khi click vào ghim -> gọi hàm của Cha
      marker.on('click', () => {
        onActivitySelect(activity.id);
      });

      markersRef.current.push(marker);
    });

    // --- C. Tự động zoom cho vừa tất cả ghim ---
    if (activities.length > 0) {
      const latLngs: LatLngExpression[] = activities.map((activity) => [
        activity.location_coords.lat,
        activity.location_coords.lng,
      ]);
      const bounds = L.latLngBounds(latLngs);
      map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [activities, onActivitySelect, selectedActivityId]); 

  // 3. useEffect "FLY" (bay) BẢN ĐỒ - KHÔNG ĐỔI
  useEffect(() => {
    if (!selectedActivityId || !map.current) return;

    const selected = activities.find((a) => a.id === selectedActivityId);
    if (selected) {
      const latlng: LatLngExpression = [
        selected.location_coords.lat,
        selected.location_coords.lng,
      ];
      map.current.flyTo(latlng, 15, { duration: 1.5 });
    }
  }, [selectedActivityId, activities]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default MapWrapper;