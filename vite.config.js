import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import webExtension from "@samrum/vite-plugin-web-extension";
import path from "path";
import { getManifest } from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      preact(),
      webExtension({
        manifest: getManifest(),
        additionalInputs: {
          scripts: ["src/entries/injected/main.js"],
        },
      }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  };
});
