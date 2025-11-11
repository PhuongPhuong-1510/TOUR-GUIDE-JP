import React from "react";
import { createPortal } from "react-dom";
import { AutocompletePopupProps } from "./types";

export const AutocompletePopup: React.FC<AutocompletePopupProps> = ({
  suggestions,
  handleSelect,
  coords,
}) => {
  if (suggestions.length === 0) return null;

  return createPortal(
    <ul
      style={{ top: coords.top + 5, left: coords.left, width: coords.width }}
      className="
        fixed 
        
        /* Nền trắng trong đục */
        bg-white/80 
        backdrop-blur-sm 
        
        /* Bo tròn rõ ràng hơn */
        rounded-xl 
        
        /* Bóng đổ nổi bật hơn */
        shadow-xl 
        
        z-[9999] 
        max-h-60 
        overflow-y-auto 
        
      "
    >
      {suggestions.map((item, idx) => (
        <li
          key={item.formatted + idx}
          onClick={() => handleSelect(item)}
          className="
            px-4 py-3 
            cursor-pointer 
            text-gray-900 
            
            /* Border dưới màu nhẹ nhàng hơn */
            border-b border-gray-200/50 last:border-b-0
            
            /* Hiệu ứng hơi hồng khi hover */
           
            hover:font-semibold
            
            /* Bo tròn từng mục nếu muốn */
            /* rounded-lg */ 
            
            /* Transition cho từng mục */
            transition-colors duration-150 ease-in-out
          "
        >
          {item.formatted}
        </li>
      ))}
    </ul>,
    document.body
  );
};