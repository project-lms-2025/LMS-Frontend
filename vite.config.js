import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['4c80-2409-40d5-100f-803a-8b64-ff42-4119-d24.ngrok-free.app/', 'localhost', '127.0.0.1']
  }
})
