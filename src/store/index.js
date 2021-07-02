import { createStore } from 'vuex'
import common from './modules/common'
import user from './modules/user'

export default createStore({
  modules: {
    common,
    user
  }
})
