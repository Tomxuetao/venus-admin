import { buildTree } from '@/utils'
import { defineStore } from 'pinia'
import { commonApi } from '@/api/common-api'

export const useCommonStore = defineStore('common', {
  state: () => ({
    tokenState: '',
    dictMapState: new Map(),
    userDataState: {},
    authListState: [],
    menuListState: [],
    menuTreeState: []
  }),
  getters: {
    token: (state) => state.tokenState || sessionStorage.getItem('token'),
    dictMap: (state) => state.dictMapState,
    userData: (state) => state.userDataState,
    authList: (state) => state.authListState,
    menuList: (state) => state.menuListState,
    menuTree: (state) => state.menuTreeState
  },
  actions: {
    updateToken(token) {
      this.tokenState = token
      if (token) {
        sessionStorage.setItem('token', token)
      } else {
        sessionStorage.removeItem('token')
      }
    },
    updateDictMap(list) {
      const treeList = buildTree(list, '0')
      const dictMap = new Map()
      treeList.forEach((item) => {
        dictMap.set(
          item.value,
          Object.freeze(
            (item.children || [])
              .sort((a, b) => a.sort - b.sort)
              .reduce((acc, cur) => {
                acc.set(+cur.value, cur.label)
                return acc
              }, new Map())
          )
        )
      })
      this.dictMapState = dictMap
    },
    updateUserData(data) {
      this.userDataState = data
    },
    updateAuthList(list) {
      this.authListState = list
    },
    updateMenuList(list) {
      this.menuListState = list
    },
    updateMenuTree(tree) {
      this.menuTreeState = tree
    },

    async initDictAction() {
      const dictList = await commonApi('/sys/dict/list', { status: 1 })
      this.updateDictMap(dictList)
    },

    async initUserAction() {
      const userData = await commonApi('/sys/user/info')
      this.updateUserData(userData)
    },

    async initMenuAction() {
      const menuList = await commonApi('/sys/menu/list')
      if (Array.isArray(menuList)) {
        this.updateMenuList(menuList)
        const authList = []
        const tempMenuList = menuList.map((item) => {
          const { id, pid, name, icon, url, type, sort, permissions } = item
          if (permissions) {
            authList.push(...permissions.split(','))
          }
          return {
            id: id,
            pid: pid,
            text: name,
            icon: icon,
            url: url,
            sort: sort,
            children: [],
            isMenu: type === 0
          }
        })
        this.updateAuthList(authList)
        this.updateMenuTree(buildTree([...tempMenuList], '0'))
        return menuList.filter((item) => item.url)
      }
      return []
    }
  }
})
