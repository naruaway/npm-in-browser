import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    // Node.js polyfills are needed for memfs to work in browser. npm-in-browser itself does not require such polyfills since they ship with all the necessary polyfills
    nodePolyfills(),
  ],
});
