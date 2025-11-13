import React, { useState } from "react";
import backgroundImage from "../assets/SmartTrip.jpg";
import PreferenceSelector from "../components/SmartTripcomp/PreferenceSelector";

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

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const createItinerary = () => {
    const sampleItinerary: ItineraryItem[] = [];
    for (let i = 1; i <= formData.days; i++) {
      sampleItinerary.push({
        day: i,
        morning: `Tham quan địa điểm nổi bật ở ${formData.destination}`,
        afternoon: `Ăn trưa và khám phá ${formData.preferences.join(", ")}`,
        evening: `Thư giãn buổi tối tại ${formData.group || "khách sạn"}`,
      });
    }
    setItinerary(sampleItinerary);
    setStep(4);
  };

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

        {/* Step 1 */}
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

        {/* Step 2 */}
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


        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-rose-900 font-semibold">
              Ngân sách (VNĐ):
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange("budget", Number(e.target.value))}
                className={inputStyle}
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
              />
            </label>
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className={`${buttonStyle} bg-rose-300 text-rose-900 hover:bg-rose-400`}
              >
                Quay lại
              </button>
              <button
                onClick={createItinerary}
                className={`${buttonStyle} bg-rose-500 hover:bg-rose-600`}
              >
                Tạo lịch trình
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && itinerary && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2 text-rose-900">
              Lịch trình của bạn
            </h3>
            {itinerary.map((day) => (
              <div
                key={day.day}
                className="border border-rose-200 p-2 rounded mb-2 bg-rose-50"
              >
                <h4 className="font-semibold text-rose-800">Ngày {day.day}</h4>
                <p>Buổi sáng: {day.morning}</p>
                <p>Buổi chiều: {day.afternoon}</p>
                {day.evening && <p>Buổi tối: {day.evening}</p>}
              </div>
            ))}
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
