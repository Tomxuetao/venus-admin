import { defineStore } from 'pinia';
import { buildTree } from '@/utils';

import { sysMenuListApi } from '@/api/menu-api';
import { sysUserDataApi } from '@/api/login-api';

export const useCommonStore = defineStore('common', {
  state: () => ({
    tokenState: '',
    userDataState: {},
    authListState: [],
    menuListState: [],
    menuTreeState: [],
  }),
  getters: {
    token: (state) => state.tokenState || sessionStorage.getItem('token'),
    authList: (state) => state.authListState,
    menuList: (state) => state.menuListState,
    menuTree: (state) => state.menuTreeState,
  },
  actions: {
    updateToken(token) {
      this.tokenState = token;
      sessionStorage.setItem('token', token);
    },
    updateUserData(data) {
      this.userDataState = data;
    },
    updateAuthList(list) {
      this.authListState = list;
    },
    updateMenuList(list) {
      this.menuListState = list;
    },
    updateMenuTree(tree) {
      this.menuTreeState = tree;
    },

    async initUserAction() {
      const userData = await sysUserDataApi();
      this.updateUserData(userData);
    },

    async initMenuAction() {
      const menuList = await sysMenuListApi();
      if (Array.isArray(menuList)) {
        this.updateMenuList(menuList);
        const authList = [];
        const tempMenuList = menuList.map((item) => {
          const { id, pid, name, icon, url, type, sort, permissions } = item;
          if (permissions) {
            authList.push(...permissions.split(','));
          }

          return {
            id: id,
            pid: pid,
            text: name,
            icon: icon,
            url: url,
            sort: sort,
            children: [],
            isMenu: type === 0,
          };
        });
        this.updateAuthList(authList);
        this.updateMenuTree(buildTree(tempMenuList, '0'));
        return menuList;
      }
      return [];
    },
  },
});
