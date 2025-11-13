import React from "react";

interface PreferenceSelectorProps {
  selected: string[];
  onChange: (newList: string[]) => void;
}

const options = ["Ẩm thực", "Văn hóa", "Thiên nhiên", "Mua sắm", "Anime", "Lễ hội"];

const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({ selected, onChange }) => {
  const toggle = (pref: string) => {
    const exists = selected.includes(pref);
    onChange(
      exists ? selected.filter((p) => p !== pref) : [...selected, pref]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((pref) => (
        <button
          key={pref}
          onClick={() => toggle(pref)}
          className={`px-4 py-2 rounded-full border transition-all duration-200
            ${
              selected.includes(pref)
                ? "bg-rose-500 text-white border-rose-500 scale-105"
                : "bg-white text-rose-700 border-rose-300 hover:bg-rose-50"
            }`}
        >
          {pref}
        </button>
      ))}
    </div>
  );
};

export default PreferenceSelector;
