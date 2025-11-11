// src/components/ui/NavComponents.jsx

import React from 'react';

// Định nghĩa props để đảm bảo tính Type Safety (nếu bạn dùng TypeScript)
// Nếu dùng JavaScript, bỏ interface
/**
 * @typedef {object} NavIconProps
 * @property {React.ElementType} Icon
 * @property {string} label
 * @property {boolean} [active=false]
 */

/**
 * Icon dùng cho thanh điều hướng phương tiện
 * @param {NavIconProps} props
 */
export const NavIcon = ({ Icon, label, active = false }) => (
  <button
    className={`flex flex-col items-center p-2 rounded-full transition-colors ${
      active
        ? 'text-blue-600 bg-blue-50 border border-blue-200'
        : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs mt-1 font-medium">{label}</span>
  </button>
);

/**
 * Icon dùng cho thanh điều hướng footer.
 * @param {NavIconProps} props
 */
export const FooterIcon = ({ Icon, label, active = false }) => (
  <button
    className={`flex flex-col items-center py-1 transition-colors ${
      active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs mt-1">{label}</span>
  </button>
);