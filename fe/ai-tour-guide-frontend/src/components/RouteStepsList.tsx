import React from "react";
import { ChevronDown } from "lucide-react";
import { formatDistance, formatTime } from "../utils/formatters";

interface ORSStep {
  distance: number;
  duration: number;
  instruction?: string;
  name?: string;
}

interface RouteStepsListProps {
  steps: ORSStep[];
  selectingOnMap: "start" | "end" | null;
  loading?: boolean;
  hoveredStep?: number | null;
  setHoveredStep?: (idx: number | null) => void;
}

const rotateFromModifier = (instr?: string) => {
  if (!instr) return -90;
  const lower = instr.toLowerCase();
  if (lower.includes("left")) return 180;
  if (lower.includes("right")) return 0;
  if (lower.includes("u-turn") || lower.includes("u turn")) return 180;
  if (lower.includes("slight")) return -45;
  return -90;
};

const RouteStepsList: React.FC<RouteStepsListProps> = ({
  steps,
  selectingOnMap,
  loading = false,
  hoveredStep,
  setHoveredStep
}) => {

  if (loading) {
    return (
      <div className="flex-1 space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-6 bg-gray-200 animate-pulse rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-6">
      <h3 className="text-base font-semibold text-gray-700 border-b pb-2">
        {steps.length > 0 ? "Các bước đi chi tiết" : "Trạng thái"}
      </h3>

      {selectingOnMap && (
        <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-200 shadow-inner">
          Đang chọn vị trí{" "}
          <strong>{selectingOnMap === "start" ? "BẮT ĐẦU" : "KẾT THÚC"}</strong> trên bản đồ.
          Vui lòng click vào bản đồ!
        </div>
      )}

      {steps.length > 0 ? (
        steps.map((s, idx) => {
          const instr = s.instruction || s.name || "";
          const rot = rotateFromModifier(instr);
          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 cursor-pointer p-1 rounded transition-colors ${
                hoveredStep === idx ? "bg-blue-50" : ""
              }`}
              onMouseEnter={() => setHoveredStep?.(idx)}
              onMouseLeave={() => setHoveredStep?.(null)}
            >
              <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <div className="p-1 border bg-blue-50 rounded-full my-1 shadow-sm">
                  <ChevronDown className="w-4 h-4 text-blue-700" style={{ transform: `rotate(${rot}deg)` }} />
                </div>
                {idx < steps.length - 1 && <div className="w-0.5 h-8 bg-gray-300 rounded-full" />}
                <span className="text-xs text-gray-500 mt-1">{formatDistance(s.distance)}</span>
              </div>

              <div className="flex flex-col flex-grow pt-1 pb-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{instr}</p>
                <span className="text-xs text-gray-500 mt-1">
                  Thời gian: {formatTime(s.duration)}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-sm text-gray-500">
          Bản đồ đang mặc định. Nhập địa điểm và nhấn <strong>Tìm Đường</strong>.
        </div>
      )}
    </div>
  );
};

export default RouteStepsList;
