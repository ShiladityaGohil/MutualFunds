import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env files based on mode
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    preview: {
      port: process.env.PORT || 3000,
      host: '0.0.0.0', // Required for Render deployment
    },
    // No need to explicitly define environment variables as Vite handles VITE_* prefixed variables automatically
  }
})