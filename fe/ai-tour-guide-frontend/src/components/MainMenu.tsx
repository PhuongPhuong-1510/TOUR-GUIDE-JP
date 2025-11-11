import React from "react";
import MenuCard from "./MenuCard";
// Import các icon mới: Newspaper, Users
// Xóa các icon cũ không dùng: Map, Languages, Navigation
import {
  Heart,
  CalendarCheck,
  Newspaper, // Icon cho Bài viết
  Users,     // Icon cho Bạn bè
} from "lucide-react";

const MainMenu: React.FC = () => {
  return (
    <div className="p-4">
      {/* <h3 className="text-lg font-semibold text-gray-700 mb-3">Menu chính</h3> */}

      {/* Sử dụng grid-cols-2 để tạo layout 2 cột */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1: Lịch trình thông minh (Giữ nguyên) */}
        <MenuCard
          title="Lịch trình"
          subtitle="thông minh"
          icon={CalendarCheck}
        />

        {/* Card 2: Đổi thành Bài viết */}
        <MenuCard
          title="Bài viết"
          // subtitle="& Bản đồ" // Bỏ subtitle
          icon={Newspaper} // Đổi icon
        />

        {/* Card 3: Đổi thành Bạn bè */}
        <MenuCard
          title="Bạn bè"
          // subtitle="& Phiên dịch" // Bỏ subtitle
          icon={Users} // Đổi icon
        />

        {/* Card 4: Ưa thích (Giữ nguyên) */}
        <MenuCard
          title="Ưa thích"
          icon={Heart}
        />
      </div>
    </div>
  );
};

export default MainMenu;