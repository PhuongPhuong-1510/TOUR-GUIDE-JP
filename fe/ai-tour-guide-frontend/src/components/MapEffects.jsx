// src/components/map/MapEffects.jsx

import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

/**
 * Component con xử lý các logic tương tác/hiệu ứng của bản đồ (định tâm, click).
 */
const MapEffects = ({ center, route, startCoord, endCoord, onMapClick }) => {
    const map = useMap();

    // Xử lý click map: Gửi tọa độ [lat, lng] về component cha
    useMapEvents({
        click(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            onMapClick([lat, lng]);
        }
    });

    // 1. Logic Định tâm khi thay đổi tọa độ Bắt đầu/Kết thúc
    useEffect(() => {
        if (startCoord && endCoord) {
            // Định tâm chứa cả hai điểm
            const bounds = L.latLngBounds([startCoord], [endCoord]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (startCoord || endCoord) {
            // Định tâm tại điểm đơn lẻ
            const coord = startCoord || endCoord;
            map.setView(coord, 15);
        } else if (center) {
             // Định tâm tại vị trí trung tâm mặc định
             map.setView(center, 13);
        }
    }, [map, startCoord, endCoord, center]);


    // 2. Logic Định vị lại bản đồ khi có tuyến đường OSRM
    useEffect(() => {
        if (route && route.geometry && route.geometry.coordinates.length > 0) {
            // Chuyển đổi OSRM ([lng, lat]) sang Leaflet ([lat, lng])
            const leafletCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            
            const bounds = L.latLngBounds(leafletCoords);
            
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, route]);

    return null;
};

export default MapEffects;