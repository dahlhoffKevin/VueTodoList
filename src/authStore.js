import { createStore } from 'vuex';
import { formatLoginResponse } from './components/helpercode/CommonMethods.js';

export default createStore({
  state: {
    jwtToken: null,
    refreshToken: null,
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
    setRefreshToken(state, refreshToken) {
      console.log(refreshToken);
      state.refreshToken = refreshToken;
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
    updateToken(state, refreshToken, jwtToken) {
      state.refreshToken = refreshToken;
      state.jwtToken = jwtToken;
    },
    clearStore(state) {
      state.userId = null;
      state.userEmail = null;
      state.userFirstname = null;
      state.userLastname = null;
    },
    getCurrentRefreshToken(state) {
      return state.refreshToken;
    },
    getCurrentUserId(state) {
      return state.userId;
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

      //handle login response
      if (response.ok) {
        const formatedResponse = formatLoginResponse(response.text());
        if (!formatedResponse) return null;

        commit('setToken', formatLoginResponse.token.jwt);
        commit('setRefreshToken', formatedResponse.token.refreshToken);
        commit('setExpiration', 1800);
        commit('setUser', formatLoginResponse.user);
        commit('setUsernameAndPassword', username, password );
      } else {
        //todo: analyse thrown error: when refresh token is expired do refreshJwtToken
        throw new Error('Login failed');
      }
    },
    logout({ commit }) {
      commit('clearStore');
    },
    async refreshJwtToken({ commit }) {
      const url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_ENDPOINT_USERS_REFRESH_TOKEN}`;
      const currentRefreshToken = commit('getCurrentRefreshToken');
      const currentUserId = commit('getCurrentUserId');
      const body = { 
        token: currentRefreshToken,
        user: {
          id: currentUserId
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        const responseText = response.text();
        const tokenRefreshResponse = (await responseText).split(',');
        commit('updateToken', tokenRefreshResponse[0], tokenRefreshResponse[1])
      }
    }
  },
});
