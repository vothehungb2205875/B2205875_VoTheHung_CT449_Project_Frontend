<template>
    <div>
      <h1>Dash Board</h1>
    </div>
  </template>
  
  <script>
  export default {
    created() {
      const user = JSON.parse(localStorage.getItem("user"));
  
      // Nếu chưa đăng nhập hoặc không phải nhân viên
      if (!user || user.role !== "staff") {
        this.$router.push("/"); // Chuyển về trang chủ
      }
    }
  };
  </script>
  