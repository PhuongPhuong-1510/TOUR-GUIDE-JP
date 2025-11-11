import React from "react";
import { GeoapifyFeature } from "../services/geocodeService";
import AutocompleteInput from "./AutocompleteInput";

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

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (feature: GeoapifyFeature) => void;
  placeholder?: string;
  disabled?: boolean;
    showSearchButton?: boolean; // thêm dòng này

}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
  showSearchButton = true, // thêm dòng này để destructure prop + default true
}) => {
  return (
    <div className="flex justify-center mt-6 mb-8 px-4">
      <div className="relative flex items-center w-full max-w-xl bg-white rounded-full shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-pink-300/40">
        {/* Icon kính lúp bên trái */}
        <div className="absolute left-4 text-gray-400">
          <SearchIcon className="w-5 h-5" />
        </div>

        {/* AutocompleteInput */}
        <AutocompleteInput
          value={value}
          onChange={onChange}
          onSelect={onSelect}
          placeholder={placeholder || "Tìm kiếm địa điểm"}
          disabled={disabled}
          className="w-full text-gray-900 placeholder-gray-500 py-2 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-300 outline-none transition bg-white"
          showSearchButton={showSearchButton} // giờ đã có biến
        />

        {/* Nút search bên phải */}
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
    </div>
  );
};

export default SearchBar;
