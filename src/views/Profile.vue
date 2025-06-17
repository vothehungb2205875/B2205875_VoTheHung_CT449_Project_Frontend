<template>
  <div class="page-layout">
    <main class="flex-fill py-5">
      <div class="container">
        <h2 class="mb-4 fw-bold text-center">👤 Thông tin cá nhân</h2>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3">Đang tải thông tin cá nhân...</p>
        </div>

        <template v-else>
          <div v-if="user && !editing" class="card shadow-sm p-4 mx-auto" style="max-width: 700px">
            <div class="d-flex align-items-center gap-4 mb-4">
              <img
                :src="getAvatarUrl(user.avatar)"
                alt="Avatar"
                class="rounded-circle border"
                width="100"
                height="100"
                style="object-fit: cover"
                @error="handleImageError"
              />
              <div>
                <h4 class="mb-1">{{ user.name }}</h4>
                <p class="text-muted mb-0">{{ user.email }}</p>
              </div>
            </div>

            <div class="mb-3">
              <p><strong>Mã độc giả:</strong> {{ user.MaDocGia || "Chưa có" }}</p>
              <p><strong>Họ tên:</strong> {{ user.HoLot }} {{ user.Ten }}</p>
              <p><strong>Ngày sinh:</strong> {{ user.NgaySinh || "Chưa cập nhật" }}</p>
              <p><strong>Phái:</strong> {{ user.Phai }}</p>
              <p><strong>Địa chỉ:</strong> {{ user.DiaChi }}</p>
              <p><strong>Điện thoại:</strong> {{ user.DienThoai }}</p>
            </div>

            <button class="btn btn-outline-primary w-100" @click="editing = true">
              ✏️ Cập nhật hồ sơ
            </button>
          </div>

          <!-- Form chỉnh sửa -->
          <div v-else-if="editing" class="card shadow-sm p-4 mx-auto" style="max-width: 700px">
            <h5 class="mb-3">Cập nhật thông tin cá nhân</h5>
            <form @submit.prevent="updateProfile">
              <div class="mb-3" v-for="(label, key) in fields" :key="key">
                <label class="form-label">{{ label }}</label>
                <input
                  v-if="key !== 'Phai'"
                  :type="key === 'NgaySinh' ? 'date' : key === 'email' ? 'email' : 'text'"
                  v-model="editData[key]"
                  class="form-control"
                  :disabled="key === 'email'"
                />
                <select v-else v-model="editData[key]" class="form-select">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-success">💾 Lưu thay đổi</button>
                <button type="button" class="btn btn-secondary" @click="editing = false">❌ Hủy</button>
              </div>
            </form>
          </div>

          <div v-else class="alert alert-warning text-center">
            Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ReaderService from "@/services/reader.service";

const router = useRouter();

const loading = ref(true);
const editing = ref(false);
const user = ref(null);
const editData = ref({});

const fields = {
  HoLot: "Họ lót",
  Ten: "Tên",
  NgaySinh: "Ngày sinh",
  Phai: "Phái",
  DiaChi: "Địa chỉ",
  DienThoai: "Điện thoại",
  name: "Tên hiển thị",
  email: "Email",
};

onMounted(async () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const res = await ReaderService.getReaderById(parsedUser._id); // gọi API để lấy bản đầy đủ

    user.value = res.document || res; // tuỳ theo backend trả về
    editData.value = { ...user.value };
  } catch (err) {
    console.error("Không thể lấy thông tin người dùng:", err);
  } finally {
    loading.value = false;
  }
});

function getAvatarUrl(path) {
  if (!path) return "/uploads/default.jpg";
  return /^https?:\/\//.test(path) ? path : `http://localhost:3000${path}`;
}

function handleImageError(e) {
  e.target.src = "/uploads/default.jpg";
}

async function updateProfile() {
  try {
    const res = await ReaderService.updateReader(user.value._id, editData.value);
    user.value = res.document;
    localStorage.setItem("user", JSON.stringify(user.value));
    editing.value = false;
    alert("Cập nhật thành công!");
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    alert("Cập nhật thất bại.");
  }
}
</script>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  background-color: #f8f9fa;
}
</style>
