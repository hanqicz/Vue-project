import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    permisosUsuarios: []
  },
  mutations: {
    setPermisosUsuarios(state, item) {
      state.permisosUsuarios = item.permisos;
    }
  },
  actions: {},
  modules: {}
});
