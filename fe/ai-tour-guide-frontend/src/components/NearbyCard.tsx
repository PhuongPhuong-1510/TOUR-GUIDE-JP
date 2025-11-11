import React from "react";

// **********************************************************
// === 1. SVG Icon Định Vị (Map Pin) ===
// **********************************************************
export const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-map-pin"
  >
    <path d="M20 10c0 6-8 10-8 10s-8-4-8-10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// **********************************************************
// === 2. SVG Icon Mũi Tên Phải (Chevron) ===
// **********************************************************
export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// **********************************************************
// === 3. Props của NearbyCard ===
// **********************************************************
export type NearbyCardProps = {
  name: string;
  distance: string;
  location: string;
  icon: string | React.ReactNode;
  id: string | number;
  lat?: number;
  lon?: number;
};

// **********************************************************
// === 4. Component NearbyCard - ĐÃ CÓ HIỆU ỨNG HOVER MỚI ===
// **********************************************************
export const NearbyCard: React.FC<NearbyCardProps & { onClick?: () => void }> = ({
  name,
  distance,
  // location, // Các props này được giữ lại trong type nhưng không dùng trong component
  // icon,     // Các props này được giữ lại trong type nhưng không dùng trong component
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-4 bg-white/70 p-4 rounded-2xl 
        shadow-md backdrop-blur-sm 
        
        /* Transition mượt mà cho các hiệu ứng hover */
        transition duration-300 ease-in-out
        
        /* Hiệu ứng to ra và nổi lên khi hover */
        hover:bg-white/90 
        hover:scale-[1.03] 
        hover:shadow-xl 
        relative 
        hover:z-10
        
        /* Hiệu ứng active khi nhấn */
        active:scale-[0.98] cursor-pointer
      "
    >
      {/* 1. Icon vòng tròn bên trái (Map Pin) */}
      <div
        className="
          w-10 h-10 flex items-center justify-center rounded-full 
          bg-black/10 flex-shrink-0
        "
      >
        {/* Luôn dùng MapPinIcon màu tối */}
        <MapPinIcon className="w-5 h-5 text-gray-700" />
      </div>

      {/* 2. Tên và Khoảng cách */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-base truncate" title={name}>
          {name}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-0.5">
          {/* Icon ghim nhỏ cho khoảng cách */}
          <MapPinIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span className="truncate">{distance}</span>
        </p>
      </div>

      {/* 3. Icon mũi tên bên phải */}
      <div className="flex-shrink-0">
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};