import { defineConfig, type PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mode === 'analyze' &&
      (visualizer({
        filename: path.resolve(import.meta.dirname, 'stats.html'),
      }) as PluginOption),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  define: {
    __IS_DEV__: JSON.stringify(mode === 'development'),
    __PROJECT__: JSON.stringify('frontend'),
  },
}))
