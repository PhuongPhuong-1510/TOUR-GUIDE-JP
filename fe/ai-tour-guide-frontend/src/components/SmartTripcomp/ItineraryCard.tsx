import React from 'react';

// --- QUAN TRỌNG: 
// Định nghĩa lại interface MỚI ở đây để component này hiểu
// (Hoặc tốt hơn là export chúng từ file SmartTripPlanner.tsx và import vào đây)
// ---

interface Activity {
  id: string;
  time: string;
  activity_name: string;
  description: string;
  type: 'sightseeing' | 'food' | 'transport' | 'shopping' | 'other';
  location_name: string;
  location_coords: {
    lat: number;
    lng: number;
  };
  estimated_duration_minutes: number;
}

interface ItineraryItem {
  day: number;
  theme_of_the_day: string;
  activities: Activity[];
  image?: string;
}

// --- Hết phần Interface ---


interface ItineraryCardProps {
  day: ItineraryItem;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ day }) => {
  // Giao diện này chỉ dùng để hiển thị tóm tắt ở Step 4
  // Nó không cần tương tác (chỉ là bản xem trước)
  return (
    <div className="border border-rose-200 p-4 rounded-lg bg-white shadow-sm">
      <h4 className="text-lg font-semibold text-rose-800">
        Ngày {day.day}: {day.theme_of_the_day}
      </h4>

      {/* Hiển thị ảnh (nếu có) */}
      {day.image && (
        <img 
          src={day.image} 
          alt={day.theme_of_the_day} 
          className="w-full h-32 object-cover rounded-md my-2" 
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} // Ẩn nếu link ảnh lỗi
        />
      )}

      {/* Hiển thị tóm tắt các hoạt động thay vì morning/afternoon */}
      <p className="text-sm text-rose-700 mt-2">
        Bao gồm {day.activities.length} hoạt động:
      </p>
      <ul className="list-disc list-inside text-sm text-rose-600 space-y-1 pl-2">
        {day.activities.slice(0, 3).map((activity) => ( // Chỉ hiện 3 hoạt động đầu
          <li key={activity.id}>
            {activity.time} - {activity.activity_name} ({activity.type})
          </li>
        ))}
        {day.activities.length > 3 && <li>... và nhiều hơn nữa.</li>}
      </ul>
    </div>
  );
};

export default ItineraryCard;