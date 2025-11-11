// src/components/ChatPopup.tsx
import SmoothMarkdownRenderer from './SmoothMarkdownRenderer'; // <-- THÊM DÒNG NÀY
import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  MessageSquare,
  Mic,
  Send,
  ChevronUp,
  X,
  MapPin,
  Book,
  Landmark,
  DollarSign,
} from "lucide-react";
// 1. SỬA IMPORT: Đổi sang hàm Stream
import { callGeminiAPIStream, buildTourGuidePrompt } from "../services/geminiService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  from: "user" | "ai";
  text: string;
}

// ===== Chat Input Bar =====
// (Component này giữ nguyên - không thay đổi)
const ChatInputBar: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
  const [input, setInput] = useState("");

  const quickTopics = [
    { name: "Lịch trình", icon: MapPin, color: "text-indigo-400" },
    { name: "Ẩm thực", icon: Book, color: "text-red-400" },
    { name: "Văn hóa", icon: Landmark, color: "text-teal-400" },
    { name: "Ngân sách", icon: DollarSign, color: "text-amber-400" },
  ];

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="p-4 bg-white/70 backdrop-blur-sm border-t border-gray-100 rounded-b-3xl">
      <div className="flex justify-between space-x-2 mb-3 overflow-x-auto pb-1">
        {quickTopics.map((topic) => (
          <button
            key={topic.name}
            className={`flex items-center text-xs font-semibold px-3 py-2 whitespace-nowrap rounded-full bg-gray-100 hover:bg-pink-100 transition duration-200 ${topic.color}`}
            onClick={() => onSend(topic.name)}
          >
            <topic.icon className="w-4 h-4 mr-1" />
            {topic.name}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-2 shadow-inner">
        <button className="p-2 rounded-full text-indigo-600 hover:bg-gray-200 transition">
          <Mic className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi về du lịch ở Nhật Bản..."
          className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="p-3 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition duration-200 hover:shadow-xl"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ===== Welcome Block =====
// (Component này giữ nguyên - không thay đổi)
const WelcomeBlock: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
  const suggestions = [
    "Gợi ý lịch trình 2 ngày ở Osaka cho người thích ẩm thực",
    "Giải thích nghi lễ ở đền Fushimi Inari",
    "Tìm nhà hàng ramen ngon gần ga Shinjuku",
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start">
        <div className="p-3 mr-3 bg-gray-200 rounded-full flex-shrink-0">
          <Bot className="w-5 h-5 text-red-600" />
        </div>
        <div className="bg-red-50 text-gray-800 p-4 rounded-xl rounded-tl-none shadow-md max-w-sm border border-red-200">
          <p className="text-sm font-semibold mb-1 flex items-center">
            🤖 Xin chào! Tôi là hướng dẫn viên AI của bạn <span className="ml-1 text-base">🇯🇵</span>
          </p>
          <p className="text-sm">
            Tôi là Haru, trợ lý du lịch cá nhân của bạn. Tôi có thể giúp bạn lên kế hoạch cho
            chuyến đi Nhật Bản mơ ước ngay hôm nay không?
          </p>
        </div>
      </div>
      <div className="pt-2">
        <p className="text-sm font-medium text-gray-500 mb-3">Bạn muốn hỏi điều gì hôm nay?</p>
        <div className="space-y-3">
          {suggestions.map((text, index) => (
            <button
              key={index}
              onClick={() => onSend(text)}
              className="flex items-center w-full text-left p-3 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition duration-150"
            >
              <MessageSquare className="w-4 h-4 mr-2 text-indigo-400 flex-shrink-0" />
              <span className="text-gray-700">💬 "{text}"</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== Chat Popup chính =====
const ChatPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // === 2. SỬA LẠI HOÀN TOÀN HÀM handleSend ĐỂ DÙNG STREAM ===
  const handleSend = async (text: string) => {
    // Thêm tin nhắn của người dùng
    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true); // Bật loading (hiện "Đang xử lý...")

    // Thêm một tin nhắn AI rỗng ngay lập tức
    // Chúng ta sẽ cập nhật tin nhắn này
    setMessages((prev) => [...prev, { from: "ai", text: "" }]);

    // Sử dụng prompt bạn muốn (ví dụ: dùng buildTourGuidePrompt)
    // const prompt = buildTourGuidePrompt("Tokyo", text);
    const city = "Nhật Bản";
    const topic = text; // text chính là "Văn hóa", "Lịch trình"...

    // Dùng "cái khuôn" để tạo prompt hoàn chỉnh
    const prompt = buildTourGuidePrompt(city, topic);
    await callGeminiAPIStream({
      prompt: prompt,

      // Hàm này được gọi mỗi khi có text mới
      onChunkReceived: (chunkText) => {
        setMessages((prev) =>
          prev.map((msg, index) =>
            // Tìm tin nhắn cuối cùng (là tin nhắn AI rỗng) và cộng dồn text
            index === prev.length - 1
              ? { ...msg, text: msg.text + chunkText }
              : msg
          )
        );
      },

      // Hàm này được gọi khi stream kết thúc
      onStreamEnd: () => {
        setLoading(false); // Tắt loading
      },

      // Hàm này được gọi khi có lỗi
      onError: (errorMsg) => {
        // Cập nhật tin nhắn AI cuối cùng với lỗi
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, text: `❌ Lỗi: ${errorMsg}` }
              : msg
          )
        );
        setLoading(false); // Tắt loading
      },
    });
  };
  // === KẾT THÚC SỬA handleSend ===


  // Tự động scroll xuống cuối khi có tin nhắn mới
  // (Giữ nguyên - không thay đổi)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);


  // (Toàn bộ phần JSX return giữ nguyên - không thay đổi)
  return (
    <div className="fixed bottom-6 right-6 w-[500px] h-[450px] z-50 flex flex-col bg-gray-100 rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-full">
            <Bot className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Haru (春)</h2>
            <p className="text-xs text-gray-500">Trợ lý du lịch AI</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
            Được hỗ trợ bởi AI
          </span>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            {isChatOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5 rotate-180" />
            )}
          </button>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {isChatOpen && (
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-grow overflow-y-auto p-4 flex flex-col space-y-3">
            {messages.length === 0 ? (
              <WelcomeBlock onSend={handleSend} />
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-end ${msg.from === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {msg.from === "ai" && (
                    <div className="p-2 bg-gray-200 rounded-full mr-2">
                      <Bot className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-xl break-words text-sm shadow-sm ${msg.from === "user"
                      ? "bg-blue-100 text-gray-800 rounded-br-none"
                      : "bg-red-50 text-gray-800 border border-red-200 rounded-bl-none"
                      }`}
                  >
                    {/* ReactMarkdown sẽ tự động render lại khi text thay đổi */}
                    <div className="prose prose-sm max-w-none text-gray-800 prose-p:my-2 prose-strong:text-red-700 prose-h2:text-lg prose-h2:font-bold prose-h2:mt-3 prose-h2:text-red-600">

                      {/* === SỬA Ở ĐÂY === */}
                      {msg.from === 'user' ? (
                        // Tin nhắn của USER: Dùng ReactMarkdown bình thường
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        // Tin nhắn của AI: Dùng component Smooth (mượt) mới
                        <SmoothMarkdownRenderer text={msg.text} />
                      )}
                      {/* === KẾT THÚC SỬA === */}

                    </div>


                  </div>

                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Bot className="w-4 h-4 text-red-400 animate-pulse" />
                <span>Đang xử lý...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInputBar onSend={handleSend} />
        </div>
      )}
    </div>
  );
};

export default ChatPopup;