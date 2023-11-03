import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from 'vite-plugin-static-copy'


// https://vitejs.dev/config/
export default defineConfig({
  envDir: "./envDir/",
  plugins: [react(),
  viteStaticCopy({
    targets: [
      {
        src: '_redirects',
        dest: './'
      }
    ]
  })
  ],
});
