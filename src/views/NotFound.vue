<template>
    <div class="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      <h1 class="display-1 fw-bold text-primary">404</h1>
      <p class="fs-3"> <span class="text-danger">Ôi không!</span> Không tìm thấy trang bạn yêu cầu.</p>
      <p class="lead">
        Có thể URL đã bị sai hoặc trang đã bị xóa.
      </p>
      <router-link to="/" class="btn btn-primary btn-lg mt-3">
        Quay về trang chủ
      </router-link>
    </div>
  </template>
  
  <script>
  </script>
  
  <style scoped>
  /* Thêm hiệu ứng hoặc ảnh nền nếu muốn */
  .container {
    background-color: #f8f9fa;
  }
  </style>
  