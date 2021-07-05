import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svgBuilder } from './src/utils/svgBuilder'
import styleImport from 'vite-plugin-style-import'

const { resolve } = require('path')

export default defineConfig({
	server: {
		proxy: {
			'/proxyApi': {
				target: 'http://localhost:9080/venus-fast/',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/proxyApi/, '')
			}
		},
		host: '127.0.0.1'
	},
	plugins: [
		vue(),
		svgBuilder('./src/icons/svg/', ''),
    styleImport({
      libs: [{
        libraryName: 'element-plus',
        esModule: true,
        ensureStyleFile: true,
        resolveStyle: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
        resolveComponent: (name) => {
          return `element-plus/lib/${name}`;
        },
      }]
    })
	],
	resolve: {
		alias: [
			{ find: '@', replacement: resolve(__dirname, 'src') }
		]
	},
	optimizeDeps: {
		include: ['lodash']
	},
	build: {
		target: 'chrome80',
		polyfillDynamicImport: true
	}
})
