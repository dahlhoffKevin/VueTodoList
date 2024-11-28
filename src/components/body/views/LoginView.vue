<script>
import { dispatchLogin } from "../../helpercode/ApiHelper.js";
import { alertType, displayGlobalAlert } from "../../helpercode/AlertHelper.js";

export default {
  data() {
    return {
      loginUserUsername: "",
      loginUserPassword: "",
      isFormValidated: false,
    };
  },
  methods: {
    validateForm() {
      this.isFormValidated = true;
      // Trigger Bootstrap's custom validation feedback
      const form = this.$refs.registrationForm;
      if (form.checkValidity() === false) {
        return false;
      }
      return true;
    },
    async submitLoginRequest() {
      let loginUserEmail =
        document.getElementById("inputLoginUsername")?.value ?? "";
      let loginUserPassword =
        document.getElementById("inputLoginPassword")?.value ?? "";
        
      let loginResponse = await dispatchLogin(
        loginUserEmail,
        loginUserPassword
      );
      if (loginResponse) {
        this.$router.push({ name: 'home' });
      } else {
        console.log(loginResponse);
        alert("unauthorized!");
        displayGlobalAlert("Username or password is incorrect!", alertType.error);
      }
    },
    redirectToRegistration() {
      this.$router.push({ name: 'register' });
    },
    forgotPassword() {
      displayGlobalAlert("Not yet implemented!", alertType.warning);
    }
  },
};
</script>

<template>
  <main class="container" style="margin-top: 5%;">
    <div class="d-flex justify-content-center align-items-center">
      <div class="col-md-4">
        <div class="card p-4 shadow-lg">
          <h2 class="text-center mb-4">Login</h2>
          <form
            @submit.prevent="submitLoginRequest">
            <div class="mb-3">
              <label for="inputLoginUsername" class="form-label">Username</label>
              <input type="text" class="form-control" id="inputLoginUsername" placeholder="Enter your username" required>
            </div>
            <div class="mb-3">
              <label for="inputLoginPassword" class="form-label">Password</label>
              <input
                type="password"
                class="form-control rounded"
                id="inputLoginPassword"
                placeholder="Enter your password"
                spellcheck="false"
                autocorrect="off"
                autocapitalize="off"
                name="current-password"
                autocomplete="current-password"
                required>
              <button id="toggle-password" type="button" class="d-none"
                aria-label="Show password as plain text. Warning: this will display your password on the screen.">
              </button>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe">
              <label class="form-check-label" for="rememberMe">Remember me</label>
            </div>
            <div class="mb-3 d-grid">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
            <div class="d-grid">
              <button type="button" class="btn btn-outline-primary" @click="redirectToRegistration">New to Taskitude? Register now</button>
            </div>
          </form>
          <div class="text-center mt-3">
            <a href="#" style="text-decoration: none;" @click="forgotPassword">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
