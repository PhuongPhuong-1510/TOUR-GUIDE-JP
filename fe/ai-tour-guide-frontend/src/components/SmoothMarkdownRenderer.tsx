// src/components/SmoothMarkdownRenderer.tsx
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  text: string;
}

const SmoothMarkdownRenderer: React.FC<Props> = ({ text }) => {
  // text = là TỔNG văn bản đã nhận từ state (ví dụ: "Chào bạn. Hôm nay")

  // displayedText = là văn bản ĐANG gõ ra màn hình (ví dụ: "Chào bạn. Hô")
  const [displayedText, setDisplayedText] = useState("");
  
  // typingQueue = là hàng đợi các chữ CẦN gõ (ví dụ: "m nay")
  const [typingQueue, setTypingQueue] = useState("");
  
  // Ref để lưu lại độ dài text cũ, giúp tìm ra "mẩu mới"
  const prevTextLengthRef = useRef(0);

  // === Effect 1: Thêm text mới vào hàng đợi ===
  useEffect(() => {
    // 1. Tìm mẩu text mới (phần chênh lệch)
    // Ví dụ: text = "Hello world", prevLength = 5
    // -> newChunk = " world"
    const newChunk = text.substring(prevTextLengthRef.current);

    // 2. Thêm mẩu mới vào hàng đợi (queue)
    if (newChunk) {
      setTypingQueue((prevQueue) => prevQueue + newChunk);
    }

    // 3. Cập nhật lại độ dài cho lần sau
    prevTextLengthRef.current = text.length;
    
  }, [text]); // Chỉ chạy khi TỔNG text thay đổi

  
  // === Effect 2: Xử lý hàng đợi (gõ chữ) ===
  useEffect(() => {
    // Nếu không có gì trong hàng đợi, không làm gì cả
    if (typingQueue.length === 0) return;

    // 1. Bật đồng hồ (interval) để gõ chữ
    const intervalId = setInterval(() => {
      // 2. Lấy 1 chữ cái từ hàng đợi
      const char = typingQueue[0];
      
      // 3. Cộng 1 chữ vào state HIỂN THỊ
      setDisplayedText((prevDisplay) => prevDisplay + char);
      
      // 4. Xóa 1 chữ khỏi hàng đợi
      setTypingQueue((prevQueue) => prevQueue.substring(1));
      
      // 5. Nếu gõ xong (hàng đợi chỉ còn 1 chữ), tắt đồng hồ
      if (typingQueue.length <= 1) {
        clearInterval(intervalId);
      }
    }, 15); // Tốc độ gõ: 15ms/chữ (Bạn có thể chỉnh số này, 50 = chậm, 10 = nhanh)

    // 6. Hàm dọn dẹp: tắt đồng hồ khi component bị hủy
    return () => clearInterval(intervalId);
    
  }, [typingQueue]); // Chỉ chạy khi HÀNG ĐỢI thay đổi

  
  return (
    // Component này sẽ render lại mỗi 15ms, tạo hiệu ứng mượt mà
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {displayedText}
    </ReactMarkdown>
  );
};

export default SmoothMarkdownRenderer;