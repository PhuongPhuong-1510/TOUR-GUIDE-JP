import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// 1. THÊM thư viện SDK chính thức
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 2. Khởi tạo Gemini bằng SDK ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("Lỗi: GEMINI_API_KEY chưa được thiết lập trong .env");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 3. Cấu hình model ở đây
const model = genAI.getGenerativeModel({
  // LƯU Ý: Model mới nhất là 'gemini-1.5-flash', 
  // model 'gemini-2.5-flash' chưa tồn tại.
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.75,
    topP: 0.9,
  },
});

// --- 4. Sửa API endpoint để hỗ trợ STREAM ---
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      // Dùng return để dừng hàm ngay lập tức
      return res.status(400).json({ outputText: "Lỗi: Vui lòng nhập nội dung câu hỏi." });
    }

    // === BẮT ĐẦU LOGIC STREAM ===

    // 5. Sử dụng `generateContentStream`
    const result = await model.generateContentStream(prompt);

    // 6. Thiết lập Header cho client (React) biết đây là stream
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // 7. Lặp qua từng phần (chunk) của stream
    for await (const chunk of result.stream) {
      // 8. Kiểm tra chunk và lấy text
      const chunkText = chunk.text ? chunk.text() : undefined;

      // CHỈ GỬI nếu nó là string CÓ NỘI DUNG
      if (typeof chunkText === 'string' && chunkText.length > 0) {
        res.write(chunkText);
      }
      // Nếu chunkText là 'undefined' hoặc rỗng, ta bỏ qua, không gửi
    }

    // 9. Kết thúc response khi stream hết
    res.end();

  } catch (err) {
    console.error("Lỗi proxy Gemini:", err);
    // Khi stream lỗi, ta phải kết thúc response bằng text
    res.status(500).end(`Lỗi Máy Chủ: ${err instanceof Error ? err.message : "Thử lại sau"}`);
  }
});

const PORT = process.env.PORT || 5000;
// Thêm chữ (STREAMING) để bạn biết đang chạy đúng file
app.listen(PORT, () => console.log(`✅ Backend (STREAMING) đang chạy tại http://localhost:${PORT}`));