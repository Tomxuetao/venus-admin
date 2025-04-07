import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import ViteCompression from 'vite-plugin-compression'
import { LayoutResolver } from 'layout-vue3/es/utils/auto-import'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  base: '/venus-admin',
  server: {
    proxy: {
      '/venus-data': {
        secure: true,
        changeOrigin: true,
        target: 'https://tomxuetao.xyz'
      },
      '/geoserver': {
        secure: true,
        changeOrigin: true,
        target: 'http://127.0.0.1:6350'
      },
      '/venus-api': {
        secure: true,
        changeOrigin: true,
        target: 'http://127.0.0.1:8888',
        rewrite: (path) => path.replace(/^\/venus-api/, '')
      },
      '/open-api': {
        secure: true,
        changeOrigin: true,
        target: 'http://127.0.0.1:8888'
      },
      '/event-stream': {
        secure: true,
        changeOrigin: true,
        target: 'http://127.0.0.1:8888',
        rewrite: (path) => path.replace(/^\/event-stream/, '')
      }
    },
    host: '127.0.0.1'
  },
  plugins: [
    vue(),
    svgLoader(),
    visualizer({
      open: true,
      gzipSize: true
    }),
    AutoImport({
      viteOptimizeDeps: true,
      dts: './auto-imports.d.ts',
      resolvers: [
        LayoutResolver(),
        ElementPlusResolver()
      ],
      imports: ['vue', 'pinia', 'vue-router'],
      eslintrc: {
        enabled: false,
        globalsPropValue: true,
        filepath: './auto-import.json'
      }
    }),
    Components({
      dts: true,
      deep: true,
      extensions: ['vue'],
      dirs: ['src/components'],
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [
        LayoutResolver(),
        ElementPlusResolver()
      ]
    }),
    ViteCompression({
      algorithm: 'gzip',
      deleteOriginFile: false,
      filter: /\.(js|mjs|json|css|html)$/i
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  esbuild: {
    drop: ['debugger', 'console']
  },
  build: {
    outDir: 'venus-admin',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 512,
    rollupOptions: {
      output: {
        manualChunks: {
          'ol': ['ol'],
          'vue': ['vue'],
          'axios': ['axios'],
          'pinia': ['pinia'],
          'vue-router': ['vue-router'],
          'element-plus': ['element-plus']
        }
      }
    }
  }
})
