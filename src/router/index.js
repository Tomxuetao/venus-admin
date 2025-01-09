import { useCommonStore } from '@/store'
import { commonApi } from '@/api/common-api'
import { createEventSource } from '@/utils/emitter'
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
      const { menuTree } = useCommonStore()
      if (to.name === 'main-dynamic') {
        next({
          replace: true,
          path: menuTree[0].children[0].url
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
        commonApi('/checkToken', {}, { method: 'post' })
          .then(() => {
            return true
          })
          .catch(() => {
            return false
          })
        return true
      } else {
        await commonState.initUserAction()
        await commonState.initDictAction()
        addDynamicRoutes(commonState.menuList.filter((item) => item.url))
        createEventSource(
          `/event-stream/sys/sse/create?token=${commonState.token}`
        )
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
        path: item.type === 0 ? `${item.url}` : `${item.url}/:id`,
        name: item.url.replaceAll('/', '-').replace('-', ''),
        component:
          dynamicModules[`../views/modules${item.url}.vue`] ||
          commonModules['../views/common/404.vue'],
        meta: {
          id: item.id,
          pid: item.pid,
          title: item.name,
          isMenu: item.type === 0
        },
        props: (route) => ({ ...route.query })
      }
      router.addRoute('main-dynamic', route)
    }
  })
  router.options.isDynamic = true
}

export default router
