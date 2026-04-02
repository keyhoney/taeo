import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type ConfigEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
// GitHub Pages 프로젝트 사이트: https://<user>.github.io/<repo>/
// 저장소 이름이 바뀌면 아래 repo 이름도 맞춰 주세요.
const GITHUB_PAGES_REPO = "taeo";

export default defineConfig(({ command }: ConfigEnv) => ({
  // 로컬 개발(`vite`)은 루트 `/`, 빌드(`vite build`)만 저장소 경로로 고정
  base: command === "build" ? `/${GITHUB_PAGES_REPO}/` : "/",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));
