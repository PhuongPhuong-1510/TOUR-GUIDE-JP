import { Activity, ItineraryItem } from '../../types/smartTrip'; // (Lưu ý: 2 dấu ..)
import React from 'react';
// (Import interface Activity và ItineraryItem)

interface TimelineProps {
  days: ItineraryItem[];
  selectedActivityId: string | null;
  onActivitySelect: (id: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ days, selectedActivityId, onActivitySelect }) => {
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