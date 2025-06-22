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
          <div v-if="!user" class="alert alert-warning text-center">
            Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.
          </div>

          <div v-else-if="editing" class="card shadow-sm p-4 mx-auto" style="max-width: 700px">
            <h5 class="mb-3">Cập nhật thông tin cá nhân</h5>
            <form @submit.prevent="updateProfile">
              <div class="text-center mb-3">
                <img
                  :src="previewAvatarUrl || getAvatarUrl(editData.avatar)"
                  alt="Preview"
                  class="rounded-circle border"
                  width="100"
                  height="100"
                  style="object-fit: cover"
                  @error="handleImageError"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Ảnh đại diện</label>
                <input
                  type="file"
                  class="form-control"
                  accept="image/*"
                  @change="handleAvatarChange"
                />
                <div class="text-danger mt-1" v-if="profileErrors.avatar">{{ profileErrors.avatar }}</div>
              </div>

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
                <div class="text-danger mt-1" v-if="profileErrors[key]">{{ profileErrors[key] }}</div>
              </div>

              <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-success">Lưu thay đổi</button>
                <button type="button" class="btn btn-secondary" @click="cancelEdit">Hủy</button>
              </div>
            </form>
          </div>

          <div v-else class="row g-4">
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
                  <p><strong>Ngày sinh:</strong> {{ formatDate(user.NgaySinh) }}</p>
                  <p><strong>Giới tính:</strong> {{ user.Phai }}</p>
                  <p><strong>Địa chỉ:</strong> {{ user.DiaChi }}</p>
                  <p><strong>Điện thoại:</strong> {{ user.DienThoai }}</p>
                </div>

                <button class="btn btn-outline-primary w-100" @click="editing = true">
                  Cập nhật hồ sơ
                </button>
              </div>
            </div>

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
                        class="list-group-item d-flex justify-content-between align-items-start"
                      >
                        <div>
                          <strong>{{ item.bookTitle || 'Không rõ' }}</strong><br />
                          <small>Mượn ngày: {{ formatDate(item.NgayMuon) }}</small><br />
                          <small>Hạn trả: {{ formatDate(item.NgayTra) }}</small>
                        </div>
                        <div class="text-end">
                          <span :class="statusClass(item)" class="mb-2 d-inline-block">
                            {{ item.TrangThai }}
                          </span>
                          <button
                            v-if="item.TrangThai === 'Đang mượn'"
                            @click="cancelBorrow(item)"
                            class="btn btn-sm btn-outline-danger d-block mt-2"
                          >
                            Hủy
                          </button>
                        </div>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReaderService from '@/services/reader.service';
import authService from '@/services/auth.service';
import BorrowService from '@/services/borrow.service';

const router = useRouter();
const loading = ref(true);
const editing = ref(false);
const user = ref(null);
const editData = ref({});
const showHistory = ref(false);
const borrowHistory = ref([]);
const selectedAvatarFile = ref(null);
const previewAvatarUrl = ref(null);

const profileErrors = reactive({
  HoLot: '', Ten: '', NgaySinh: '', Phai: '', DiaChi: '', DienThoai: '', avatar: ''
});

const fields = {
  HoLot: 'Họ lót', Ten: 'Tên', NgaySinh: 'Ngày sinh', Phai: 'Phái',
  DiaChi: 'Địa chỉ', DienThoai: 'Điện thoại', name: 'Tên hiển thị', email: 'Email'
};

onMounted(async () => {
  try {
    const res = await authService.getCurrentUser();
    user.value = await ReaderService.getReaderById(res._id);
    editData.value = { ...user.value };
    borrowHistory.value = await BorrowService.history(user.value.MaDocGia);
  } catch (err) {
    console.error('Không thể lấy thông tin người dùng:', err);
    router.push('/login');
  } finally {
    loading.value = false;
  }
});

function getAvatarUrl(path) {
  if (!path) return '/uploads/default.jpg';
  return /^https?:\/\//.test(path) ? path : `http://localhost:3000/${path}`;
}

