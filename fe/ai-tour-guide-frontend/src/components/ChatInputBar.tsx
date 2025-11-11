import React, { useState } from "react";
import { Mic, Send } from "lucide-react";

interface ChatInputBarProps {
  onSend: (text: string) => void;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSend }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue("");
  };

  return (
    <div className="p-4 bg-white/70 backdrop-blur-sm border-t border-gray-100 rounded-b-3xl">
      <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-2 shadow-inner">
        <button className="p-2 rounded-full text-indigo-600 hover:bg-gray-200 transition">
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Hỏi về du lịch ở Nhật Bản..."
          className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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

export default ChatInputBar;
