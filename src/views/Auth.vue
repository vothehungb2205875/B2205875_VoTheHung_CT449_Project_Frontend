<template>
    <div class="login-page">
      <div class="overlay">
        <div class="login-form">
          <h2 class="text-center mb-4 text-white">
            {{ isLogin ? "Đăng nhập thư viện" : "Đăng ký tài khoản" }}
          </h2>
  
          <!-- 👇 Chuyển giữa hai form -->
          <form v-if="isLogin" @submit.prevent="handleLogin">
            <input v-model="email" type="email" class="form-control mb-3" placeholder="Email" required />
            <input v-model="password" type="password" class="form-control mb-3" placeholder="Mật khẩu" required />
            <button class="btn btn-primary w-100 mb-3">Đăng nhập</button>
          </form>
  
          <form v-else @submit.prevent="handleRegister" enctype="multipart/form-data">
            <input type="file" name="avatar" class="form-control mb-3" @change="handleAvatarChange" accept="image/*" />
            <input v-model="form.HoLot" type="text" class="form-control mb-3" placeholder="Họ lót" required />
            <input v-model="form.Ten" type="text" class="form-control mb-3" placeholder="Tên" required />
            <input v-model="form.email" type="email" class="form-control mb-3" placeholder="Email" required />
            <input v-model="form.MatKhau" type="password" class="form-control mb-3" placeholder="Mật khẩu" required />
            <input v-model="confirmPassword" type="password" class="form-control mb-3" placeholder="Xác nhận mật khẩu" required />
            <input v-model="form.NgaySinh" type="date" class="form-control mb-3" required />
            <select v-model="form.Phai" class="form-control mb-3" required>
              <option disabled value="">Giới tính</option>
              <option>Nam</option>
              <option>Nữ</option>
            </select>
            <input v-model="form.DiaChi" type="text" class="form-control mb-3" placeholder="Địa chỉ" required />
            <input v-model="form.DienThoai" type="text" class="form-control mb-3" placeholder="Số điện thoại" required />
            <button class="btn btn-success w-100 mb-3">Đăng ký</button>
          </form>
  
          <!-- Google login -->
          <a
            v-if="isLogin"
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
            <a href="#" class="text-light text-decoration-none" v-if="isLogin">Quên mật khẩu?</a>
            <a href="#" class="text-light text-decoration-none" @click="isLogin = !isLogin">
              {{ isLogin ? " Đăng ký" : "Đã có tài khoản? Đăng nhập" }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AuthService from "@/services/auth.service";
  
  export default {
    data() {
      return {
        isLogin: true,
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null,
        form: {
          HoLot: "",
          Ten: "",
          email: "",
          MatKhau: "",
          NgaySinh: "",
          Phai: "",
          DiaChi: "",
          DienThoai: "",
        },
      };
    },
    computed: {
      googleLoginUrl() {
        return "http://localhost:3000/api/auth/google";
      },
    },
    methods: {
      async handleLogin() {
        try {
          const res = await AuthService.login({
            email: this.email,
            MatKhau: this.password,
          });
  
          alert("Đăng nhập thành công!");
          localStorage.setItem("user", JSON.stringify(res.user));
  
          const role = res.user.role;
          this.$router.push(role === "reader" ? "/" : "/dashboard");
        } catch (err) {
          console.error(err);
          alert("Sai email hoặc mật khẩu.");
        }
      },
  
      handleAvatarChange(event) {
        const file = event.target.files[0];
        console.log("Chọn avatar:", file?.name); // để kiểm tra trong console
        this.avatar = file;
      },
  
      async handleRegister() {
        if (this.form.MatKhau !== this.confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
        }
  
        try {
          const formData = new FormData();
          for (const key in this.form) {
            formData.append(key, this.form[key]);
          }
          if (this.avatar) {
            formData.append("avatar", this.avatar ?? "");
          }
  
          await AuthService.register(formData);
  
          alert("Đăng ký thành công!");
          this.isLogin = true;
        } catch (err) {
          console.error(err);
          alert("Đăng ký thất bại: " + (err.response?.data?.message || "Lỗi không xác định"));
        }
      },
    },
  };
  </script>
  
  
<style scoped>
.login-page {
  background-image: url("/images/tthl.jpeg");
  background-size: cover;
  background-position: center;
  height: 100vh; /* CHỈNH từ min-height → height */
  width: 100vw;
  overflow: hidden; /* Ngăn scroll gây nhảy */
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  width: 100%;
  height: 100%; /* đảm bảo chiếm đủ toàn bộ .login-page */
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  max-height: 90vh; /* hạn chế chiều cao */
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
}


</style>
  