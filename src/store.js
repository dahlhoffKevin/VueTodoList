// store.js
import { createStore } from 'vuex'; // Korrektes Importieren von createStore aus Vuex

export default createStore({
  state: {
    jwtToken: null,
    expiration: ""
  },
  mutations: {
    setToken(state, token) {
      state.jwtToken = token;
    },
    setExpiration(state, expiration) {
      state.expiration = expiration
    },
    clearToken(state) {
      state.jwtToken = null;
    },
  },
  actions: {
    async login({ commit }, { username, password }) {
      const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_USERS_LOGIN}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = await response.text();
        commit('setToken', token);
        commit('setExpiration', 1800);
      } else {
        throw new Error('Login failed');
      }
    },
    logout({ commit }) {
      commit('clearToken');
    },
  },
});
