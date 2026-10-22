import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "remotion", test: /node_modules\/(?:@remotion|remotion)\//, priority: 20 },
            { name: "react", test: /node_modules\/(?:react|react-dom|scheduler)\//, priority: 10 },
          ],
        },
      },
    },
  },
  test: { include: ["src/**/*.test.ts"] },
});
