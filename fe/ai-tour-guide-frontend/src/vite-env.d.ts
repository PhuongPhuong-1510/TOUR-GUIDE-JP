/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAP_API_KEY: string;
  // Thêm các biến VITE_ khác của bạn ở đây nếu có
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}