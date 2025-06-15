<template>
  <div class="page-layout">
    <Header />

    <main class="flex-fill py-5">
      <div class="container">
        <h2 class="mb-4 fw-bold text-center">👤 Thông tin cá nhân</h2>

        <!-- Hiển thị hồ sơ -->
        <div v-if="reader && !editing" class="card shadow-sm p-4 mx-auto" style="max-width: 700px;">
          <div class="d-flex align-items-center gap-4 mb-4">
            <img
              :src="getAvatarUrl(reader.avatar)"
              alt="Avatar"
              class="rounded-circle border"
              width="100"
              height="100"
              style="object-fit: cover;"
              @error="handleImageError"
            />
            <div>
              <h4 class="mb-1">{{ reader.name }}</h4>
              <p class="text-muted mb-0">{{ reader.email }}</p>
            </div>
          </div>

          <div class="mb-3">
            <p><strong>Mã độc giả:</strong> {{ reader.MaDocGia || "Chưa có" }}</p>
            <p><strong>Họ tên:</strong> {{ reader.HoLot }} {{ reader.Ten }}</p>
            <p><strong>Ngày sinh:</strong> {{ reader.NgaySinh || "Chưa cập nhật" }}</p>
            <p><strong>Phái:</strong> {{ reader.Phai }}</p>
            <p><strong>Địa chỉ:</strong> {{ reader.DiaChi }}</p>
            <p><strong>Điện thoại:</strong> {{ reader.DienThoai }}</p>
          </div>

          <button class="btn btn-outline-primary w-100" @click="editing = true">
            ✏️ Cập nhật hồ sơ
          </button>
        </div>

        <!-- Form chỉnh sửa -->
        <div v-else-if="editing" class="card shadow-sm p-4 mx-auto" style="max-width: 700px;">
          <h5 class="mb-3">Cập nhật thông tin cá nhân</h5>
          <form @submit.prevent="updateProfile">
            <div class="mb-3">
              <label class="form-label">Họ lót</label>
              <input v-model="editData.HoLot" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Tên</label>
              <input v-model="editData.Ten" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày sinh</label>
              <input v-model="editData.NgaySinh" type="date" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Phái</label>
              <select v-model="editData.Phai" class="form-select">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Địa chỉ</label>
              <input v-model="editData.DiaChi" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Điện thoại</label>
              <input v-model="editData.DienThoai" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Tên hiển thị</label>
              <input v-model="editData.name" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="editData.email" type="email" class="form-control" disabled />
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
      </div>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import api from '@/services/api.service';

export default {
  components: { Header, Footer },
  data() {
    return {
      reader: null,
      editing: false,
      editData: {},
    };
  },
  async mounted() {
    try {
      const { data: auth } = await api.get("/auth/me");
      const { data: reader } = await api.get(`/readers/${auth._id}`);
      this.reader = reader;
      this.editData = { ...reader };
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
    }
  },
  methods: {
    async updateProfile() {
      try {
        const res = await api.put(`/readers/${this.reader._id}`, this.editData);
        this.reader = res.data.document;
        this.editing = false;
        alert("Cập nhật thành công!");
      } catch (err) {
        console.error("Cập nhật thất bại:", err);
        alert("Không thể cập nhật.");
      }
    },
    getAvatarUrl(avatarPath) {
      if (!avatarPath) return "/images/default-avatar.jpg";

      // Nếu là URL đầy đủ (bắt đầu bằng http hoặc https), trả nguyên URL
      if (/^https?:\/\//.test(avatarPath)) {
        return avatarPath;
      }

      // Ngược lại, coi như đường dẫn nội bộ
      return `http://localhost:3000${avatarPath}`;
    }
  },
};
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
