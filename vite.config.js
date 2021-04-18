import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svgBuilder } from './src/utils/svgBuilder'

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
		}
	},
	plugins: [
		vue(),
		svgBuilder('./src/icons/svg/', '')
	],
	resolve: {
		alias: [
			{ find: '@', replacement: resolve(__dirname, 'src') }
		]
	},
	optimizeDeps: {
		include: ['lodash']
	}
})
