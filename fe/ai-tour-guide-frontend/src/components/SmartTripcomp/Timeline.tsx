import { Activity, ItineraryItem } from '../../types/smartTrip';
import React from 'react';

interface TimelineProps {
  days: ItineraryItem[];
  selectedActivityId: string | null;
  onActivitySelect: (id: string) => void;
  onActivityDelete: (id: string) => void; 
}

// ✅ BƯỚC 1: NHẬN THÊM 'onActivityDelete' VÀO ĐÂY
const Timeline: React.FC<TimelineProps> = ({ 
  days, 
  selectedActivityId, 
  onActivitySelect, 
  onActivityDelete 
}) => {

  // ✅ BƯỚC 2: TẠO HÀM XỬ LÝ CLICK NÚT XÓA
  const handleDeleteClick = (e: React.MouseEvent, activityId: string) => {
    // Ngăn sự kiện click lan ra (để không bị highlight)
    e.stopPropagation(); 
    
    // Gọi hàm xóa của Cha (PlannerView)
    onActivityDelete(activityId);
  };

  return (
    <div className="timeline">
      {days.map(day => (
        <div key={day.day} className="day-block">
          <h3>Ngày {day.day}: {day.theme_of_the_day}</h3>
          {day.activities.map(activity => (
            <div
              key={activity.id}
              onClick={() => onActivitySelect(activity.id)}
              className={`activity-card ${activity.id === selectedActivityId ? 'selected' : ''}`}
            >
              {/* ✅ BƯỚC 3: THÊM NÚT XÓA VÀO JSX */}
              <button 
                className="delete-button" 
                onClick={(e) => handleDeleteClick(e, activity.id)}
              >
                X
              </button>

              <strong>{activity.time}</strong>: {activity.activity_name} ({activity.type})
              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Timeline;