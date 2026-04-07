// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
     define: {
     "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: "./src/index.jsx",
      name: "ChatbotSDK",
      fileName: "chatbot-sdk",
      formats: ["umd"], // important for script tag
    },
  },
});