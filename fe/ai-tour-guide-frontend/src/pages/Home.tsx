import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { NearbyCard } from "../components/NearbyCard";
import MainMenu from "../components/MainMenu";
import ChatPopup from "../components/ChatPopup";
import Snowfall from "react-snowfall";

import backgroundImage from "../assets/background1.jpg";
import chatbotImage from "../assets/chatbot.png";

import { GeoapifyFeature } from "../services/geocodeService";
import { useNearbyPlaces } from "../hooks/useNearbyPlaces";
import { NearbyCardProps } from "../types/places";

const Home: React.FC = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const { nearbyData, currentPosition, isLoading } = useNearbyPlaces();

  // --- Handlers ---
  const handleNavigateToMap = (endLat?: number, endLon?: number) => {
    if (!currentPosition) return;
    const startLat = currentPosition.lat;
    const startLon = currentPosition.lon;
    navigate("/map", {
      state: {
        startLat,
        startLon,
        endLat: endLat || startLat,
        endLon: endLon || startLon,
      },
    });
  };

  const handleSearchSelect = (feature: GeoapifyFeature) => {
    handleNavigateToMap(feature.lat, feature.lon);
  };

  const handleCardClick = (item: NearbyCardProps) => {
    handleNavigateToMap(item.lat, item.lon);
  };

  // --- Render ---
  return (
    <div
      className="
        min-h-screen bg-cover bg-center bg-no-repeat text-white m-0 p-20 pb-20 relative
        flex items-center justify-center  /* <-- THAY ĐỔI: Căn giữa panel */
      "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Snowfall color="white" snowflakeCount={100} style={{ zIndex: 10 }} />

      {/* =================================================================== */}
      {/* ===== 💎 PANEL KÍNH MỜ MỚI BAO BỌC NỘI DUNG CHÍNH 💎 ===== */}
      {/* =================================================================== */}
      <div
        className="
          relative z-20 w-full max-w-5xl bg-white/60 backdrop-blur-md 
          rounded-3xl shadow-xl p-5 sm:p-6
          flex flex-col gap-5   /* <-- Tạo khoảng cách giữa các mục */
        "
      >
        {/* --- 1. Header --- */}
        <Header onChatClick={() => setChatVisible(true)} />

        {/* --- 2. SearchBar --- */}
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onSelect={handleSearchSelect}
          placeholder="Tìm kiếm địa điểm"
        />

        {/* --- 3. Gợi ý Địa điểm --- */}
        <div>
          <h2 className="font-bold mb-3 text-lg flex items-center gap-2 text-gray-700">
            <span>📍</span> Gợi ý các địa điểm nổi tiếng ở gần bạn:
          </h2>

          {isLoading ? (
            <div className="text-center p-10 text-gray-800">Đang tìm kiếm địa điểm...</div>
          ) : (
            <div className="flex flex-col gap-3">
              {nearbyData.map((item) => (
                <NearbyCard
                  key={item.id}
                  {...item} // Truyền tất cả props (id, name, distance...)
                  onClick={() => handleCardClick(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- 4. Menu Chính --- */}
        <div>
          {/* <-- THÊM MỚI: Tiêu đề cho Menu --> */}
          <h2 className="font-bold mb-3 text-lg flex items-center gap-2 text-gray-700">
              Menu chính:
          </h2>
          <MainMenu />
        </div>
        
      </div> 
      {/* =================================================================== */}
      {/* ==================== HẾT PANEL KÍNH MỜ ==================== */}
      {/* =================================================================== */}


      {/* --- Chatbot (Nằm ngoài panel) --- */}
      {!chatVisible && (
        <div
          className="fixed bottom-6 right-6 w-32 h-32 cursor-pointer z-50 animate-bounce-slow"
          onClick={() => setChatVisible(true)}
        >
          <img src={chatbotImage} alt="Chatbot" className="w-full h-full object-contain" />
        </div>
      )}
      {chatVisible && <ChatPopup onClose={() => setChatVisible(false)} />}
    </div>
  );
};

export default Home;