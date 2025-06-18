<template>
  <v-container>
    <h2 class="mb-4">📚 Quản lý Sách</h2>

    <!-- Ô tìm kiếm -->
    <v-text-field
      v-model="search"
      label="🔍 Tìm kiếm sách..."
      prepend-inner-icon="mdi-magnify"
      class="mb-4"
    />

    <!-- Bảng dữ liệu -->
    <v-data-table
      :headers="headers"
      :items="books"
      :search="search"
      :items-per-page="5"
      class="elevation-1"
      :footer-props="{
        showFirstLastPage: true,
        itemsPerPageOptions: [5, 10, 20],
        itemsPerPageText: 'Hiển thị',
        pageText: '{0}-{1} trên {2}'
      }"
    >
      <!-- Cột ảnh bìa -->
      <template #item.BiaSach="{ item }">
        <img
          v-if="item.BiaSach"
          :src="getImageUrl(item.BiaSach)"
          alt="Bìa sách"
          width="50"
        />
      </template>

      <!-- Cột nút thao tác -->
      <template #item.actions="{ item }">
        <div style="display: flex; gap: 8px;">
          <v-btn
            size="small"
            color="blue"
            variant="outlined"
            @click="editBook(item)"
          >
            Sửa
          </v-btn>
          <v-btn
            size="small"
            color="red"
            variant="outlined"
            @click="deleteBook(item)"
          >
            Xóa
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookService from '@/services/book.service'

// Dữ liệu và tìm kiếm
const books = ref([])
const search = ref('')

// Cấu hình tiêu đề bảng
const headers = [
  { title: 'Mã sách', key: 'MaSach' },
  { title: 'Tên sách', key: 'TenSach' },
  { title: 'Tác giả', key: 'TacGia' },
  { title: 'Đơn giá', key: 'DonGia' },
  { title: 'Số quyển', key: 'SoQuyen' },
  { title: 'Năm XB', key: 'NamXuatBan' },
  { title: 'Thể loại', key: 'TheLoai' },
  { title: 'Bìa sách', key: 'BiaSach' },
  { title: 'Thao tác', key: 'actions', sortable: false }
]

// Load sách từ API
onMounted(async () => {
  try {
    const response = await BookService.getAll()
    books.value = response
  } catch (error) {
    console.error('❌ Lỗi khi tải danh sách sách:', error)
    books.value = []
  }
})

// Tạo link ảnh bìa
function getImageUrl(path) {
  return path ? `http://localhost:3000/${path}` : ''
}

// Xóa sách
function deleteBook(item) {
  books.value = books.value.filter(b => b.MaSach !== item.MaSach)
}

// Chỉnh sửa
function editBook(item) {
  alert(`Chỉnh sửa sách: ${item.TenSach}`)
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
