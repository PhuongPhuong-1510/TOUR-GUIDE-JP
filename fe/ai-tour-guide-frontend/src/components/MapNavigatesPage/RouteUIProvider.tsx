// components/MapNavigatesPage/RouteUIProvider.tsx
import React from "react";
import { MoreVertical } from "lucide-react";
import RealMap from "../RealMap"; 
import Header from "../Header";
import { RouteSidebar } from "./RouteSidebar";
import { useRouteState } from "./useRouteState";
import { LocationState, Coord } from "./types";

const DEFAULT_CENTER: Coord = [35.682839, 139.759455]; // Tokyo, Nhật Bản

interface RouteUIProviderProps {
  initialState: LocationState;
}

export const RouteUIProvider: React.FC<RouteUIProviderProps> = ({ initialState }) => {
  const initialStart: Coord | null = initialState.startLat !== undefined && initialState.startLon !== undefined 
    ? [initialState.startLat, initialState.startLon] as Coord
    : null;
  const initialEnd: Coord | null = initialState.endLat !== undefined && initialState.endLon !== undefined 
    ? [initialState.endLat, initialState.endLon] as Coord
    : null;
    
  const state = useRouteState({ startCoord: initialStart, endCoord: initialEnd });

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
            // center nhận [lat, lon]
            center={(state.startCoord || state.endCoord || DEFAULT_CENTER)}
            startCoord={state.startCoord}
            endCoord={state.endCoord}
            onMapClick={state.handleMapClick} // Gán handler từ hook
            route={state.route}
          />

          {/* Map Controls (Giữ nguyên) */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-10">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex flex-col bg-white rounded-lg shadow-xl border border-gray-200">
              <button className="p-2 hover:bg-blue-50 rounded-t-lg text-lg font-semibold transition-colors text-gray-700">+</button>
              <div className="h-px bg-gray-200" />
              <button className="p-2 hover:bg-blue-50 rounded-b-lg text-lg font-semibold transition-colors text-gray-700">-</button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <RouteSidebar state={state} />
      </div>
    </div>
  );
};