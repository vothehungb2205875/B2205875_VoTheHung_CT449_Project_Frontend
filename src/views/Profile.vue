<template>
  <div class="page-layout">
    <main class="flex-fill py-5">
      <div class="container">
        <h2 class="mb-4 fw-bold text-center">Thông tin cá nhân</h2>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3">Đang tải thông tin cá nhân...</p>
        </div>

        <template v-else>
          <!-- Không tìm thấy user -->
          <div v-if="!user" class="alert alert-warning text-center">
            Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.
          </div>

          <!-- Đang chỉnh sửa -->
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
                <button type="submit" class="btn btn-success">Lưu thay đổi</button>
                <button type="button" class="btn btn-secondary" @click="editing = false">Hủy</button>
              </div>
            </form>
          </div>

          <!-- Giao diện 2 cột -->
          <div v-else class="row g-4">
            <!-- Cột trái: Thông tin -->
            <div class="col-md-6">
              <div class="card shadow-sm p-4 h-100">
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
                  <p><strong>Họ tên:</strong> {{ user.HoLot }} {{ user.Ten }}</p>
                  <p><strong>Ngày sinh:</strong> {{ user.NgaySinh || "Chưa cập nhật" }}</p>
                  <p><strong>Giới tính:</strong> {{ user.Phai }}</p>
                  <p><strong>Địa chỉ:</strong> {{ user.DiaChi }}</p>
                  <p><strong>Điện thoại:</strong> {{ user.DienThoai }}</p>
                </div>

                <button class="btn btn-outline-primary w-100" @click="editing = true">
                  Cập nhật hồ sơ
                </button>
              </div>
            </div>

            <!-- Cột phải: Lịch sử mượn sách -->
            <div class="col-md-6">
              <div class="card shadow-sm p-4 h-100 d-flex flex-column">
                <button class="btn btn-outline-success w-100 mb-3" @click="showHistory = !showHistory">
                   {{ showHistory ? 'Ẩn' : 'Xem' }} lịch sử mượn sách
                </button>

                <div v-if="showHistory" class="borrow-history-scroll flex-grow-1">
                  <div v-if="borrowHistory.length">
                    <ul class="list-group">
                      <li
                        v-for="item in borrowHistory"
                        :key="item._id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{{ item.bookTitle || 'Không rõ' }}</strong><br />
                          <small>Mượn ngày: {{ formatDate(item.NgayMuon) }}</small><br />
                          <small>Hạn trả: {{ formatDate(item.NgayTra) }}</small>
                        </div>
                        <span class="badge bg-secondary">
                          {{ item.TrangThai || (item.NgayTra ? "Đã trả" : "Chưa trả") }}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div v-else class="text-muted">Không có lịch sử mượn sách.</div>
                </div>
              </div>
            </div>
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
import authService from "@/services/auth.service";
import BorrowService from "@/services/borrow.service";

const router = useRouter();

const loading = ref(true);
const editing = ref(false);
const user = ref(null);
const editData = ref({});
const showHistory = ref(false);
const borrowHistory = ref([]);

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

    const res = await authService.getCurrentUser();
    user.value = await ReaderService.getReaderById(res._id);
    editData.value = { ...user.value };

    // Lấy lịch sử mượn (đã bao gồm tên sách từ backend)
    borrowHistory.value = await BorrowService.history(user.value.MaDocGia);
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

function formatDate(dateStr) {
  if (!dateStr) return "Chưa có";
  const date = new Date(dateStr);
  return !isNaN(date) ? date.toLocaleDateString("vi-VN") : "Không hợp lệ";
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

.borrow-history-scroll {
  max-height: 320px; /* tương đương 5 item */
  overflow-y: auto;
  padding-right: 4px;
}

.borrow-history-scroll::-webkit-scrollbar {
  width: 6px;
}
.borrow-history-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
