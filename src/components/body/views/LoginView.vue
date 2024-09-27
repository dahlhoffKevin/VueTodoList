<script>
import { dispatchLogin } from "../../helpercode/ApiHelper.js";
import { alertType, displayGlobalAlert } from "../../helpercode/AlertHelper.js";

export default {
  methods: {
    async submitLoginRequest() {
      let loginUserEmail =
        document.getElementById("inputLoginUsername")?.value ?? "";
      let loginUserPassword =
        document.getElementById("inputLoginPassword")?.value ?? "";
      console.log(loginUserEmail, loginUserPassword);
        
      let loginResponse = await dispatchLogin(
        loginUserEmail,
        loginUserPassword
      );
      if (loginResponse) {
        this.$router.push({ name: 'home' });
      } else displayGlobalAlert("Login failed!", alertType.error);
    },
  },
};
</script>

<template>
  <div class="container text-center">
  </div>
  <form
    @submit.prevent="submitLoginRequest"
    style="margin-left: 25%; margin-right: 25%"
  >
    <div class="mb-3">
      <label for="inputLoginUsername" class="form-label">Username</label>
      <input type="text" class="form-control" id="inputLoginUsername" />
    </div>
    <div class="mb-3">
      <label for="inputLoginPassword" class="form-label">Password</label>
      <input type="password" class="form-control" id="inputLoginPassword" />
    </div>
    <div class="mb-3 form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1" />
      <label class="form-check-label" for="exampleCheck1"
        >Keep me logged in</label
      >
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
  </form>
</template>
