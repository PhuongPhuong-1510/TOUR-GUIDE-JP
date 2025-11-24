import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Timeline from '../components/SmartTripcomp/Timeline';
import MapWrapper from '../components/SmartTripcomp/MapWrapper';
import './PlannerView.css';
import { Activity, ItineraryItem } from '../types/smartTrip';

const PlannerView: React.FC = () => {
  const location = useLocation();
  
  // Lấy dữ liệu gốc từ trang trước
  const originalData = location.state?.itineraryData as ItineraryItem[] | null;

  // ✅ BƯỚC 1: TẠO STATE CỤC BỘ
  // Copy dữ liệu gốc vào một state mà chúng ta CÓ THỂ THAY ĐỔI
  const [itineraryData, setItineraryData] = useState<ItineraryItem[] | null>(originalData);
  
  // State "nâng lên" để quản lý ID của hoạt động đang được chọn
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // ✅ BƯỚC 2: TẠO HÀM XÓA HOẠT ĐỘNG
  const handleDeleteActivity = (activityId: string) => {
    
    setItineraryData(prevItinerary => {
      if (!prevItinerary) return null;

      // Dùng .map để tạo ra một mảng 'ngày' mới
      const newItinerary = prevItinerary.map(day => {
        // Lọc (filter) và giữ lại tất cả hoạt động KHÔNG CÓ ID bị xóa
        const newActivities = day.activities.filter(
          activity => activity.id !== activityId
        );

        // Trả về ngày này với danh sách hoạt động đã được cập nhật
        return { ...day, activities: newActivities };
      });

      // Trả về lịch trình mới
      return newItinerary;
    });
  };

  // --- (Phần kiểm tra lỗi và gộp hoạt động giữ nguyên) ---
  if (!itineraryData) {
    return <div>Lỗi: Không tìm thấy dữ liệu lịch trình. Vui lòng quay lại.</div>;
  }
  const allActivities = itineraryData.flatMap(day => day.activities);
  // ---

  return (
    <div className="planner-container">
      <div className="timeline-section">
        <Timeline
          days={itineraryData} // Dùng state cục bộ (có thể thay đổi)
          selectedActivityId={selectedActivityId}
          onActivitySelect={setSelectedActivityId}
          // ✅ BƯỚC 3: TRUYỀN HÀM XUỐNG CHO TIMELINE
          onActivityDelete={handleDeleteActivity} 
        />
      </div>
      
      <div className="map-section">
        <MapWrapper
          activities={allActivities} // Map cũng sẽ tự động cập nhật (vì 'allActivities' được tính toán lại)
          selectedActivityId={selectedActivityId}
          onActivitySelect={setSelectedActivityId}
        />
      </div>
    </div>
  );
};

export default PlannerView;