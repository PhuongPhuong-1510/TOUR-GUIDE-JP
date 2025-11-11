// services/routeService.ts
export type Coord = [number, number];

export type ORSProfile = "driving-car" | "cycling-regular" | "foot-walking";

const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY || "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImRlMzhhNjI5ZmFlODQyOTc5NDgwMmM5N2E1MGU4NDI4IiwiaCI6Im11cm11cjY0In0=";

export async function getRouteORS(
  start: Coord,
  end: Coord,
  profile: ORSProfile
) {
  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;

  const body = {
    coordinates: [
      [start[1], start[0]], // ORS expects [lon, lat]
      [end[1], end[0]],
    ],
    instructions: true,
    language: 'vi', // ✅ phải ở ngoài mảng
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: ORS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`ORS error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  if (!data || !data.features || data.features.length === 0) return null;
  return data.features[0];
}