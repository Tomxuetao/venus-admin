import { defineStore } from 'pinia'
import { buildTree } from '@/utils'

import { sysMenuListApi } from '@/api/menu-api'
import { addDynamicRoutes } from '@/router'


export const useCommonStore = defineStore('common', {
  state: () => ({
    authListState: [],
    menuListState: [],
    menuTreeState: []
  }),
  getters: {
    authList: (state) => state.authListState.length ? state.authListState : JSON.parse(sessionStorage.getItem('authList')),
    menuList: (state) => state.menuListState.length ? state.menuListState : JSON.parse(sessionStorage.getItem('menuList')),
    menuTree: (state) => state.menuTreeState.length ? state.menuTreeState : JSON.parse(sessionStorage.getItem('menuTree'))
  },
  actions: {
    updateAuthList(list) {
      this.authListState = list
      sessionStorage.setItem('authList', JSON.stringify(list || []))
    },
    updateMenuList(list) {
      this.menuListState = list
      sessionStorage.setItem('menuList', JSON.stringify(list || []))
    },
    updateMenuTree(tree) {
      this.menuTreeState = tree
      sessionStorage.setItem('menuTree', JSON.stringify(tree || []))
    },
    
    async initMenuAction() {
      const menuList = await sysMenuListApi()
      this.updateMenuList(menuList)
      const authList = []
      addDynamicRoutes(menuList)
      const tempMenuList = menuList.map(item => {
        const { id, pid, name, icon, url, type, sort, permissions } = item
        if (permissions){
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
      this.updateMenuTree(buildTree(tempMenuList, '0'))
    }
  }
})


