import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    fs: {
      // let dev mode serve workloads from anywhere via /@fs/, matching scripts/serve.mjs
      allow: ['/'],
    },
  },
})
