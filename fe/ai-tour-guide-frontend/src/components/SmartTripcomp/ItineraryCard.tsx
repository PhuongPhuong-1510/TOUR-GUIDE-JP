import React from "react";

interface ItineraryItem {
  day: number;
  morning: string;
  afternoon: string;
  evening?: string;
  image?: string;
  mapLink?: string;
}

const ItineraryCard: React.FC<{ day: ItineraryItem }> = ({ day }) => (
  <div className="bg-white/90 backdrop-blur-md border border-rose-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
    <h4 className="text-lg font-bold text-rose-700 mb-2">Ngày {day.day}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <p><strong>🌅 Sáng:</strong> {day.morning}</p>
        <p><strong>🌞 Chiều:</strong> {day.afternoon}</p>
        {day.evening && <p><strong>🌙 Tối:</strong> {day.evening}</p>}
      </div>
      <div className="flex flex-col items-center gap-2">
        {day.image && <img src={day.image} alt="ảnh minh họa" className="rounded-lg shadow" />}
        {day.mapLink && (
          <a href={day.mapLink} target="_blank" rel="noopener noreferrer"
             className="text-sm text-rose-600 underline hover:text-rose-800">
            Xem trên Google Maps 📍
          </a>
        )}
      </div>
    </div>
  </div>
);

export default ItineraryCard;
