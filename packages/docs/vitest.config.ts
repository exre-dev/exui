import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import { exampleDependencies } from "./example-dependencies.js"
import { showcaseSharing } from "./sharing-plugin.js"

export default defineConfig({
  plugins: [react(), tailwindcss(), showcaseSharing()],
  resolve: { dedupe: ["react", "react-dom", "@exre/exui"] },
  optimizeDeps: { include: [...exampleDependencies, "react-router"] },
  test: {
    name: "visual",
    include: ["tests/browser/**/*.vrt.test.tsx"],
    fileParallelism: false,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        contextOptions: {
          deviceScaleFactor: 1,
          locale: "en-US",
          reducedMotion: "reduce",
          timezoneId: "UTC",
        },
      }),
      instances: [
        {
          browser: "chromium",
          name: "chromium-desktop",
          viewport: { width: 1280, height: 900 },
        },
        {
          browser: "chromium",
          name: "chromium-mobile",
          viewport: { width: 390, height: 844 },
        },
      ],
    },
  },
})
