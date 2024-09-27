import { createStore } from 'vuex';

export default createStore({
  state: {
    jwtToken: null,
    expiration: null,
    userId: null,
    userUsername: null,
    userPassword: null,
    userEmail: null,
    userFirstname: null,
    userLastname: null
  },
  mutations: {
    setToken(state, token) {
      state.jwtToken = token;
    },
    setExpiration(state, expiration) {
      state.expiration = expiration
    },
    setUser(state, user) {
      state.userId = user.id;
      state.userEmail = user.email;
      state.userFirstname = user.firstname;
      state.userLastname = user.lastname;
    },
    setUsernameAndPassword(state, username, password) {
      state.userUsername = username;
      state.userPassword = password;
    },
    clearStore(state) {
      state.userId = null;
      state.userEmail = null;
      state.userFirstname = null;
      state.userLastname = null;
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
        commit('setUsernameAndPassword', username, password );
      } else {
        throw new Error('Login failed');
      }
    },
    logout({ commit }) {
      commit('clearStore');
    },
  },
});
