const GEMINI_API_URL = "http://localhost:5000/api/gemini";

// ---- TYPES ---- //
export interface GeminiRequest {
  prompt: string; // Chỉ gửi prompt
}

export interface GeminiStreamRequest {
  prompt: string;
  // Hàm này sẽ được gọi mỗi khi có 1 mẩu text mới từ AI
  onChunkReceived: (chunkText: string) => void;
  // Hàm này được gọi khi stream kết thúc
  onStreamEnd: () => void;
  // Hàm này được gọi khi có lỗi
  onError: (errorMessage: string) => void;
}

// ---- TEMPLATE ---- //
export const buildTourGuidePrompt = (city: string, topic: string): string => `
**[HUẤN LUYỆN ĐỊNH DẠNG ĐẶC BIỆT]**

Bạn là hướng dẫn viên du lịch Nhật Bản chuyên nghiệp.

**Mục tiêu:** Giới thiệu về ${city} với chủ đề "${topic}".

**Phong cách:** Sinh động, hài hước, gần gũi, truyền cảm hứng.

**Nội dung:** Kể chi tiết về cảnh đẹp, văn hóa, món ăn đặc trưng, và những mẹo thú vị cho du khách.

**YÊU CẦU ĐỊNH DẠNG (Bắt buộc theo cấu trúc Markdown rõ ràng):**
1. **Sử dụng Markdown Heading (##) cho các mục chính (VD: Cảnh Đẹp, Ẩm Thực).**
2. **SAU MỖI CÂU GIỚI THIỆU HOẶC ĐOẠN VĂN NGẮN, HÃY XUỐNG DÒNG CÁCH DÒNG (DOUBLE NEWLINE) để tạo nhịp nghỉ.**
3. **Chèn một Emoji/Icon nhỏ (VD: 🌸, 🍜, 💡) trước mỗi Heading/Mục nhỏ để làm nổi bật.**
4. **Dùng Numbered Lists (1., 2., 3.) cho danh sách địa điểm/món ăn chính.**
5. **Bên trong mỗi mục liệt kê chính, dùng Bullet Points (*) cho các chi tiết nhỏ.**
6. **Dùng chữ **Đậm** để nhấn mạnh từ khóa.**
7. **Bắt đầu bằng lời chào và kết thúc bằng câu mời gọi cảm xúc.**
---
**BẮT ĐẦU TRẢ LỜI:**
`;

export const callGeminiAPIStream = async ({
  prompt,
  onChunkReceived,
  onStreamEnd,
  onError,
}: GeminiStreamRequest): Promise<void> => {
  try {
    console.log("Sending STREAM request to backend:", { prompt });
    const startTime = performance.now(); // Vẫn đo thời gian

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      // Nếu lỗi ngay từ đầu (ví dụ 500), xử lý ở đây
      const errorText = await response.text(); // Đọc lỗi dưới dạng text
      throw new Error(errorText || `Lỗi API: ${response.statusText}`);
    }

    // 1. Lấy stream body từ response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Không thể đọc stream body.");
    }

    // 2. Dùng TextDecoder để chuyển dữ liệu (Uint8Array) về string
    const decoder = new TextDecoder();

    // 3. Lặp vô hạn để đọc stream
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Stream đã kết thúc
        console.log("Stream finished.");
        const endTime = performance.now();
        console.log(`✅ AI Stream Time: ${(endTime - startTime).toFixed(2)} ms`);
        
        // Gọi callback báo hiệu kết thúc
        onStreamEnd();
        break; // Thoát vòng lặp
      }

      // 4. Giải mã mẩu dữ liệu và gọi callback
      const chunkText = decoder.decode(value);
      // Gọi hàm callback ở component để cập nhật UI
      onChunkReceived(chunkText);
    }

  } catch (err) {
    console.error("Gemini API stream error:", err);
    const errorMsg = err instanceof Error ? err.message : "Lỗi API, thử lại sau.";
    // Gọi callback báo lỗi
    onError(errorMsg);
  }
};