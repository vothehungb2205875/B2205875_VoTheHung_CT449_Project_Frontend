<template>
  <div class="container py-4">
    <h4>Quản lý Sách</h4>

    <!-- Tìm kiếm -->
    <input
      type="text"
      v-model="search"
      class="form-control my-3"
      placeholder="Tìm kiếm sách..."
    />

    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-primary" @click="addBook">Thêm sách</button>

      <div class="d-flex align-items-center gap-2">
        <label class="mb-0">Số dòng/trang:</label>
        <select v-model="itemsPerPage" class="form-select w-auto">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </div>
    </div>

    <!-- Bảng dữ liệu -->
    <div class="table-responsive" style="min-height: 400px;">
      <table class="table table-bordered table-hover table-sm align-middle">
        <thead class="table-light">
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Năm XB</th>
            <th>Thể loại</th>
            <th>Bìa sách</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book._id">
            <td>{{ book.MaSach }}</td>
            <td class="truncate" :title="book.TenSach">{{ book.TenSach }}</td>
            <td class="truncate" :title="book.TacGia">{{ book.TacGia }}</td>
            <td>{{ book.DonGia }}</td>
            <td>{{ book.SoQuyen }}</td>
            <td>{{ book.NamXuatBan }}</td>
            <td class="truncate" :title="book.TheLoai">{{ book.TheLoai }}</td>
            <td class="text-center">
              <img
                v-if="book.BiaSach"
                :src="getImageUrl(book.BiaSach)"
                alt="Bìa"
                class="book-cover"
                loading="lazy"
              />
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" @click="editBook(book)">Sửa</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteBook(book)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)">«</button>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)">»</button>
        </li>
      </ul>
    </nav>

    <!-- Modal -->
    <BookFormModal
      v-model="showModal"
      :book="selectedBook"
      :mode="modalMode"
      @save="handleSave"
    /> <!--Truyền dữ liệu xuống component con, nhận sự kiện gửi lên-->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BookService from '@/services/book.service'
import BookFormModal from '@/components/BookFormModal.vue'

const books = ref([])
const totalBooks = ref(0)
const search = ref('')
const showModal = ref(false)
const selectedBook = ref(null)
const modalMode = ref('add')

// Phân trang
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Gọi dữ liệu từ BE
async function loadBooks() {
  try {
    const params = {
      q: search.value || undefined,
      page: currentPage.value,
      limit: itemsPerPage.value
    }

    const res = await BookService.getFiltered(params)
    books.value = res.data
    totalBooks.value = res.total
  } catch (e) {
    console.error('Lỗi khi tải danh sách:', e)
  }
}

// Khi khởi động
onMounted(loadBooks)

// Gọi lại khi tìm kiếm hoặc thay đổi số dòng/trang
watch([search, itemsPerPage], () => {
  currentPage.value = 1
  loadBooks()
})

// Gọi lại khi chuyển trang
watch(currentPage, loadBooks)

const totalPages = computed(() =>
  Math.ceil(totalBooks.value / itemsPerPage.value)
)

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function getImageUrl(path) {
  return `http://localhost:3000/${path}`
}

function addBook() {
  selectedBook.value = null
  modalMode.value = 'add'
  showModal.value = true
}

function editBook(book) {
  selectedBook.value = { ...book }
  modalMode.value = 'edit'
  showModal.value = true
}

async function handleSave(book) {
  try {
    const formData = new FormData()
    for (const key in book) {
      formData.append(key, book[key])
    }

    if (modalMode.value === 'add') {
      const newBook = await BookService.create(formData)
      loadBooks() // reload lại danh sách
      alert("Thêm sách thành công")
    } else if (modalMode.value === 'edit' && book._id) {
      const res = await BookService.update(book._id, formData)
      loadBooks() // reload lại danh sách
    }
  } catch (e) {
    console.error('Lỗi khi lưu:', e)
    alert('Không thể lưu sách.')
  }
}

async function deleteBook(book) {
  if (!confirm(`Xác nhận xóa "${book.TenSach}"?`)) return

  try {
    await BookService.delete(book._id)
    loadBooks() // cập nhật lại danh sách
  } catch (error) {
    console.error('Lỗi khi xóa sách:', error)
    alert('Xóa sách thất bại.')
  }
}
</script>


<style scoped>
.table td,
.table th {
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Định dạng chiều rộng cột */
th:nth-child(1), td:nth-child(1) { width: 80px; }
th:nth-child(2), td:nth-child(2),
th:nth-child(3), td:nth-child(3),
th:nth-child(7), td:nth-child(7) {
  max-width: 200px;
}

th:nth-child(4), td:nth-child(4) { width: 100px; }
th:nth-child(5), td:nth-child(5) { width: 90px; }
th:nth-child(6), td:nth-child(6) { width: 90px; }
th:nth-child(8), td:nth-child(8) {
  width: 60px;
  text-align: center;
}
th:nth-child(9), td:nth-child(9) { width: 130px; }

/* Dành cho các ô bị cắt ngắn */
.truncate {
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Ảnh bìa */
.book-cover {
  width: 50px;
  height: 70px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>
