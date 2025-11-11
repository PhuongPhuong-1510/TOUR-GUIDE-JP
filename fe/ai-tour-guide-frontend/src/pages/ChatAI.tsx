import React, { useState } from 'react';
import { Bot, MessageSquare, Mic, Send, ChevronUp, X, MapPin, Book, Landmark, DollarSign } from 'lucide-react';

// --- Sub-components ---

const ChatInputBar: React.FC = () => {
    const quickTopics = [
        { name: 'Lịch trình', icon: MapPin, color: 'text-indigo-400' },
        { name: 'Ẩm thực', icon: Book, color: 'text-red-400' },
        { name: 'Văn hóa', icon: Landmark, color: 'text-teal-400' },
        { name: 'Ngân sách', icon: DollarSign, color: 'text-amber-400' },
    ];

    return (
        <div className="p-4 bg-white/70 backdrop-blur-sm border-t border-gray-100 rounded-b-3xl">
            <div className="flex justify-between space-x-2 mb-3 overflow-x-auto pb-1">
                {quickTopics.map((topic) => (
                    <button
                        key={topic.name}
                        className={`flex items-center text-xs font-semibold px-3 py-2 whitespace-nowrap rounded-full bg-gray-100 hover:bg-pink-100 transition duration-200 sakura-hover-effect ${topic.color}`}
                        onClick={() => console.log(`Gợi ý nhanh: ${topic.name}`)}
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
                    placeholder="Hỏi về du lịch ở Nhật Bản..."
                    className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                />

                <button className="p-3 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition duration-200 hover:shadow-xl">
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

const WelcomeBlock: React.FC = () => {
    const suggestions = [
        "Gợi ý lịch trình 2 ngày ở Osaka cho người thích ẩm thực",
        "Giải thích nghi lễ ở đền Fushimi Inari",
        "Tìm nhà hàng ramen ngon gần ga Shinjuku",
    ];

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-start">
                <div className="p-3 mr-3 bg-gray-100 rounded-full flex-shrink-0">
                    <Bot className="w-5 h-5 text-red-600" />
                </div>
                <div className="bg-red-100 text-gray-800 p-4 rounded-xl rounded-tl-none shadow-md max-w-sm border border-red-200">
                    <p className="text-sm font-semibold mb-1 flex items-center">
                        🤖 Xin chào! Tôi là hướng dẫn viên AI của bạn <span className="ml-1 text-base">🇯🇵</span>
                    </p>
                    <p className="text-sm">
                        Tôi là Haru, trợ lý du lịch cá nhân của bạn. Tôi có thể giúp bạn lên kế hoạch cho chuyến đi Nhật Bản mơ ước ngay hôm nay không?
                    </p>
                </div>
            </div>

            <div className="pt-2">
                <p className="text-sm font-medium text-gray-500 mb-3">Bạn muốn hỏi điều gì hôm nay?</p>
                <div className="space-y-3">
                    {suggestions.map((text, index) => (
                        <button
                            key={index}
                            className="flex items-center w-full text-left p-3 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition duration-150 sakura-hover-effect"
                            onClick={() => console.log(`Gửi gợi ý: ${text}`)}
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

// --- Main ChatAI Component ---

const ChatAI: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(true);

    return (
        <div className="min-h-screen flex justify-center items-center p-4">

            <div className="japanese-card w-full max-w-lg h-[85vh] flex flex-col z-10 bg-gray-100 rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
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
                        <button
                            onClick={() => console.log("Close chat")}
                            className="p-1 text-gray-600 hover:text-red-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {isChatOpen && (
                    <>
                        <div className="flex-grow overflow-y-auto" style={{ maxHeight: "calc(100% - 140px)" }}>
                            <WelcomeBlock />
                        </div>
                        <ChatInputBar />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatAI;
