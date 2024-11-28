<script>
import { dispatchRegistration } from "../../helpercode/ApiHelper.js";
import { alertType, displayGlobalAlert } from "../../helpercode/AlertHelper.js";

export default {
  data() {
    return {
      registerUserFirstname: "",
      registerUserLastname: "",
      registerUserEmail: "",
      registerUserUsername: "",
      registerUserPassword: "",
      registerUserConfirmPassword: "",
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
    async submitRegisterRequest() {
      if (!this.validateForm()) {
        return;
      }

      if (this.registerUserPassword !== this.registerUserConfirmPassword) {
        displayGlobalAlert('Passwords not metching!', alertType.error);
        return;
      }

      let registrationResponse = await dispatchRegistration(
        this.registerUserFirstname,
        this.registerUserLastname,
        this.registerUserEmail,
        this.registerUserUsername,
        this.registerUserPassword
      );
      if (registrationResponse) {
        displayGlobalAlert('Registered successfully!', alertType.success);
        this.$router.push({ name: 'login' });
      } else {
        displayGlobalAlert('Register failed!', alertType.error);
      }
    },
    redirectToLogin() {
      this.$router.push({ name: 'login' });
    },
  },
};
</script>

<template>
  <main class="container">
    <div class="d-flex justify-content-center align-items-center">
      <div class="col-md-4">
        <div class="card p-4 shadow-lg">
          <h2 class="text-center mb-4">Register</h2>
          <form ref="registrationForm"
            @submit.prevent="submitLoginRequest">
            <div class="mb-3">
              <label for="registerUserFirstname" class="form-label">Firstname</label>
              <input type="text" class="form-control" id="registerUserFirstname" placeholder="Enter your firstname" required>
            </div>
            <div class="mb-3">
              <label for="registerUserLastname" class="form-label">Lastname</label>
              <input type="text" class="form-control" id="registerUserLastname" placeholder="Enter your lastname" required>
            </div>
            <div class="mb-3">
              <label for="registerUserEmail" class="form-label">E-Mail Adress</label>
              <input type="text" class="form-control" id="registerUserEmail" placeholder="Enter your e-mail adress" required>
            </div>
            <div class="mb-3">
              <label for="registerUserUsername" class="form-label">Username</label>
              <input type="text" class="form-control" id="registerUserUsername" placeholder="Enter your username" required>
            </div>
            <div class="mb-3">
              <label for="registerUserPassword" class="form-label">Password</label>
              <input type="password" class="form-control rounded" id="registerUserPassword" placeholder="Enter your password" required>
            </div>
            <div class="mb-3">
              <label for="registerUserConfirmPassword" class="form-label">Confirm Password</label>
              <input type="password" class="form-control rounded" id="registerUserConfirmPassword" placeholder="Enter confirm your password" required>
            </div>
            <div class="mb-3 d-grid">
              <button type="submit" class="btn btn-primary" @click="submitRegisterRequest">Register</button>
            </div>
            <div class="d-grid">
              <button type="button" class="btn btn-outline-primary" @click="redirectToLogin">Return to login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
