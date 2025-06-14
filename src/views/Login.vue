<template>
    <div>
      <h2>Đăng nhập thư viện</h2>
      <a :href="googleLoginUrl">
        <button>Đăng nhập với Google</button>
      </a>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      googleLoginUrl() {
        return "http://localhost:3000/api/auth/google";
      }
    }
  };
  </script>
  