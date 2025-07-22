<template>
  <div class="login-page">
    <div class="overlay">
      <div class="login-form">
        <!-- true: đăng nhập, false: đăng ký -->
        <h2 class="text-center mb-4 text-white">
          {{ isLogin ? "Đăng nhập thư viện" : "Đăng ký tài khoản" }} 
        </h2>

        <!-- Đăng nhập -->
        <form v-if="isLogin" @submit.prevent="handleLogin">
          <input v-model="email" type="email" class="form-control mb-3" placeholder="Email" required />
          <input v-model="password" type="password" class="form-control mb-3" placeholder="Mật khẩu" required />
          <button class="btn btn-primary w-100 mb-3">Đăng nhập</button>
        </form>

        <!-- Đăng ký -->
        <form v-else @submit.prevent="handleRegister" enctype="multipart/form-data">
          <input type="file" class="form-control mb-1" @change="handleAvatarChange" accept="image/*" />
          <div class="text-danger mb-2" v-if="errors.avatar">{{ errors.avatar }}</div>

          <input v-model="form.HoLot" type="text" class="form-control mb-1" placeholder="Họ lót" />
          <div class="text-danger mb-2" v-if="errors.HoLot">{{ errors.HoLot }}</div>

          <input v-model="form.Ten" type="text" class="form-control mb-1" placeholder="Tên" />
          <div class="text-danger mb-2" v-if="errors.Ten">{{ errors.Ten }}</div>

          <input v-model="form.email" type="email" class="form-control mb-1" placeholder="Email" />
          <div class="text-danger mb-2" v-if="errors.email">{{ errors.email }}</div>

          <input v-model="form.MatKhau" type="password" class="form-control mb-1" placeholder="Mật khẩu" />
          <div class="text-danger mb-2" v-if="errors.MatKhau">{{ errors.MatKhau }}</div>

          <input v-model="confirmPassword" type="password" class="form-control mb-1" placeholder="Xác nhận mật khẩu" />
          <div class="text-danger mb-2" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>

          <input v-model="form.NgaySinh" type="date" class="form-control mb-1" />
          <div class="text-danger mb-2" v-if="errors.NgaySinh">{{ errors.NgaySinh }}</div>

          <select v-model="form.Phai" class="form-control mb-1">
            <option disabled value="">Giới tính</option>
            <option>Nam</option>
            <option>Nữ</option>
          </select>
          <div class="text-danger mb-2" v-if="errors.Phai">{{ errors.Phai }}</div>

          <input v-model="form.DiaChi" type="text" class="form-control mb-1" placeholder="Địa chỉ" />
          <div class="text-danger mb-2" v-if="errors.DiaChi">{{ errors.DiaChi }}</div>

          <input v-model="form.DienThoai" type="text" class="form-control mb-1" placeholder="Số điện thoại" />
          <div class="text-danger mb-2" v-if="errors.DienThoai">{{ errors.DienThoai }}</div>

          <button class="btn btn-success w-100 mb-3">Đăng ký</button>
        </form>

        <!-- Google -->
        <a
          v-if="isLogin"
          :href="googleLoginUrl"
          class="btn btn-light border d-flex align-items-center justify-content-center gap-2 w-100"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" />
          <span class="fw-bold">Log in with Google</span>
        </a>

        <div class="text-center mt-3">
          <a href="#" class="text-light text-decoration-none" v-if="isLogin">Quên mật khẩu?</a>
          <a href="#" class="text-light text-decoration-none" @click.prevent="isLogin = !isLogin">
            {{ isLogin ? " Đăng ký" : "Đã có tài khoản? Đăng nhập" }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import AuthService from "@/services/auth.service";

const router = useRouter();
const route = useRoute();

const isLogin = ref(true);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const avatar = ref(null);

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

const errors = reactive({
  HoLot: "",
  Ten: "",
  email: "",
  MatKhau: "",
  confirmPassword: "",
  NgaySinh: "",
  Phai: "",
  DiaChi: "",
  DienThoai: "",
  avatar: "",
});

const googleLoginUrl = "http://localhost:3000/api/auth/google";

// Xử lý đăng nhập
const handleLogin = async () => {
  try {
    const res = await AuthService.login({
      email: email.value,
      MatKhau: password.value,
    });

    localStorage.setItem("user", JSON.stringify(res.user));
    const role = res.user.role;
    router.push(role === "reader" ? "/" : "/dashboard");
  } catch (err) {
    console.error(err);

    const msg =
      err.response?.data?.message || err.response?.data || "Sai email hoặc mật khẩu.";

    toast.error(msg);
  }
};

// Xử lý thay đổi ảnh đại diện
const handleAvatarChange = (event) => {
  avatar.value = event.target.files[0];
};

// Xử lý đăng ký
const handleRegister = async () => {
  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  let isValid = true;

  const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/u;
  if (!nameRegex.test(form.HoLot)) {
    errors.HoLot = "Họ lót không hợp lệ!";
    isValid = false;
  }
  if (!nameRegex.test(form.Ten)) {
    errors.Ten = "Tên không hợp lệ!";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = "Email không hợp lệ!";
    isValid = false;
  }

  if (form.MatKhau.length < 6) {
    errors.MatKhau = "Mật khẩu tối thiểu 6 ký tự!";
    isValid = false;
  }

  if (form.MatKhau !== confirmPassword.value) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    isValid = false;
  }

  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(form.DienThoai)) {
    errors.DienThoai = "Số điện thoại không hợp lệ!";
    isValid = false;
  }

  const today = new Date().toISOString().split("T")[0];

  if (!form.NgaySinh) {
    errors.NgaySinh = "Vui lòng nhập ngày sinh!";
    isValid = false;
  } else if (form.NgaySinh > today) {
    errors.NgaySinh = "Ngày sinh không hợp lệ!";
    isValid = false;
  }

  if (!form.Phai) {
    errors.Phai = "Vui lòng chọn giới tính!";
    isValid = false;
  }

  if (!form.DiaChi) {
    errors.DiaChi = "Địa chỉ là bắt buộc!";
    isValid = false;
  }

  if (avatar.value) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(avatar.value.type)) {
      errors.avatar = "Ảnh không hợp lệ (jpg, png)!";
      isValid = false;
    }
    if (avatar.value.size / 1024 / 1024 > 2) {
      errors.avatar = "Ảnh vượt quá 2MB!";
      isValid = false;
    }
  }

  if (!isValid) return;

  try {
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (avatar.value) {
      formData.append("avatar", avatar.value);
    }

    await AuthService.register(formData);
    toast.success("Đăng ký thành công!");
    isLogin.value = true;
  } catch (err) {
    console.error(err);
    errors.email = err.response?.data?.message || "Đăng ký thất bại";
    toast.error(errors.email);
  }
};

onMounted(() => {
  const error = route.query.error;
  if (error) {
    if (error === "vohieuhoa") {
      toast.error("Tài khoản của bạn đã bị vô hiệu hóa!");
    } else if (error === "server") {
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
    }

    // Đợi 3s rồi mới xóa query, để toast có thời gian hiển thị
    setTimeout(() => {
      router.replace({ query: {} });
    }, 3000);
  }
});

</script>

<style scoped>
.login-page {
  background-image: url("/images/tthl.jpeg");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100vw;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

.overlay {
  width: 100%;
  height: 100%;
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
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
}

.text-danger {
  font-size: 0.875rem;
  color: #ffdddd;
  word-wrap: break-word;
}
</style>
