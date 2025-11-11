// components/MapNavigatesPage/RouteSidebar.tsx
import React from "react";
import {
  Car, Bike, PersonStanding, Bus, MapPin, ArrowLeft,
} from "lucide-react";
import NavIcon from "../NavIcon";
import RouteInputs from "../RouteInputs";
import RouteStepsList from "../RouteStepsList";
// 💡 CẦN IMPORT CẢ Coord TỪ routeService.ts HOẶC types.ts ĐỂ DÙNG TRONG HÀM WRAPPER
import { ORSProfile, Coord } from "../../services/routeService"; // Hoặc import { ORSProfile, Coord } from "./types";
import { RouteState } from "./types";
import { useNavigate } from "react-router-dom";

interface RouteSidebarProps {
  state: RouteState;
}

const renderNavIcon = (
  Icon: React.ElementType,
  label: string,
  mode: ORSProfile | null,
  activeMode: ORSProfile,
  onModeChange: (mode: ORSProfile) => void,
  disabled: boolean = false
) => (
  <NavIcon
    Icon={Icon}
    label={label}
    active={mode !== null ? activeMode === mode : false}
    onClick={mode !== null ? () => onModeChange(mode) : undefined}
    disabled={disabled}
  />
);

export const RouteSidebar: React.FC<RouteSidebarProps> = ({ state }) => {
  const navigate = useNavigate();
  const { 
    startText, setStartText, endText, setEndText, 
    startCoord, setStartCoord, endCoord, setEndCoord,
    selectingOnMap, setSelectingOnMap, 
    transportMode, setTransportMode, loading,
    totalDuration, totalDistance, handleComputeClick, steps
  } = state;

  // 💡 HÀM WRAPPER SỬA LỖI TS2322 💡
  // Hàm này có signature khớp với RouteInputs.tsx (nhận 3 tham số và trả về Promise<void>),
  // nhưng thực tế chỉ gọi handleComputeClick (không tham số) để kích hoạt logic tìm đường.
  const dummyComputeRoute = (start: Coord, end: Coord, mode: ORSProfile): Promise<void> => {
      // Dùng hàm kích hoạt tìm đường đã có (không cần tham số)
      handleComputeClick(); 
      // Trả về Promise.resolve() để TypeScript chấp nhận kiểu dữ liệu (Promise<void>)
      return Promise.resolve();
  };

  return (
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
          {renderNavIcon(PersonStanding, "Đi bộ", "foot-walking", transportMode, setTransportMode, loading)}
          {renderNavIcon(Car, "Ô tô", "driving-car", transportMode, setTransportMode, loading)}
          {renderNavIcon(Bus, "Công cộng", null, transportMode, setTransportMode, true)}
          {renderNavIcon(Bike, "Xe đạp", "cycling-regular", transportMode, setTransportMode, loading)}
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
          // ✅ Thay thế hàm bị lỗi bằng hàm wrapper mới
          computeRoute={dummyComputeRoute} 
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
  );
};