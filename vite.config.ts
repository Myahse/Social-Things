import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useJavaApi = env.VITE_USE_JAVA_API === 'true'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: useJavaApi
        ? {
            '/api': {
              target: 'http://localhost:8080',
              changeOrigin: true,
            },
          }
        : undefined,
    },
  }
})
