import { useCommonStore } from '@/store'

import { createRouter, createWebHistory } from 'vue-router'

const commonModules = import.meta.glob(['../views/common/*.vue'])
const layoutModules = import.meta.glob(['../views/layout/*.vue'])
const dynamicModules = import.meta.glob(['../views/modules/*/*.vue'])

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = [
  {
    path: '/',
    component: layoutModules['../views/layout/index.vue'],
    name: 'main-dynamic',
    meta: { title: '主入口整体布局' },
    children: [],
    beforeEnter: (to, from, next) => {
      if (to.name === 'main-dynamic') {
        next({
          replace: true,
          ...router.getRoutes()[0]
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/login',
    component: commonModules['../views/common/login.vue'],
    name: 'login',
    meta: { title: '登录' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: commonModules['../views/common/404.vue']
  }
]

const router = createRouter({
  routes: mainRoutes,
  history: createWebHistory('/venus-admin'),
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  const commonState = useCommonStore()
  if (to.name === 'login') {
    return true
  } else {
    if (commonState.token) {
      if (router.options.isDynamic) {
        return true
      } else {
        await commonState.initUserAction()
        const menuList = await commonState.initMenuAction()
        addDynamicRoutes(menuList)
        return {
          ...to,
          replace: true,
          name: undefined
        }
      }
    } else {
      return {
        name: 'login',
        replace: true
      }
    }
  }
})

export const addDynamicRoutes = (routeList = []) => {
  routeList.forEach((item) => {
    if (item.url) {
      const route = {
        path: item.url,
        component:
          dynamicModules[`../views/modules${item.url}.vue`] ||
          commonModules['../views/common/404.vue'],
        name: item.url.replaceAll('/', '-').replace('-', ''),
        meta: {
          id: item.id,
          title: item.name
        }
      }
      router.addRoute('main-dynamic', route)
    }
  })
  router.options.isDynamic = true
}

export default router