function handleImageError(e) {
  e.target.src = '/uploads/default.jpg';
}

function handleAvatarChange(e) {
  const file = e.target.files[0];
  if (file) {
    selectedAvatarFile.value = file;
    previewAvatarUrl.value = URL.createObjectURL(file);
  }
}

function resetPreview() {
  if (previewAvatarUrl.value) {
    URL.revokeObjectURL(previewAvatarUrl.value);
    previewAvatarUrl.value = null;
  }
}

function cancelEdit() {
  editing.value = false;
  resetPreview();
}

async function updateProfile() {
  Object.keys(profileErrors).forEach(key => profileErrors[key] = '');
  let isValid = true;

  const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/u;
  if (!nameRegex.test(editData.value.HoLot)) {
    profileErrors.HoLot = 'Họ lót không hợp lệ!'; isValid = false;
  }
  if (!nameRegex.test(editData.value.Ten)) {
    profileErrors.Ten = 'Tên không hợp lệ!'; isValid = false;
  }

  const phoneRegex = /^[0-9]{9,11}$/;
  if (!phoneRegex.test(editData.value.DienThoai)) {
    profileErrors.DienThoai = 'Số điện thoại không hợp lệ!'; isValid = false;
  }

  const today = new Date().toISOString().split('T')[0];
  if (editData.value.NgaySinh > today) {
    profileErrors.NgaySinh = 'Ngày sinh không hợp lệ!'; isValid = false;
  }

  if (!editData.value.Phai) {
    profileErrors.Phai = 'Vui lòng chọn giới tính!'; isValid = false;
  }

  if (!editData.value.DiaChi) {
    profileErrors.DiaChi = 'Địa chỉ không được để trống!'; isValid = false;
  }

  if (selectedAvatarFile.value) {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(selectedAvatarFile.value.type)) {
      profileErrors.avatar = 'Ảnh không hợp lệ (jpg, png)!'; isValid = false;
    }
    if (selectedAvatarFile.value.size / 1024 / 1024 > 2) {
      profileErrors.avatar = 'Ảnh vượt quá 2MB!'; isValid = false;
    }
  }

  if (!isValid) return;

  try {
    const formData = new FormData();
    for (const key in editData.value) {
      formData.append(key, editData.value[key]);
    }
    if (selectedAvatarFile.value) {
      formData.append('avatar', selectedAvatarFile.value);
    }

    await ReaderService.update(user.value._id, formData);
    const updatedUser = await ReaderService.getReaderById(user.value._id);
    user.value = updatedUser;
    editData.value = { ...updatedUser };
    localStorage.setItem('user', JSON.stringify(user.value));
    editing.value = false;
    resetPreview();
    alert('Cập nhật thành công!');
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    alert('Cập nhật thất bại.');
  }
}

function formatDate(dateStr) {
  if (!dateStr) return 'Chưa có';
  const date = new Date(dateStr);
  return !isNaN(date) ? date.toLocaleDateString('vi-VN') : 'Không hợp lệ';
}

function statusClass(item) {
  return {
    'Chưa trả': 'badge bg-secondary',
    'Đã trả': 'badge bg-success',
    'Đã hủy': 'badge bg-danger',
    'Đang mượn': 'badge bg-primary',
    'Quá hạn': 'badge bg-danger blinking'
  }[item.TrangThai] || 'badge bg-secondary';
}

async function cancelBorrow(item) {
  if (!confirm('Bạn chắc chắn muốn hủy lượt mượn này?')) return;
  try {
    await BorrowService.cancelBorrow(item._id);
    item.TrangThai = 'Đã hủy';
    alert('Đã hủy lượt mượn.');
  } catch (err) {
    console.error('Lỗi hủy lượt mượn:', err);
    alert('Không thể hủy lượt mượn.');
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
  max-height: 320px;
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

.blinking {
  animation: blink 1s infinite;
  border: 1px solid red;
  color: white;
  padding: 4px 10px;
  border-radius: 0.3rem;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.text-danger {
  font-size: 0.875rem;
  color: red;
}
</style>
