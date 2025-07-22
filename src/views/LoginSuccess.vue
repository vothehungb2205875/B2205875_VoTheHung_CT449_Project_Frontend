<!-- 5 -->
<template>
  <div class="login-success d-flex flex-column align-items-center justify-content-center vh-100">
    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner"></div>
      <h3 class="mt-3">Đang đăng nhập...</h3>
    </div>

    <!-- Lỗi -->
    <div v-else-if="error" class="text-center text-danger">
      <h3>Đăng nhập thất bại:</h3>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AuthService from "@/services/auth.service";

const loading = ref(true);
const error = ref(null);
const router = useRouter();

onMounted(async () => {
  try {
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      router.push("/");
      return;
    }

    const user = await AuthService.getCurrentUser();
    localStorage.setItem("user", JSON.stringify(user));
    router.push("/");
  } catch (err) {
    error.value = err.message || "Đã xảy ra lỗi không xác định.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.login-success {
  text-align: center;
  padding-top: 100px;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #007bff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
