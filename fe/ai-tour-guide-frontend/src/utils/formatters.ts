// utils/formatters.ts
export const formatTime = (seconds: number) => {
  if (!seconds || seconds <= 0) return "0 s";
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  const secs = Math.round(seconds % 60);

  if (hrs > 0) return `${hrs} h ${remMins} m`;
  if (mins > 0) return `${remMins} m ${secs} s`;
  return `${secs} s`;
};

export const formatDistance = (meters: number) => {
  if (!meters || meters <= 0) return "0 m";
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};
