<template>
  <div class="login-success">
    <h1 v-if="loading">Đang đăng nhập...</h1>
    <h1 v-else-if="error">Đăng nhập thất bại: {{ error }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      error: null,
    };
  },
  async mounted() {
    try {
      // Gửi request để xác thực bằng cookie đã lưu
      const res = await fetch("http://localhost:3000/api/auth/me", {
        credentials: "include",
      });


      if (!res.ok) throw new Error("Không xác thực được người dùng.");

      const user = await res.json();

      // Có thể lưu user vào localStorage hoặc Vuex
      localStorage.setItem("user", JSON.stringify(user));

      this.$router.push("/");
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>
