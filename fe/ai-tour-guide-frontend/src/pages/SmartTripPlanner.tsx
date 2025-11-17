import React, { useState } from "react";
import backgroundImage from "../assets/SmartTrip.jpg";
import PreferenceSelector from "../components/SmartTripcomp/PreferenceSelector";
import ItineraryCard from "../components/SmartTripcomp/ItineraryCard";
import { useNavigate } from 'react-router-dom';

// ... (phần interface FormData và ItineraryItem giữ nguyên) ...
interface FormData {
  destination: string;
  startDate: string;
  days: number;
  budget: number;
  preferences: string[];
  group: string;
  specialRequirements: string;
}

// Định nghĩa một Hoạt động (có tọa độ)
interface Activity {
  id: string; // Thêm ID duy nhất (ví dụ: dùng uuid hoặc AI tự tạo)
  time: string; // VD: "09:00"
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

// Cập nhật ItineraryItem để chứa mảng các hoạt động
interface ItineraryItem {
  day: number;
  theme_of_the_day: string;
  activities: Activity[]; // <--- THAY ĐỔI QUAN TRỌNG NHẤT
  image?: string; // Giữ lại ảnh đại diện cho ngày
}

// Cập nhật state để dùng interface mới
// const [itinerary, setItinerary] = useState<ItineraryItem[] | null>(null);

const SmartTripPlanner: React.FC = () => {
  const navigate = useNavigate();
  // ... (phần state và các hàm khác giữ nguyên) ...
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    destination: "",
    startDate: "",
    days: 1,
    budget: 0,
    preferences: [],
    group: "",
    specialRequirements: "",
  });
  const [itinerary, setItinerary] = useState<ItineraryItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Logic tạo lịch trình (Giữ nguyên như code cũ của bạn)
  const createItinerary = async () => {
    setIsLoading(true);
    setItinerary(null);

    let fullResponse = "";
    const preferencesString = formData.preferences.join(", ");

    const prompt = `
**[BẮT BUỘC]**
Bạn là một chuyên gia lập kế hoạch du lịch địa phương siêu chi tiết.

**MỤC TIÊU:**
Tạo một kế hoạch du lịch hàng ngày cho một chuyến đi dựa trên các thông tin sau:
* **Thành phố (Điểm đến):** ${formData.destination}
* **Số ngày:** ${formData.days}
* **Ngày bắt đầu (tham khảo mùa):** ${formData.startDate}
* **Nhóm đi:** ${formData.group}
* **Sở thích:** ${preferencesString}
* **Ngân sách (tham khảo):** ${formData.budget} VNĐ
* **Yêu cầu đặc biệt:** ${formData.specialRequirements || 'Không có'}

---

**Yêu CẦU ĐỊNH DẠNG JSON (CỰC KỲ QUAN TRỌNG):**

1.  **CHỈ** trả về một mảng JSON (JSON array) hợp lệ.
2.  **KHÔNG** được thêm bất kỳ văn bản giới thiệu nào (như "Đây là lịch trình của bạn:"), không thêm giải thích, không thêm \`\`\`json.
3.  Toàn bộ phản hồi của bạn PHẢI bắt đầu bằng ký tự \`[\` và kết thúc bằng ký tự \`]\`.
4.  Mỗi phần tử trong mảng là một object đại diện cho MỘT NGÀY:

    {
      "day": <Số thứ tự ngày>,
      "theme_of_the_day": "<Chủ đề của ngày (VD: Khám phá Phố Cổ)>",
      "image": "<Một URL hình ảnh HỢP LỆ (từ Google, Unsplash...) đại diện cho ngày đó>",
      "activities": [
        // Đây là một mảng chứa các hoạt động
        {
          "id": "<Một ID chuỗi ngẫu nhiên duy nhất (VD: 'act-123')>",
          "time": "<Thời gian (VD: '09:00')>",
          "activity_name": "<Tên hoạt động (VD: 'Ăn sáng Phở Bát Đàn')>",
          "description": "<Mô tả ngắn gọn (VD: 'Thưởng thức phở gia truyền nổi tiếng.')>",
          "type": "<Một trong các loại: 'sightseeing', 'food', 'transport', 'shopping', 'other'>",
          "location_name": "<Tên địa điểm (VD: 'Phở Bát Đàn')>",
          "location_coords": { 
            "lat": <kinh độ (VD: 21.033)>, 
            "lng": <vĩ độ (VD: 105.843)> 
          },
          "estimated_duration_minutes": <Số phút ước tính (VD: 60)>
        },
        {
          "id": "<act-124>",
          "time": "<10:30>",
          "activity_name": "<Tham quan Văn Miếu - Quốc Tử Giám>",
          "description": "<Trường đại học đầu tiên của Việt Nam.>",
          "type": "sightseeing",
          "location_name": "Văn Miếu - Quốc Tử Giám",
          "location_coords": { "lat": 21.029, "lng": 105.837 },
          "estimated_duration_minutes": 120
        },
        // ... (thêm các hoạt động khác cho ngày)
      ]
    }

**VÍ DỤ VỀ 1 NGÀY TRONG MẢNG (Ví dụ cho Hà Nội):**

    {
      "day": 1,
      "theme_of_the_day": "Hồn cốt ngàn năm",
      "image": "https://example.com/images/van_mieu.jpg",
      "activities": [
        {
          "id": "act-001",
          "time": "08:30",
          "activity_name": "Ăn sáng Bún chả Hàng Quạt",
          "description": "Bắt đầu ngày mới với bún chả que tre truyền thống.",
          "type": "food",
          "location_name": "Bún chả Hàng Quạt",
          "location_coords": { "lat": 21.031, "lng": 105.847 },
          "estimated_duration_minutes": 45
        },
        {
          "id": "act-002",
          "time": "09:30",
          "activity_name": "Tham quan Văn Miếu - Quốc Tử Giám",
          "description": "Di chuyển bằng Grab (10 phút) đến Văn Miếu.",
          "type": "sightseeing",
          "location_name": "Văn Miếu - Quốc Tử Giám",
          "location_coords": { "lat": 21.029, "lng": 105.837 },
          "estimated_duration_minutes": 120
        }
      ]
    }
    
---
**BẮT ĐẦU TẠO LỊCH TRÌNH (Chỉ trả về JSON Array):**
[
`;

    try {
      const response = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Lỗi API: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Không thể đọc stream body.");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunkText = decoder.decode(value);
        fullResponse += chunkText;
      }

      try {
        const jsonStart = fullResponse.indexOf('[');
        const jsonEnd = fullResponse.lastIndexOf(']');

        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
          console.error("Dữ liệu thô nhận được:", fullResponse);
          throw new Error("Không tìm thấy JSON array `[... ]` hợp lệ trong phản hồi.");
        }

        const jsonString = fullResponse.substring(jsonStart, jsonEnd + 1);
        const parsedData = JSON.parse(jsonString);

        setItinerary(parsedData);
        setStep(4);
      } catch (parseError) {
        console.error("Lỗi parse JSON từ stream:", parseError);
        console.error("DỮ LIỆU THÔ NHẬN ĐƯỢC:", fullResponse);

        let errorMsg = "Lỗi: AI trả về dữ liệu không đúng định dạng JSON.";
        if (parseError instanceof Error) {
          errorMsg += " Chi tiết: " + parseError.message;
        }
        throw new Error(errorMsg);
      }

    } catch (error) {
      console.error("Lỗi khi tạo lịch trình:", error);
      let errorMessage = "Lỗi không xác định";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as any).message);
      } else {
        errorMessage = String(error);
      }

      alert("Đã xảy ra lỗi khi tạo lịch trình. Vui lòng thử lại.\n(Chi tiết: " + errorMessage + ")");

    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi bấm nút Xem chi tiết (Placeholder)
  const handleViewDetails = () => {
    if (itinerary) {
      // Chuyển sang trang mới và mang theo dữ liệu 'itinerary'
      navigate('/planner-details', { state: { itineraryData: itinerary } });
    } else {
      alert("Lỗi: Không có dữ liệu lịch trình để hiển thị.");
    }
  };

  const inputStyle =
    "w-full border border-rose-200 p-2 rounded bg-rose-50 text-rose-900 placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300";
  const buttonStyle =
    "px-4 py-2 rounded text-white font-semibold transition transform hover:scale-105 active:scale-95";

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* THAY ĐỔI Ở ĐÂY: 
          Sử dụng toán tử ba ngôi để đổi class chiều rộng.
          Nếu step === 4 thì dùng max-w-4xl (hoặc 5xl, 6xl tùy bạn), ngược lại dùng max-w-xl 
          Thêm transition-all duration-500 để hiệu ứng mượt mà.
      */}
      <div
        className={`
            p-6 w-full mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg transition-all duration-500 ease-in-out
            ${step === 4 ? 'max-w-5xl' : 'max-w-xl'}
        `}
      >
        <h2 className="text-2xl font-semibold mb-4 text-rose-900">
          Lịch trình thông minh
        </h2>

        {/* Step 1 (Không đổi) */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-rose-900 font-semibold">
              Địa điểm:
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => handleChange("destination", e.target.value)}
                className={inputStyle}
                placeholder="Nhập thành phố hoặc địa điểm"
              />
            </label>
            <label className="block text-rose-900 font-semibold">
              Ngày bắt đầu:
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className={inputStyle}
              />
            </label>
            <label className="block text-rose-900 font-semibold">
              Số ngày:
              <input
                type="number"
                min={1}
                value={formData.days}
                onChange={(e) => handleChange("days", Number(e.target.value))}
                className={inputStyle}
              />
            </label>
            <button
              onClick={nextStep}
              className={`${buttonStyle} bg-rose-500 hover:bg-rose-600`}
            >
              Tiếp theo
            </button>
          </div>
        )}

        {/* Step 2 (Không đổi) */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-rose-900 font-semibold">
              Nhóm đi:
              <select
                value={formData.group}
                onChange={(e) => handleChange("group", e.target.value)} className={inputStyle}
              >
                <option value="">Chọn nhóm</option>
                <option value="1 người">1 người</option>
                <option value="Cặp đôi">Cặp đôi</option>
                <option value="Gia đình">Gia đình</option>
                <option value="Nhóm bạn">Nhóm bạn</option>
              </select>
            </label>

            <h3 className="text-rose-900 font-semibold">Sở thích:</h3>
            <PreferenceSelector
              selected={formData.preferences}
              onChange={(newList) => handleChange("preferences", newList)}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-rose-300 text-rose-900 hover:bg-rose-400`}
              >
                Quay lại
              </button>
              <button
                onClick={nextStep}
                className={`${buttonStyle} bg-rose-500 hover:bg-rose-600`}
              >
                Tiếp theo
              </button>
            </div>
          </div>
        )}


        {/* Step 3 (Không đổi) */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-rose-900 font-semibold">
              Ngân sách (VNĐ):
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange("budget", Number(e.target.value))}
                className={inputStyle}
                disabled={isLoading}
              />
            </label>
            <label className="block text-rose-900 font-semibold">
              Yêu cầu đặc biệt:
              <input
                type="text"
                value={formData.specialRequirements}
                onChange={(e) =>
                  handleChange("specialRequirements", e.target.value)
                }
                className={inputStyle}
                disabled={isLoading}
              />
            </label>

            {isLoading && (
              <div className="text-center text-rose-700 font-semibold p-3 bg-rose-100 rounded-lg">
                🧠 AI đang lên kế hoạch, vui lòng chờ trong giây lát...
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-rose-300 text-rose-900 hover:bg-rose-400`}
                disabled={isLoading}
              >
                Quay lại
              </button>
              <button
                onClick={createItinerary}
                className={`${buttonStyle} ${isLoading ? "bg-rose-300 cursor-not-allowed" : "bg-rose-500 hover:bg-rose-600"
                  }`}
                disabled={isLoading}
              >
                {isLoading ? "Đang tạo..." : "Tạo lịch trình"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 (Có thay đổi nút bấm) */}
        {step === 4 && itinerary && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2 text-rose-900">
              Lịch trình của bạn
            </h3>

            {/* Phần hiển thị ItineraryCard có thể cần grid nếu màn hình rộng hơn, 
                nhưng để giữ nguyên logic cũ ta cứ để list dọc */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {itinerary.map((day) => (
                <ItineraryCard key={day.day} day={day} />
              ))}
            </div>

            {/* THAY ĐỔI Ở ĐÂY: Khu vực nút bấm */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => {
                  setFormData({
                    destination: "",
                    startDate: "",
                    days: 1,
                    budget: 0,
                    preferences: [],
                    group: "",
                    specialRequirements: "",
                  });
                  setItinerary(null);
                  setStep(1);
                }}
                className={`${buttonStyle} bg-rose-500 hover:bg-rose-600 flex-1`}
              >
                Tạo lại lịch trình khác
              </button>

              {/* Nút mới: Xem chi tiết */}
              <button
                onClick={handleViewDetails}
                className={`${buttonStyle} bg-rose-500 hover:bg-rose-600 flex-1`}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartTripPlanner;