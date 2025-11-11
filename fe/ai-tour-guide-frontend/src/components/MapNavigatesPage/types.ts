// components/MapNavigatesPage/types.ts
import { ORSProfile, Coord as ServiceCoord } from "../../services/routeService"; 
import { MapRoute as ImportedMapRoute } from "../../components/RealMap"; // Giả định RealMap exports MapRoute
export type Coord = ServiceCoord; // ✅ Đảm bảo nó được export
// --- Cấu trúc dữ liệu MapRoute (Tương đương với Feature của GeoJSON) ---
// Dùng lại định nghĩa MapRoute từ component RealMap (nếu có), hoặc định nghĩa chi tiết
export interface MapRouteProperties {
    summary: {
        duration: number; // Tổng thời gian (giây)
        distance: number; // Tổng khoảng cách (mét)
    };
    segments: Array<{
        steps: Array<{
            distance: number; // Khoảng cách bước (mét)
            duration: number; // Thời gian bước (giây)
            instruction: string; // Hướng dẫn rẽ
            name: string; // Tên đường
        }>;
    }>;
}

export interface MapRoute {
    geometry: {
        type: 'LineString';
        coordinates: [number, number][]; // [lon, lat][]
    };
    properties: MapRouteProperties;
}


// --- Các Interfaces Khác ---

export interface LocationState {
    startLat?: number;
    startLon?: number;
    endLat?: number;
    endLon?: number;
}

export type SelectingMode = "start" | "end" | null;

export interface RouteStep {
    distance: number;
    duration: number;
    instruction: string;
    name: string;
}

export interface RouteState {
    // Trạng thái input và tọa độ
    startText: string;
    setStartText: (val: string) => void;
    endText: string;
    setEndText: (val: string) => void;
    startCoord: Coord | null;
    setStartCoord: (coord: Coord | null) => void;
    endCoord: Coord | null;
    setEndCoord: (coord: Coord | null) => void;
    
    // Trạng thái Map
    selectingOnMap: SelectingMode;
    setSelectingOnMap: (mode: SelectingMode) => void;
    
    // Trạng thái Định tuyến
    route: MapRoute | null;
    steps: RouteStep[];
    transportMode: ORSProfile;
    setTransportMode: (mode: ORSProfile) => void;
    loading: boolean;
    totalDuration: number;
    totalDistance: number;

    // Hành động
    computeRoute: (start: Coord, end: Coord, mode: ORSProfile) => Promise<void>;
    handleComputeClick: () => void;
    handleMapClick: (latlng: number[]) => void;
}