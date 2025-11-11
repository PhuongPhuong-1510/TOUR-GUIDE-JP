import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";


interface IconProps { className: string; }

const HomeIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0
        a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChatIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8
        a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.111A9.558 9.558 0 013 12
        c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const BellIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11
        a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11
        v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14
        a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CogIcon = ({ className }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0
        a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.82 2.37 2.37
        a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35
        a1.724 1.724 0 00-1.066 2.573c.94 1.543-.82 3.31-2.37 2.37
        a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0
        a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.82-2.37-2.37
        a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35
        a1.724 1.724 0 001.066-2.573c-.94-1.543.82-3.31 2.37-2.37
        .996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface NavButtonProps {
  IconComponent: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ IconComponent, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 p-2 rounded-lg text-gray-700 hover:text-pink-500 hover:bg-black/5 transition duration-200 ease-in-out"
    aria-label={label}
  >
    <IconComponent className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

interface HeaderProps {
  onChatClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChatClick }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4">
      {/* --- Khối trái: Logo + tên --- */}
      {/* --- Khối trái: Logo + tên --- */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-gray-900">AI</span>
          <span className="text-lg font-medium text-gray-900">ツアーガイド JP</span>
        </div>
      </div>


      {/* --- Khối phải: 5 nút menu --- */}
      <div className="flex items-center gap-4 text-sm">
        <NavButton IconComponent={HomeIcon} label="Trang chủ" onClick={() => navigate("/")} />
        <NavButton IconComponent={ChatIcon} label="Chat AI" onClick={onChatClick} />
        <NavButton IconComponent={BellIcon} label="Thông báo" />
        <NavButton IconComponent={UserIcon} label="Tài khoản" />
        <NavButton IconComponent={CogIcon} label="Cài đặt" />
      </div>
    </header>
  );
};

export default Header;
