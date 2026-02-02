import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // Proxies API requests to the Backend
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            // If your API routes in backend don't start with /api, 
            // you might need to proxy specific routes like /auth, /hr-agent, etc.
            // But based on our api.js, we point directly to localhost:8000, 
            // so this is a fallback if you use relative paths.
        }
    }
})