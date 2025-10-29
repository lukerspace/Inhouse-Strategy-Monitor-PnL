// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//     proxy: {
//       "/api": {
//         target: "http://127.0.0.1:8000",   // 你的 Flask 後端
//         changeOrigin: true,
//         rewrite: (p) => p.replace(/^\/api/, ""),
//       },
//     },
//   },
//   plugins: [
//     react(),
//     mode === "development" && componentTagger(),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// 🔍 偵測是否在 Docker 環境
const isDocker = process.env.DOCKER_ENV === "true";

// 🖨️ 打印模式提示
console.log("========================================");
console.log(isDocker ? "🐳 Running in Docker mode" : "💻 Running in Local mode");
console.log("Backend Target →", isDocker ? "http://backend:8000" : "http://127.0.0.1:8000");
console.log("========================================");

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",        // ✅ 讓容器外部也可訪問
    port: 8081,             // ✅ 前端開發埠
    proxy: {
      "/api": {
        target: isDocker
          ? "http://backend:8000"   // 🐳 Docker 模式（docker-compose service name）
          : "http://127.0.0.1:8000", // 💻 本機開發模式
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 可選：打印 Vite 啟動資訊（方便偵錯）
  define: {
    __IS_DOCKER__: JSON.stringify(isDocker),
  },
}));
