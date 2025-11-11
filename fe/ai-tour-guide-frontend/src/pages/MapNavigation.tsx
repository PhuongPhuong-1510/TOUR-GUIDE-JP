// pages/MapNavigatesPage.tsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Car,
  Bike,
  PersonStanding,
  Bus,
  MapPin,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

import RealMap, { Coord, MapRoute } from "../components/RealMap";
import Header from "../components/Header";
import NavIcon from "../components/NavIcon";
import RouteInputs from "../components/RouteInputs";
import RouteStepsList from "../components/RouteStepsList";
import { getRouteORS, ORSProfile } from "../services/routeService";
import { useLocation, useNavigate } from "react-router-dom";

const DEFAULT_CENTER: Coord = [35.682839, 139.759455]; // Tokyo, Nhật Bản

interface LocationState {
  startLat?: number;
  startLon?: number;
  endLat?: number;
  endLon?: number;
}

const MapNavigatesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // STATE cơ bản
  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");
  const [startCoord, setStartCoord] = useState<Coord | null>(null);
  const [endCoord, setEndCoord] = useState<Coord | null>(null);
  const [selectingOnMap, setSelectingOnMap] = useState<"start" | "end" | null>(null);

  // STATE định tuyến
  const [route, setRoute] = useState<MapRoute | null>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [transportMode, setTransportMode] = useState<ORSProfile>("driving-car");
  const [loading, setLoading] = useState(false);

  const totalDuration = route?.properties?.summary?.duration || 0;
  const totalDistance = route?.properties?.summary?.distance || 0;

  // ⚙️ Cờ để ngăn chạy lần đầu và manual compute
  const firstRunRef = useRef(true);
  const manualComputeRef = useRef(false);
  const isComputing = useRef(false);

  // Hàm computeRoute
  const computeRoute = useCallback(
    async (start: Coord, end: Coord, mode: ORSProfile) => {
      try {
        setLoading(true);
        const feat = await getRouteORS(start, end, mode);

        if (!feat) {
          setRoute(null);
          setSteps([]);
          return;
        }

        setRoute({ geometry: feat.geometry, properties: feat.properties } as MapRoute);

        const segs = feat.properties?.segments || [];
        const allSteps = segs.length > 0 ? segs[0].steps : [];
        const normalized = allSteps.map((s: any) => ({
          distance: s.distance,
          duration: s.duration,
          instruction: s.instruction || s.name || "",
          name: s.name || "",
        }));

        setSteps(normalized);
      } catch (err) {
        console.error("computeRoute error", err);
        setRoute(null);
        setSteps([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Lấy dữ liệu từ location.state khi mount
  useEffect(() => {
    if (state) {
      if (state.startLat !== undefined && state.startLon !== undefined) {
        setStartCoord([state.startLat, state.startLon]);
        setStartText(`${state.startLat.toFixed(6)}, ${state.startLon.toFixed(6)}`);
      }
      if (state.endLat !== undefined && state.endLon !== undefined) {
        setEndCoord([state.endLat, state.endLon]);
        setEndText(`${state.endLat.toFixed(6)}, ${state.endLon.toFixed(6)}`);
      }
    }
  }, [state]);

  // ✅ HANDLE CLICK: chỉ compute khi user click
  const handleComputeClick = () => {
    if (!startCoord || !endCoord) return;

    manualComputeRef.current = true; // tín hiệu user click
    setLoading(true);

    computeRoute(startCoord, endCoord, transportMode).finally(() => {
      setLoading(false);
      manualComputeRef.current = false; // reset
    });
  };

  // useEffect tự động compute nhưng sẽ bỏ qua nếu user click
  useEffect(() => {
    if (firstRunRef.current || manualComputeRef.current) {
      firstRunRef.current = false;
      return;
    }

    if (isComputing.current) return;

    if (startCoord && endCoord) {
      isComputing.current = true;
      computeRoute(startCoord, endCoord, transportMode).finally(() => {
        isComputing.current = false;
      });
    }
  }, [startCoord, endCoord, transportMode, computeRoute]);

  const handleModeChange = (mode: ORSProfile) => setTransportMode(mode);

  const renderNavIcon = (
    Icon: React.ElementType,
    label: string,
    mode: ORSProfile | null,
    disabled: boolean = false
  ) => (
    <NavIcon
      Icon={Icon}
      label={label}
      active={mode !== null ? transportMode === mode : false}
      onClick={mode !== null ? () => handleModeChange(mode) : undefined}
      disabled={disabled || loading}
    />
  );

  return (
    <div className="relative h-screen w-full flex flex-col font-sans">
      {/* HEADER CỐ ĐỊNH */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* MAIN CONTENT: MAP + SIDEBAR */}
      <div className="flex-grow relative flex mt-16">
        {/* MAP */}
        <div className="absolute inset-0 z-0">
          <RealMap
            center={(startCoord || endCoord || DEFAULT_CENTER) as Coord}
            startCoord={startCoord}
            endCoord={endCoord}
            onMapClick={(latlng: number[]) => {
              if (selectingOnMap === "start") {
                setStartCoord(latlng as Coord);
                setStartText(`${latlng[0].toFixed(6)}, ${latlng[1].toFixed(6)}`);
                setSelectingOnMap(null);
              } else if (selectingOnMap === "end") {
                setEndCoord(latlng as Coord);
                setEndText(`${latlng[0].toFixed(6)}, ${latlng[1].toFixed(6)}`);
                setSelectingOnMap(null);
              }
            }}
            route={route}
          />

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex flex-col bg-white rounded-lg shadow-xl border border-gray-200">
              <button className="p-2 hover:bg-blue-50 rounded-t-lg text-lg font-semibold transition-colors text-gray-700">
                +
              </button>
              <div className="h-px bg-gray-200" />
              <button className="p-2 hover:bg-blue-50 rounded-b-lg text-lg font-semibold transition-colors text-gray-700">
                -
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="relative z-20 w-full max-w-sm md:w-[380px] bg-white shadow-2xl flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {/* Header + Inputs */}
          <div className="flex flex-col p-4 space-y-4 border-b">
            <div className="flex items-center space-x-3">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                Tìm Đường {loading && "(Đang tải...)"}
              </h2>
            </div>

            {/* Transport Mode */}
            <div className="flex justify-between border-b pb-4">
              {renderNavIcon(PersonStanding, "Đi bộ", "foot-walking")}
              {renderNavIcon(Car, "Ô tô", "driving-car")}
              {renderNavIcon(Bus, "Công cộng", null, true)}
              {renderNavIcon(Bike, "Xe đạp", "cycling-regular")}
              <NavIcon Icon={MapPin} label="Bay" disabled />
            </div>

            {/* Route Inputs */}
            <RouteInputs
              startText={startText}
              setStartText={setStartText}
              endText={endText}
              setEndText={setEndText}
              startCoord={startCoord}
              setStartCoord={setStartCoord}
              endCoord={endCoord}
              setEndCoord={setEndCoord}
              selectingOnMap={selectingOnMap}
              setSelectingOnMap={setSelectingOnMap}
              computeRoute={computeRoute} // ✅ dùng handleComputeClick
              totalDuration={totalDuration}
              totalDistance={totalDistance}
              loading={loading}
            />
          </div>

          {/* Route Steps */}
          <div className="flex-1 p-4">
            <RouteStepsList steps={steps} selectingOnMap={selectingOnMap} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapNavigatesPage;
