<template>
  <div class="login-page">
    <div class="overlay">
      <div class="login-form">
        <h2 class="text-center mb-4 text-white">Đăng nhập thư viện</h2>

        <!-- Form đăng nhập -->
        <form @submit.prevent="handleLogin">
          <input v-model="email" type="email" class="form-control mb-3" placeholder="Email" required />
          <input v-model="password" type="password" class="form-control mb-3" placeholder="Mật khẩu" required />
          <button class="btn btn-primary w-100 mb-3">Đăng nhập</button>
        </form>

        <!-- Google login -->
        <a
          :href="googleLoginUrl"
          class="btn btn-light border d-flex align-items-center justify-content-center gap-2 w-100"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width="20"
            height="20"
            alt="Google"
          />
          <span class="fw-bold">Log in with Google</span>
        </a>

        <div class="text-center mt-3">
          <a href="#" class="text-light text-decoration-none">Quên mật khẩu?</a>
          <router-link to="/register" class="text-light text-decoration-none"> Đăng ký</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api.service";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await api.post("/auth/login", {
          email: this.email,
          MatKhau: this.password,
        });

        alert("Đăng nhập thành công!");
        // Lưu user nếu cần
        localStorage.setItem("user", JSON.stringify(res.data.user));
        this.$router.push("/");
      } catch (err) {
        console.error(err);
        alert("Sai email hoặc mật khẩu.");
      }
    },
  },
  computed: {
    googleLoginUrl() {
      return "http://localhost:3000/api/auth/google";
    },
  },
};
</script>

<style scoped>
.login-page {
  background-image: url("/images/tthl.jpeg");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}
</style>
