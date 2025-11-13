import React, { useState } from "react";
import PreferenceSelector from "./PreferenceSelector";

interface StepInputProps {
  step: number;
  formData: any;
  handleChange: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  inputClass?: string;
  buttonClass?: string;
}

const StepInput: React.FC<StepInputProps> = ({
  step,
  formData,
  handleChange,
  nextStep,
  prevStep,
  inputClass = "",
  buttonClass = "",
}) => {
  const [showTip, setShowTip] = useState(false);

  // Step 1
  if (step === 1)
    return (
      <div className="space-y-4">
        <label className="block text-rose-900 font-semibold">
          Địa điểm:
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => {
              handleChange("destination", e.target.value);
              setShowTip(!formData.preferences.length && !!e.target.value);
            }}
            className={inputClass}
            placeholder="Nhập thành phố hoặc địa điểm"
          />
        </label>

        <label className="block text-rose-900 font-semibold">
          Ngày bắt đầu:
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block text-rose-900 font-semibold">
          Số ngày:
          <input
            type="number"
            min={1}
            value={formData.days}
            onChange={(e) => handleChange("days", Number(e.target.value))}
            className={inputClass}
          />
        </label>

        {showTip && <p className="text-rose-700 text-sm">Bạn đi Nhật lần đầu à? Bạn thích đền chùa hay hiện đại?</p>}

        <button onClick={nextStep} className={`${buttonClass} bg-rose-500 hover:bg-rose-600`}>
          Tiếp theo
        </button>
      </div>
    );

  // Step 2
  if (step === 2)
    return (
      <div className="space-y-4">
        <label className="block text-rose-900 font-semibold">
          Nhóm đi:
          <select
            value={formData.group}
            onChange={(e) => handleChange("group", e.target.value)}
            className={inputClass}
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
          <button onClick={prevStep} className={`${buttonClass} bg-rose-300 text-rose-900 hover:bg-rose-400`}>
            Quay lại
          </button>
          <button onClick={nextStep} className={`${buttonClass} bg-rose-500 hover:bg-rose-600`}>
            Tiếp theo
          </button>
        </div>
      </div>
    );

  // Step 3
  if (step === 3)
    return (
      <div className="space-y-4">
        <label className="block text-rose-900 font-semibold">
          Ngân sách (VNĐ):
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => handleChange("budget", Number(e.target.value))}
            className={inputClass}
          />
        </label>

        <label className="block text-rose-900 font-semibold">
          Yêu cầu đặc biệt:
          <input
            type="text"
            value={formData.specialRequirements}
            onChange={(e) => handleChange("specialRequirements", e.target.value)}
            className={inputClass}
          />
        </label>

        <div className="flex justify-between">
          <button onClick={prevStep} className={`${buttonClass} bg-rose-300 text-rose-900 hover:bg-rose-400`}>
            Quay lại
          </button>
          <button onClick={nextStep} className={`${buttonClass} bg-rose-500 hover:bg-rose-600`}>
            Tạo lịch trình
          </button>
        </div>
      </div>
    );

  return null;
};

export default StepInput;
