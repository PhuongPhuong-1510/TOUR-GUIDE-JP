// src/components/MenuCard.tsx
import React from "react";
import { LucideProps } from "lucide-react";

interface MenuCardProps {
  title: string;
  subtitle?: string; // Thêm prop cho dòng chữ thứ 2 (nếu có)
  icon?: React.ElementType;
  color?: string; // Giữ lại để có thể custom nếu muốn
  onClick?: () => void; // Thêm prop onClick optional
}

const MenuCard: React.FC<MenuCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  color,
  onClick,
}) => {
  // Style mặc định mô phỏng theo ảnh: nền hồng nhạt, mờ, chữ màu sẫm
  const defaultStyle =
    "bg-rose-50/60 backdrop-blur-sm text-rose-900 hover:bg-rose-50/80";

  return (
    <div
      className={`
        flex flex-col items-center justify-center 
        p-3 rounded-2xl shadow-lg h-24 text-center cursor-pointer 
        transition duration-200 transform hover:scale-105 active:scale-95
        ${color || defaultStyle}
      `}
       onClick={onClick} // Gắn onClick vào div
    >
      {/* Icon (có thể điều chỉnh kích thước) */}
      {Icon && <Icon className="w-7 h-7 mb-1" />}

      {/* Dòng tiêu đề chính */}
      <p className="text-sm font-semibold leading-tight">{title}</p>

      {/* Dòng tiêu đề phụ (nếu có) */}
      {subtitle && (
        <p className="text-xs font-semibold leading-tight">{subtitle}</p>
      )}
    </div>
  );
};

export default MenuCard;