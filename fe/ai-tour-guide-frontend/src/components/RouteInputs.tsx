import React from "react";
import { Target } from "lucide-react";
import { formatTime, formatDistance } from "../utils/formatters";
import { Coord } from "../components/RealMap";
import AutocompleteInput from "./AutocompleteInput";
import { GeoapifyFeature } from "../services/geocodeService";
import { ORSProfile } from "../services/routeService";

interface RouteInputsProps {
    startText: string;
    setStartText: (text: string) => void;
    endText: string;
    setEndText: (text: string) => void;
    startCoord: Coord | null;
    setStartCoord: (coord: Coord | null) => void;
    endCoord: Coord | null;
    setEndCoord: (coord: Coord | null) => void;
    selectingOnMap: "start" | "end" | null;
    setSelectingOnMap: (val: "start" | "end" | null) => void;
    computeRoute: (start: Coord, end: Coord, mode: ORSProfile) => Promise<void>;
    totalDuration: number;
    totalDistance: number;
    loading: boolean;
}

const RouteInputs: React.FC<RouteInputsProps> = ({
    startText, setStartText, endText, setEndText,
    startCoord, setStartCoord, endCoord, setEndCoord,
    selectingOnMap, setSelectingOnMap,
    computeRoute, totalDuration, totalDistance,
    loading,
}) => {

    // 🔹 Hàm trung gian để gọi computeRoute đúng tham số
    const handleComputeClick = () => {
        if (startCoord && endCoord) {
            computeRoute(startCoord, endCoord, "driving-car");
            // Nếu muốn dynamic theo mode: truyền transportMode xuống props và dùng ở đây
        }
    };

    const handleSelectStart = (f: GeoapifyFeature) => {
        setStartText(f.formatted);
        setStartCoord([f.lat, f.lon]);
    };

    const handleSelectEnd = (f: GeoapifyFeature) => {
        setEndText(f.formatted);
        setEndCoord([f.lat, f.lon]);
    };

    return (
        <div className="mt-4 space-y-3">
            {/* START */}
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
                <div className="flex-grow">
                    <div className="text-xs text-gray-500">Bắt đầu</div>
                    <AutocompleteInput
                        value={startText}
                        onChange={setStartText}
                        onSelect={handleSelectStart}
                        placeholder="Vị trí bắt đầu"
                        disabled={selectingOnMap === "start"}
                        showSearchButton={false}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <button
                        className={`text-sm ${selectingOnMap === 'start' ? 'text-red-500 font-bold' : 'text-blue-600'} hover:underline`}
                        onClick={() => setSelectingOnMap(selectingOnMap === 'start' ? null : 'start')}
                    >
                        {selectingOnMap === 'start' ? 'Hủy' : 'Dùng bản đồ'}
                    </button>
                </div>
            </div>

            {/* END */}
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <div className="flex-grow">
                    <div className="text-xs text-gray-500">Kết thúc</div>
                    <AutocompleteInput
                        value={endText}
                        onChange={setEndText}
                        onSelect={handleSelectEnd}
                        placeholder="Vị trí kết thúc"
                        disabled={selectingOnMap === "end"}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <button
                        className={`text-sm ${selectingOnMap === 'end' ? 'text-red-500 font-bold' : 'text-blue-600'} hover:underline`}
                        onClick={() => setSelectingOnMap(selectingOnMap === 'end' ? null : 'end')}
                    >
                        {selectingOnMap === 'end' ? 'Hủy' : 'Dùng bản đồ'}
                    </button>
                </div>
            </div>

            {/* Tổng quãng đường + thời gian */}
            <div className="flex items-center justify-between mt-3 text-sm pt-2">
                <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-800">{formatTime(totalDuration)}</span>
                    <span className="text-gray-500">· {formatDistance(totalDistance)}</span>
                </div>

                <button
                    className="text-white bg-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    onClick={handleComputeClick} // 🔹 gọi hàm trung gian
                    disabled={!startCoord || !endCoord || loading} // disable khi đang load
                >
                    {loading ? "Đang tải..." : "Tìm Đường"}

                </button>
            </div>
        </div>
    );
};

export default RouteInputs;
