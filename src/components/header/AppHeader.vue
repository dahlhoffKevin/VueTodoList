<script>
import authStore from '../../authStore.js';
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  props: {},
  setup() {

    const submitLoginRequest = () => {
      authStore.dispatch('clearStore');
    };

    return {
      submitLoginRequest,
      authStore,
    };

  },
});
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Taskitude</a>
      <!-- <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button> -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li> -->
          <li class="nav-item" v-if="authStore.state.userId">
            <a class="nav-link active" aria-current="page" href="#">Archive</a>
          </li>
        </ul>
        <form class="d-flex" role="search" v-if="authStore.state.userId">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
          <button class="btn btn-outline-danger" type="submit" style="margin-left: 8px;" @click="submitLoginRequest">Logout</button>
        </form>
      </div>
    </div>
  </nav>
  <div id="liveAlertPlaceholder"></div>
</template>
