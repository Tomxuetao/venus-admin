import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { BuilderSvg } from './src/utils/builder-svg'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
	base: '/venus-admin',
	server: {
		proxy: {
			'/venus-api': {
				target: 'http://124.221.201.64:8888',
				secure: false,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/venus-api/, '/venus-admin')
			}
		},
		host: '127.0.0.1'
	},
	plugins: [
		vue(),
		BuilderSvg('./src/icons/svg/', ''),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	resolve: {
		alias: [
			{ find: '@', replacement: resolve(__dirname, 'src') }
		]
	},
	build: {
		target: 'chrome80',
		polyfillDynamicImport: true
	}
})
