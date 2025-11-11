import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(() => {
  const plugins: PluginOption[] = [react()]

  if (process.env.ANALYZE === 'true') {
    plugins.push(
      visualizer({
        filename: 'dist/bundle-report.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    )
  }

  return {
    plugins,
  }
})
