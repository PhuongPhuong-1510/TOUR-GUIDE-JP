import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { Activity } from '../../types/smartTrip'; 

mapboxgl.accessToken = process.env.REACT_APP_MAP_API_KEY;
interface MapWrapperProps {
  activities: Activity[];
  selectedActivityId: string | null;
  onActivitySelect: (id: string) => void;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ activities, selectedActivityId, onActivitySelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Khởi tạo bản đồ
  useEffect(() => {
    if (map.current || !mapContainer.current) return; 
    
    // Lấy tọa độ trung tâm (VD: hoạt động đầu tiên)
    const center = activities.length > 0 
      ? [activities[0].location_coords.lng, activities[0].location_coords.lat]
      : [106.8, 10.7]; // Tọa độ dự phòng

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center as [number, number],
      zoom: 12
    });

    // Thêm các ghim (Markers)
    activities.forEach(activity => {
      const marker = new mapboxgl.Marker()
        .setLngLat([activity.location_coords.lng, activity.location_coords.lat])
        .addTo(map.current!);
      
      // Khi click vào ghim trên bản đồ -> gọi hàm của Cha
      marker.getElement().addEventListener('click', () => {
        onActivitySelect(activity.id);
      });
      
      markersRef.current[activity.id] = marker;
    });

  }, [activities, onActivitySelect]); // Chỉ chạy 1 lần khi có activities

  // Effect để "fly" (bay) bản đồ khi 'selectedActivityId' thay đổi
  useEffect(() => {
    if (!selectedActivityId || !map.current) return;

    const selected = activities.find(a => a.id === selectedActivityId);
    if (selected) {
      map.current.flyTo({
        center: [selected.location_coords.lng, selected.location_coords.lat],
        zoom: 15
      });
      
      // (Nâng cao: Hiển thị popup trên ghim)
      // new mapboxgl.Popup()
      //   .setLngLat([selected.location_coords.lng, selected.location_coords.lat])
      //   .setHTML(`<strong>${selected.activity_name}</strong><p>${selected.description}</p>`)
      //   .addTo(map.current);
    }
  }, [selectedActivityId, activities]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default MapWrapper;