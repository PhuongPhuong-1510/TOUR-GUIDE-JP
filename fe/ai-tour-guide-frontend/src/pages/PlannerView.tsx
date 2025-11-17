import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Timeline from '../components/SmartTripcomp/Timeline';      // <--- ĐÚNG
import MapWrapper from '../components/SmartTripcomp/MapWrapper';  // <--- ĐÚNG // Component con sắp tạo
import './PlannerView.css';        // File CSS để chia layout
import { Activity, ItineraryItem } from '../types/smartTrip';

const PlannerView: React.FC = () => {
  const location = useLocation();
  
  // Nhận dữ liệu được gửi qua từ trang SmartTripPlanner
  const itineraryData = location.state?.itineraryData as ItineraryItem[] | null;

  // State "nâng lên" để quản lý ID của hoạt động đang được chọn
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  if (!itineraryData) {
    return <div>Lỗi: Không tìm thấy dữ liệu lịch trình. Vui lòng quay lại.</div>;
  }

  // Gộp tất cả hoạt động từ tất cả các ngày để đưa cho bản đồ
  const allActivities = itineraryData.flatMap(day => day.activities);

  return (
    <div className="planner-container">
      <div className="timeline-section">
        <Timeline
          days={itineraryData}
          selectedActivityId={selectedActivityId}
          onActivitySelect={setSelectedActivityId} // Truyền hàm set state
        />
      </div>
      
      <div className="map-section">
        <MapWrapper
          activities={allActivities}
          selectedActivityId={selectedActivityId}
          onActivitySelect={setSelectedActivityId} // Truyền hàm set state
        />
      </div>
    </div>
  );
};

export default PlannerView;