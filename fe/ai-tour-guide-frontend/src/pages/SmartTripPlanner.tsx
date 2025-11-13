import React, { useState } from "react";
import backgroundImage from "../assets/SmartTrip.jpg";
import PreferenceSelector from "../components/SmartTripcomp/PreferenceSelector";
import ItineraryCard from "../components/SmartTripcomp/ItineraryCard";

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

interface ItineraryItem {
  day: number;
  morning: string;
  afternoon: string;
  evening?: string;
  image?: string;
  mapLink?: string;
}


const SmartTripPlanner: React.FC = () => {
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


  // ---- BẮT ĐẦU THAY ĐỔI (Chỉ thay đổi khối 'try...catch' ở mục 5) ---- //
  const createItinerary = async () => {
    setIsLoading(true);
    setItinerary(null);

    let fullResponse = "";

    const preferencesString = formData.preferences.join(", ");
    // ---- BẮT ĐẦU PROMPT TEMPLATE MỚI ---- //
    const prompt = `
**[BẮT BUỘC]**
Bạn là một chuyên gia lập kế hoạch du lịch địa phương siêu chi tiết.
bạn tạo kế hoạc siêu nhanh giúp tôi
**MỤC TIÊU:**
Tạo một kế hoạch du lịch hàng ngày cho một chuyến đi dựa trên các thông tin sau:
* **Thành phố (Điểm đến):** ${formData.destination}
* **Số ngày:** ${formData.days}
* **Ngày bắt đầu (tham khảo mùa):** ${formData.startDate}
* **Nhóm đi:** ${formData.group}
* **Sở thích:** ${preferencesString}
* **Ngân sách (tham khảo):** ${formData.budget} VNĐ
* **Yêu cầu đặc biệt:** ${formData.specialRequirements || "Không có"}

---

**YÊU CẦU ĐỊNH DẠNG JSON (CỰC KỲ QUAN TRỌNG):**

1.  **CHỈ** trả về một mảng JSON (JSON array) hợp lệ.
2.  **KHÔNG** được thêm bất kỳ văn bản giới thiệu nào (như "Đây là lịch trình của bạn:"), không thêm giải thích, không thêm \`\`\`json.
3.  Toàn bộ phản hồi của bạn PHẢI bắt đầu bằng ký tự \`[\` và kết thúc bằng ký tự \`]\`.
4.  Mỗi phần tử trong mảng là một object đại diện cho MỘT NGÀY, và phải tuân theo cấu trúc sau:

    {
      "day": <Số thứ tự ngày, bắt đầu từ 1>,
      "morning": "<Kế hoạch buổi sáng. **Phải bao gồm:** 1 gợi ý quán ăn sáng/cafe VÀ hướng dẫn di chuyển (VD: đi Grab 15 phút, đi bộ 5 phút, tuyến bus số X...).>",
      "afternoon": "<Kế hoạch buổi chiều. **Phải bao gồm:** 1 gợi ý quán ăn trưa VÀ hướng dẫn di chuyển đến địa điểm buổi chiều.>",
      "evening": "<Kế hoạch buổi tối. **Phải bao gồm:** 1 gợi ý quán ăn tối VÀ 1-2 gợi ý khách sạn ở khu vực lân cận (phù hợp với ngân sách).>",
      "image": "<Một URL hình ảnh HỢP LỆ (từ Google, Unsplash, Pexels...) đại diện cho địa điểm nổi bật NHẤT trong ngày.>",
      "mapLink": "<Một URL Google Maps HỢP LỆ trỏ đến địa điểm chính của buổi SÁNG hoặc CHIỀU (VD: https://www.google.com/maps/place/...).>"
    }

**VÍ DỤ VỀ 1 NGÀY TRONG MẢNG (Ví dụ cho Hà Nội):**

    {
      "day": 1,
      "morning": "Thăm Lăng Bác và Chùa Một Cột. Gợi ý ăn sáng: Phở Bát Đàn (cách 10 phút Grab). Di chuyển từ Lăng Bác sang Chùa Một Cột: đi bộ 5 phút.",
      "afternoon": "Khám phá Văn Miếu - Quốc Tử Giám. Gợi ý ăn trưa: Bún chả Hàng Quạt (cách 5 phút Grab). Di chuyển đến Văn Miếu: đi bus tuyến 02 (15 phút).",
      "evening": "Dạo bộ Hồ Gươm và ăn tối tại Phố Cổ. Gợi ý ăn tối: Chả cá Lã Vọng. Gợi ý khách sạn gần đó: Khách sạn Peridot Grand (sang trọng) hoặc Khách sạn Hanoi Pearl (tầm trung).",
      "image": "https://example.com/images/ho_guom.jpg",
      "mapLink": "https://www.google.com/maps/place/Hoan+Kiem+Lake"
    }
    
---
**BẮT ĐẦU TẠO LỊCH TRÌNH (Chỉ trả về JSON Array):**
[
`;
    // ---- KẾT THÚC PROMPT TEMPLATE MỚI ---- //

    try {
      // Phần fetch và đọc stream giữ nguyên
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

      // 5. SAU KHI STREAM KẾT THÚC:
      // ---- BẮT ĐẦU SỬA LỖI JSON ----
      try {
        // Dữ liệu thô (fullResponse) có thể là:
        // "Tuyệt vời! Đây là lịch trình của bạn: \n```json\n[{\"day\": 1, ...}]\n```"

        // 1. Tìm điểm bắt đầu của JSON array (ký tự '[')
        const jsonStart = fullResponse.indexOf('[');

        // 2. Tìm điểm kết thúc của JSON array (ký tự ']')
        // Chúng ta dùng lastIndexOf để tìm ký tự ']' cuối cùng
        const jsonEnd = fullResponse.lastIndexOf(']');

        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
          // Nếu không tìm thấy [ hoặc ], hoặc ] ở trước [
          console.error("Dữ liệu thô nhận được (Không tìm thấy JSON):", fullResponse);
          throw new Error("Không tìm thấy JSON array `[... ]` hợp lệ trong phản hồi.");
        }

        // 3. Cắt chuỗi JSON sạch ra
        const jsonString = fullResponse.substring(jsonStart, jsonEnd + 1);

        // 4. Parse chuỗi đã cắt
        // (Nếu vẫn lỗi ở đây, có thể do chuỗi JSON bị lỗi cú pháp)
        const parsedData = JSON.parse(jsonString);

        setItinerary(parsedData); // Cập nhật state
        setStep(4); // Chuyển sang bước hiển thị

      } catch (parseError) {
        console.error("Lỗi parse JSON từ stream:", parseError);
        // Dòng này CỰC KỲ QUAN TRỌNG:
        // Hãy mở Console (F12) để xem AI đã trả về chính xác cái gì!
        console.error("DỮ LIỆU THÔ NHẬN ĐƯỢC:", fullResponse);

        let errorMsg = "Lỗi: AI trả về dữ liệu không đúng định dạng JSON.";
        if (parseError instanceof Error) {
          errorMsg += " Chi tiết: " + parseError.message;
        }
        throw new Error(errorMsg);
      }
      // ---- KẾT THÚC SỬA LỖI JSON ----

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
  // ---- KẾT THÚC THAY ĐỔI ---- //


  // ... (Phần return JSX không thay đổi) ...
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