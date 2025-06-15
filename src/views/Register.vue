<!-- src/views/Register.vue -->
<template>
    <div class="register-page">
      <div class="overlay">
        <div class="register-form">
          <h2 class="text-center mb-4 text-white">Đăng ký tài khoản</h2>
  
          <form @submit.prevent="handleRegister">
            <input type="file" class="form-control mb-3" @change="handleAvatarChange" accept="image/*" />
            <input v-model="form.HoLot" type="text" class="form-control mb-3" placeholder="Họ lót" required />
            <input v-model="form.Ten" type="text" class="form-control mb-3" placeholder="Tên" required />
            <input v-model="form.email" type="email" class="form-control mb-3" placeholder="Email" required />
            <input v-model="form.MatKhau" type="password" class="form-control mb-3" placeholder="Mật khẩu" required />
            <input v-model="confirmPassword" type="password" class="form-control mb-3" placeholder="Xác nhận mật khẩu" required />
            <input v-model="form.NgaySinh" type="date" class="form-control mb-3" required />
            <select v-model="form.Phai" class="form-control mb-3" required>
              <option disabled value="">Chọn phái</option>
              <option>Nam</option>
              <option>Nữ</option>
            </select>
            <input v-model="form.DiaChi" type="text" class="form-control mb-3" placeholder="Địa chỉ" required />
            <input v-model="form.DienThoai" type="text" class="form-control mb-3" placeholder="Số điện thoại" required />
  
            <button class="btn btn-success w-100 mb-3">Đăng ký</button>
          </form>
  
          <div class="text-center mt-3">
            <router-link to="/login" class="text-light text-decoration-none">Đã có tài khoản? Đăng nhập</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from "vue";
  import { useRouter } from "vue-router";
  import api from "@/services/api.service";
  
  const router = useRouter();
  
  const form = reactive({
    HoLot: "",
    Ten: "",
    email: "",
    MatKhau: "",
    NgaySinh: "",
    Phai: "",
    DiaChi: "",
    DienThoai: "",
  });
  
  const confirmPassword = ref("");
  const avatar = ref(null); // lưu file ảnh
  
  const handleAvatarChange = (event) => {
    avatar.value = event.target.files[0];
  };
  
  const handleRegister = async () => {
    if (form.MatKhau !== confirmPassword.value) {
      alert("❌ Mật khẩu xác nhận không khớp!");
      return;
    }
  
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
  
      if (avatar.value) {
        formData.append("avatar", avatar.value);
      }
  
      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("✅ Đăng ký thành công!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Đăng ký thất bại: " + (err.response?.data?.message || "Lỗi không xác định"));
    }
  };
  </script>
  
  
  <style scoped>
  .register-page {
    background-image: url("/images/tthl.jpeg");
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .register-form {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 30px;
    width: 100%;
    max-width: 450px;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }
  </style>
  