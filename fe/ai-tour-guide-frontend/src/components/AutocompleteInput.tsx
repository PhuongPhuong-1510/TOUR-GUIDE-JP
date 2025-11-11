// AutocompleteInput.tsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { GeoapifyFeature, autocompleteGeoapify } from "../services/geocodeService";

// Icon tìm kiếm
interface SearchIconProps {
  className: string;
}

const SearchIcon = ({ className }: SearchIconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (feature: GeoapifyFeature) => void;
  placeholder?: string;
  disabled?: boolean;
  locked?: boolean;
  className?: string;
  showSearchButton?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
  locked,
  showSearchButton,
}) => {
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const didMountRef = useRef(false);
  const fetchingRef = useRef(false); // lock khi đang fetch
  const controllerRef = useRef<AbortController | null>(null);

  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const updateCoords = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };
// thêm biến hasSelected này để biieets người dùng click vào popup chưa
const [hasSelected, setHasSelected] = useState(false);

  // Cập nhật tọa độ khi scroll/resize
  useEffect(() => {
    updateCoords();
    window.addEventListener("scroll", updateCoords);
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("scroll", updateCoords);
      window.removeEventListener("resize", updateCoords);
    };
  }, []);

  // Hàm gọi API autocomplete với debounce và AbortController
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
      if (hasSelected) return; // <-- nếu đã chọn thì không gọi API

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || locked) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    debounceRef.current = setTimeout(async () => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      try {
        const results = await autocompleteGeoapify(value, signal);
        setSuggestions(results);
      } catch (e: any) {
        if (e.name !== "AbortError") console.error("Autocomplete error", e);
        setSuggestions([]);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
        updateCoords();
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      controller.abort();
    };
  }, [value, locked]);

  // Hàm xử lý click chọn gợi ý
  const handleSelect = (feature: GeoapifyFeature) => {
    // Hủy fetch nếu đang fetch
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
      setHasSelected(true); // <-- đánh dấu đã chọn

    fetchingRef.current = false;
    setLoading(false);

    // Xóa suggestions và set giá trị input
    setSuggestions([]);
    onSelect(feature);
  };
// Khi người dùng gõ lại input, reset hasSelected
const handleInputChange = (val: string) => {
  setHasSelected(false);
  onChange(val);
};
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center w-full bg-white rounded-full shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-pink-300/40">
        <div className="absolute left-4 text-gray-400">
          <SearchIcon className="w-5 h-5" />
        </div>

        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder || "Tìm kiếm địa điểm"}
            disabled={disabled}
            className="w-full py-3 pl-12 pr-16 text-black bg-transparent placeholder-gray-500 rounded-full focus:outline-none"
            />
        {showSearchButton && (
          <button
            className="absolute right-1 flex items-center justify-center h-10 w-10 text-white rounded-full hover:bg-red-600 transition duration-150"
            style={{ backgroundColor: "#f05f6f" }}
            aria-label="Tìm kiếm"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Gợi ý autocomplete */}
      {suggestions.length > 0 &&
        createPortal(
          <ul
            style={{ top: coords.top + 5, left: coords.left, width: coords.width }}
            className="fixed bg-gray-100 border border-gray-300 shadow-lg z-[9999] max-h-60 overflow-y-auto rounded-md"
          >
            {suggestions.map((item, idx) => (
              <li
                key={item.formatted + idx}
                onClick={() => handleSelect(item)}
                className="px-4 py-3 cursor-pointer hover:bg-gray-300 text-gray-900 border-b border-gray-200 last:border-b-0"
              >
                {item.formatted}
              </li>
            ))}
          </ul>,
          document.body
        )}

      {loading && (
        <div className="absolute top-full left-0 mt-1 text-xs text-gray-500">Đang tải...</div>
      )}
    </div>
  );
};

export default React.memo(AutocompleteInput);
