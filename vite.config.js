import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
            return 'pdf'
          }

          if (id.includes('lucide-react') || id.includes('react-icons')) {
            return 'icons'
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'framework'
          }

          return 'vendor'
        },
      },
    },
  },
})
