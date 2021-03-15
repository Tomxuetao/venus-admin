import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const { resolve } = require('path')

export default defineConfig({
	server: {
		proxy: {
			'/proxyApi': {
				target: 'http://demo.open.renren.io/renren-fast-server',
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/proxyApi': ''
				}
			}
		}
	},
	plugins: [
		vue()
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
