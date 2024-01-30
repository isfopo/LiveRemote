import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tamaguiPlugin } from "@tamagui/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    tamaguiPlugin({
      config: "./tamagui.config.ts",
      components: ["tamagui"],
    }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "LiveRemote",
        short_name: "LiveRemote",
        description: "My Awesome App description",
        theme_color: "#ffffff",
        background_color: "#2f3d58",
        display: "minimal-ui",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
