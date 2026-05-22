import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "aso-wa-0a",
      project: "asowa-platform",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts", // assuming the test folder is in the root of our project
  },
  publicDir: "./src/assets",
} as UserConfig);
