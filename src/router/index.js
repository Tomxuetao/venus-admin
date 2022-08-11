import { isURL } from '@/utils'
import { computed } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { sysMenuNavApi } from '@/api/menu-api'
import store from '@/store'

const commonModules = import.meta.glob('../views/common/*.vue')
const layoutModules = import.meta.glob('../views/layout/*.vue')
const dynamicModules = import.meta.glob('../views/modules/*/*.vue')
console.log(dynamicModules)

const mainTabs = computed({
	get: () => {
		return store.state.common.mainTabs
	},
	set: value => {
		store.commit('common/updateMainTabs', value)
	}
})

const menuActiveName = computed({
	get: () => {
		return store.state.common.menuActiveName
	},
	set: value => {
		store.commit('common/updateMenuActiveName', value)
	}
})

const mainTabsActiveName = computed({
	get: () => {
		return store.state.common.mainTabsActiveName
	},
	set: value => {
		store.commit('common/updateMainTabsActiveName', value)
	}
})

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = [
	{
		path: '/',
		component: layoutModules['../views/layout/main.vue'],
		name: 'main-dynamic',
		redirect: { name: 'home' },
		meta: { title: '主入口整体布局' },
		children: [
			{
				path: '/home',
				component: commonModules['../views/common/home.vue'],
				name: 'home',
				meta: { title: '首页' }
			},
			{
				path: '/theme',
				component: commonModules['../views/common/theme.vue'],
				name: 'theme',
				meta: { title: '样式设置' }
			},
			{
				path: '/404',
				component: commonModules['../views/common/404.vue'],
				name: '404',
				meta: { title: '404未找到' }
			}
		]
	},
	{
		path: '/login',
		component: commonModules['../views/common/login.vue'],
		name: 'login',
		meta: { title: '登录' }
	}
]

const router = createRouter({
	routes: mainRoutes,
	history: createWebHistory(),
	scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
	if (to.name === 'login') {
		next()
	} else {
		if (sessionStorage.getItem('token')) {
			if (to.meta.isDynamic || router.options.isDynamic) {
				routeChange(to)
				next()
			} else {
				sysMenuNavApi().then((data) => {
					router.options.isDynamic = true
					addDynamicRoutes(data)
					sessionStorage.setItem('menuList', JSON.stringify(data || '[]'))
					next({ ...to, replace: true })
				}).catch((e) => {
					console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
					next({ name: 'login', replace: true })
				})
			}
		} else {
			next({ name: 'login', replace: true })
		}
	}
})

const addDynamicRoutes = (routeList = []) => {
	routeList.forEach((item) => {
		if (item.url) {
			const route = {
				path: item.url.replace('/', '-'),
				component: dynamicModules[`../views/modules/${item.url}.vue`] || commonModules['../views/common/404.vue'],
				name: item.url.replace('/', '-'),
				meta: {
					id: item.id,
					title: item.name,
					isDynamic: true,
					isTab: true,
					iframeUrl: ''
				}
			}
			router.addRoute('main-dynamic', route)
		}
	})
}

const routeChange = (route) => {
	if (route.meta.isTab) {
		let tab = mainTabs.value.find(item => item.id === route.meta.id)
		if (!tab) {
			tab = {
				id: route.meta.id,
				name: route.name,
				title: route.meta.title,
				type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
				iframeUrl: route.meta.iframeUrl || '',
				params: route.params,
				query: route.query
			}
			mainTabs.value = mainTabs.value.concat(tab)
		}
		menuActiveName.value = tab.name
		mainTabsActiveName.value = tab.name
	}
}

export default router
