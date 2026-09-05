import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function serveMailTemplates(): Plugin {
  const mailDir = path.resolve(__dirname, 'backend/src/main/resources/mail')
  return {
    name: 'serve-mail-templates',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (!url.startsWith('/mail/') || !url.endsWith('.html')) {
          next()
          return
        }
        const file = path.join(mailDir, path.basename(url))
        if (!file.startsWith(mailDir) || !fs.existsSync(file)) {
          next()
          return
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(fs.readFileSync(file, 'utf8'))
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useJavaApi = env.VITE_USE_JAVA_API === 'true'

  return {
    plugins: [react(), tailwindcss(), serveMailTemplates()],
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
              ws: true,
            },
          }
        : undefined,
    },
  }
})
