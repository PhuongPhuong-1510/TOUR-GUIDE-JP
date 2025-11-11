// components/MapNavigatesPage/useRouteState.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { getRouteORS, ORSProfile, Coord } from "../../services/routeService";
import { RouteState, SelectingMode, RouteStep, MapRoute } from "./types";

const DEFAULT_TRANSPORT_MODE: ORSProfile = "driving-car";

export const useRouteState = (initialState: { startCoord: Coord | null, endCoord: Coord | null }): RouteState => {
  // STATE cơ bản
  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");
  const [startCoord, setStartCoord] = useState<Coord | null>(initialState.startCoord);
  const [endCoord, setEndCoord] = useState<Coord | null>(initialState.endCoord);
  const [selectingOnMap, setSelectingOnMap] = useState<SelectingMode>(null);

  // STATE định tuyến
  const [route, setRoute] = useState<MapRoute | null>(null);
  const [steps, setSteps] = useState<RouteStep[]>([]);
  const [transportMode, setTransportMode] = useState<ORSProfile>(DEFAULT_TRANSPORT_MODE);
  const [loading, setLoading] = useState(false);

  // ⚙️ Cờ để quản lý luồng tự động và thủ công
  const firstRunRef = useRef(true);
  const manualComputeRef = useRef(false);
  const isComputing = useRef(false);
  
  const totalDuration = route?.properties?.summary?.duration || 0;
  const totalDistance = route?.properties?.summary?.distance || 0;

  // Hàm computeRoute (đã được bọc trong useCallback)
  const computeRoute = useCallback(
    async (start: Coord, end: Coord, mode: ORSProfile) => {
      if (isComputing.current) return;
      
      isComputing.current = true;
      try {
        setLoading(true);
        const feat = await getRouteORS(start, end, mode);

        if (!feat) {
          setRoute(null);
          setSteps([]);
          return;
        }

        // Ép kiểu (cast) về MapRoute đã định nghĩa trong types.ts
        setRoute(feat as MapRoute); 

        const segs = feat.properties?.segments || [];
        const allSteps = segs.length > 0 ? segs[0].steps : [];
        const normalized = allSteps.map((s: any) => ({
          distance: s.distance,
          duration: s.duration,
          instruction: s.instruction || s.name || "",
          name: s.name || "",
        })) as RouteStep[];

        setSteps(normalized);
      } catch (err) {
        console.error("computeRoute error", err);
        setRoute(null);
        setSteps([]);
      } finally {
        setLoading(false);
        isComputing.current = false;
      }
    },
    []
  );

  // 💡 LOGIC: Tự động compute khi start/end/mode thay đổi (trừ lần đầu)
  useEffect(() => {
    if (firstRunRef.current || manualComputeRef.current) {
      firstRunRef.current = false;
      manualComputeRef.current = false; // reset sau khi xử lý
      return;
    }
    
    if (startCoord && endCoord) {
      computeRoute(startCoord, endCoord, transportMode);
    }
  }, [startCoord, endCoord, transportMode, computeRoute]);

  // ✅ HANDLER: Bấm nút Tìm đường (force compute)
  const handleComputeClick = () => {
    if (!startCoord || !endCoord) return;
    manualComputeRef.current = true; // Báo hiệu là user click, bỏ qua tự động
    computeRoute(startCoord, endCoord, transportMode);
  };
  
  // ✅ HANDLER: Click vào bản đồ
  const handleMapClick = (latlng: number[]) => {
    const coord = latlng as Coord;
    if (selectingOnMap === "start") {
      setStartCoord(coord);
      setStartText(`${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`);
      setSelectingOnMap(null);
    } else if (selectingOnMap === "end") {
      setEndCoord(coord);
      setEndText(`${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`);
      setSelectingOnMap(null);
    }
  };


  // Khởi tạo text khi có coord ban đầu (từ URL)
  useEffect(() => {
      if (initialState.startCoord) {
          setStartText(`${initialState.startCoord[0].toFixed(6)}, ${initialState.startCoord[1].toFixed(6)}`);
      }
      if (initialState.endCoord) {
          setEndText(`${initialState.endCoord[0].toFixed(6)}, ${initialState.endCoord[1].toFixed(6)}`);
      }
  }, [initialState]);

  return {
    startText, setStartText,
    endText, setEndText,
    startCoord, setStartCoord,
    endCoord, setEndCoord,
    selectingOnMap, setSelectingOnMap,
    route,
    steps,
    transportMode, setTransportMode,
    loading,
    totalDuration,
    totalDistance,
    computeRoute,
    handleComputeClick,
    handleMapClick
  };
};