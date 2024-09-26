// store.js
import { createStore } from 'vuex'; // Korrektes Importieren von createStore aus Vuex

export default createStore({
  state: {
    jwtToken: null,
    expiration: "",
    userId: "",
    userEmail: "",
    userFirstname: "",
    userLastname: ""
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
    setUser(state, user) {
      state.userId = user.id;
      state.userEmail = user.email;
      state.userFirstname = user.firstname;
      state.userLastname = user.lastname;
    }
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
        const responseText = await response.text();
        const token = responseText.split("},");
        const userObject = JSON.parse(`${token[0]}}`.replace("[", ""));
        commit('setToken', token[1].replace("\"", "").replace("]", ""));
        commit('setExpiration', 1800);
        commit('setUser', userObject);
      } else {
        throw new Error('Login failed');
      }
    },
    logout({ commit }) {
      commit('clearToken');
    },
  },
});
