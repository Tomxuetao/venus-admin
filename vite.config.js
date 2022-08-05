import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import { BuilderSvg } from './src/utils/builder-svg'

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
	optimizeDeps: {
		include: ['lodash']
	},
	build: {
		target: 'chrome80',
		polyfillDynamicImport: true
	}
})
