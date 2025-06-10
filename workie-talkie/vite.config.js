import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <- 이거 추가
    },
  },
  // 채팅 설정 추가
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // Node.js의 'global'을 브라우저의 'globalThis'로 매핑
      },
    },
  },
});
