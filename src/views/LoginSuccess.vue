<template>
    <div class="container text-center mt-5">
      <h2>Đăng nhập thành công! Chuyển hướng...</h2>
    </div>
  </template>
  
<script setup>
  import { useRoute, useRouter } from "vue-router";
  import { onMounted } from "vue";
  
  const route = useRoute();
  const router = useRouter();
  
  onMounted(() => {
    const token = route.query.token;
    if (token) {
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded payload:", payload); // kiểm tra có avatar không

      localStorage.setItem("user", JSON.stringify(payload));

      router.push("/"); // Chuyển về trang chủ
    }
  });
</script>
  