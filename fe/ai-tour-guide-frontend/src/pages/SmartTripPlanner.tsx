import React, { useState } from "react";
import backgroundImage from "../assets/SmartTrip.jpg";
import PreferenceSelector from "../components/SmartTripcomp/PreferenceSelector";
import ItineraryCard from "../components/SmartTripcomp/ItineraryCard";


interface FormData {
  destination: string;
  startDate: string;
  days: number;
  budget: number;
  preferences: string[];
  group: string;
  specialRequirements: string;
}

interface ItineraryItem {
  day: number;
  morning: string;
  afternoon: string;
  evening?: string;
  image?: string;
  mapLink?: string;
}

const SmartTripPlanner: React.FC = () => {
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

  // ---- BẮT ĐẦU THAY ĐỔI ---- //
  // Sửa lại hoàn toàn hàm createItinerary để xử lý Stream
  const createItinerary = async () => {
    setIsLoading(true);
    setItinerary(null);

    // Dùng biến local để tích lũy các mẩu stream
    let fullResponse = ""; 

    const preferencesString = formData.preferences.join(", ");
    const prompt = `
     Bạn là một chuyên gia lập kế hoạch du lịch tại Việt Nam... 
     (Toàn bộ nội dung prompt của bạn ở đây)
     ...
     [
       { "day": 1, ... }
     ]
   `;

    try {
      const response = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      // Xử lý lỗi nếu server của bạn trả về lỗi (ví dụ 500)
      if (!response.ok) {
        const errorText = await response.text(); // Đọc lỗi dưới dạng text
        throw new Error(errorText || `Lỗi API: ${response.statusText}`);
      }

      // 1. Lấy stream body từ response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Không thể đọc stream body.");
      }

      // 2. Dùng TextDecoder để chuyển dữ liệu (Uint8Array) về string
      const decoder = new TextDecoder();

      // 3. Lặp để đọc stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Stream đã kết thúc
          break; // Thoát vòng lặp
        }

        // 4. Giải mã mẩu dữ liệu và TÍCH LŨY vào biến fullResponse
        const chunkText = decoder.decode(value);
        fullResponse += chunkText;
      }

      // 5. SAU KHI STREAM KẾT THÚC:
      // Biến fullResponse lúc này chứa chuỗi JSON hoàn chỉnh
      // Chúng ta sẽ parse nó
      try {
        const parsedData = JSON.parse(fullResponse);
        setItinerary(parsedData); // Cập nhật state với JSON đã parse
        setStep(4); // Chuyển sang bước hiển thị kết quả
      } catch (parseError) {
        console.error("Lỗi parse JSON từ stream:", parseError);
        console.error("Dữ liệu thô nhận được:", fullResponse);
        // Ném lỗi này để khối catch bên ngoài bắt được
        throw new Error("Lỗi: AI trả về dữ liệu không đúng định dạng JSON."); 
      }

    } catch (error) {
      // Khối catch này bây giờ sẽ bắt cả lỗi fetch VÀ lỗi parse JSON
      console.error("Lỗi khi tạo lịch trình:", error);
      let errorMessage = "Lỗi không xác định";

      // Khối xử lý lỗi của bạn đã tốt, giữ nguyên nó
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
      setIsLoading(false); // Luôn tắt loading dù thành công hay thất bại
    }
  };
  // ---- KẾT THÚC THAY ĐỔI ---- //


  const inputStyle =
    "w-full border border-rose-200 p-2 rounded bg-rose-50 text-rose-900 placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300";
  const buttonStyle =
    "px-4 py-2 rounded text-white font-semibold transition transform hover:scale-105 active:scale-95";

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="p-6 max-w-xl w-full mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
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
                onChange={(e) => handleChange("group", e.target.value)}
                className={inputStyle}
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

        {/* Step 4 (Không đổi) */}
        {step === 4 && itinerary && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2 text-rose-900">
              Lịch trình của bạn
            </h3>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
              {itinerary.map((day) => (
                <ItineraryCard key={day.day} day={day} />
              ))}
            </div>

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
              className={`${buttonStyle} bg-rose-500 hover:bg-rose-600`}
            >
              Tạo lại lịch trình khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartTripPlanner;