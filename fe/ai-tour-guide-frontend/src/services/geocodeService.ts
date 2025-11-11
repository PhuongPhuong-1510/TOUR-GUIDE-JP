// services/geocodeService.ts
import axios from "axios";
import { Coord } from "../components/RealMap";

// Sử dụng API key, fallback tạm nếu chưa set env
const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY || "0bb88852c7f74aea9776032fea4efaaa";

// --- Interfaces ---
export interface GeoapifyFeature {
    formatted: string;
    lat: number;
    lon: number;
}

export interface NearbyPlace {
    id: string;
    name: string;
    distance: number; // mét
    location: string;
    category: string; // ví dụ: "food", "temple", "castle", "museum"
    lat: number;   // tọa độ lat
    lon: number;   // tọa độ lon
}

// --- Geocode: text -> Lat/Lon ---
export const geocodeGeoapify = async (text: string): Promise<Coord | null> => {
    try {
        const res = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
            params: { text, apiKey: GEOAPIFY_API_KEY, limit: 1 },
        });
        const f = res.data.features?.[0];
        if (!f) return null;
        return [f.properties.lat, f.properties.lon];
    } catch (err) {
        console.error("geocodeGeoapify error", err);
        return null;
    }
};

// --- Autocomplete: text -> gợi ý danh sách ---
export const autocompleteGeoapify = async (
    text: string,
    signal?: AbortSignal
): Promise<GeoapifyFeature[]> => {
    try {
        const res = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete`, {
            params: { text, apiKey: GEOAPIFY_API_KEY, limit: 5 },
            signal, // ✅ truyền signal vào axios
        });
        return res.data.features.map((f: any) => ({
            formatted: f.properties.formatted,
            lat: f.properties.lat,
            lon: f.properties.lon,
        }));
    } catch (err: any) {
        if (err.name !== "AbortError") console.error("autocompleteGeoapify error", err);
        return [];
    }
};

// --- Lấy địa điểm gần với tọa độ (lat/lon), filter theo phong cách Nhật ---
export const getNearbyJapanesePlaces = async (
    lat: number,
    lon: number,
    radius: number 
): Promise<NearbyPlace[]> => {
    try {
        console.log(`[GeoService] Searching places at Lat: ${lat}, Lon: ${lon}, Radius: ${radius}m`);

        const res = await axios.get(`https://api.geoapify.com/v2/places`, {
            params: {
                categories: "tourism,catering,leisure",
                filter: `circle:${lon},${lat},${radius}`,
                bias: `proximity:${lon},${lat}`,
                limit: 3,
                lang: "ja",
                apiKey: GEOAPIFY_API_KEY,
            },
        });

        console.log("[GeoService] Geoapify raw response features count:", res.data.features ? res.data.features.length : 0);

        return res.data.features.map((f: any) => ({
            id: f.properties.place_id || f.properties.osm_id || f.properties.name,
            name: f.properties.name || "Địa điểm",
            distance: f.properties.distance || 0,
            location: f.properties.address_line1 || f.properties.city || "Gần bạn",
            category: f.properties.categories || "other",
            lat: f.properties.lat,   // thêm vào đây
            lon: f.properties.lon,   // thêm vào đây
        }));
    } catch (err) {
        console.error("[GeoService] getNearbyJapanesePlaces error:", err);
        return [];
    }
};
