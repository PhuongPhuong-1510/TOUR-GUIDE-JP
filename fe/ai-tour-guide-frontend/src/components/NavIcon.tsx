import React from 'react';

interface NavIconProps {
  Icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const NavIcon: React.FC<NavIconProps> = ({
  Icon,
  label,
  active = false,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center
        w-16 h-16            /* chiều rộng = chiều cao → tròn */
        rounded-full
        transition-all duration-200
        ${active
          ? 'bg-blue-50 text-blue-600 border border-blue-200'
          : 'bg-white text-gray-500 hover:bg-gray-100'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-md
      `}
    >
      <Icon className="w-7 h-7" />
      <span className="text-xs mt-1 font-medium text-center">{label}</span>
    </button>
  );
};

export default NavIcon;
