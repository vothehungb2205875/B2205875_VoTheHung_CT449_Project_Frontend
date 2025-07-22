<template>
  <div class="container py-4">
    <h4>Quản lý Sách</h4>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'active' }" href="#" @click.prevent="switchTab('active')">
          Sách đang hoạt động
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'deleted' }" href="#"
          @click.prevent="switchTab('deleted')">
          Đã xóa
        </a>
      </li>
    </ul>

    <!-- Tìm kiếm -->
    <input type="text" v-model="search" class="form-control my-3" placeholder="Tìm kiếm sách..." />

    <!-- Bộ lọc nâng cao -->
    <BookFilters v-model="filter" :genres="genres" :nxbs="nxbs" />

    <!-- Button và paging -->
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

    <!-- Table -->
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
              <img v-if="book.BiaSach" :src="getImageUrl(book.BiaSach)" class="book-cover" alt="Bìa" loading="lazy" />
            </td>
            <td class="text-center">
              <button class="btn btn-sm"
                :class="currentTab === 'deleted' ? 'btn-outline-success' : 'btn-outline-primary me-2'"
                @click="currentTab === 'deleted' ? restoreBook(book) : editBook(book)">
                {{ currentTab === 'deleted' ? 'Khôi phục' : 'Sửa' }}
              </button>
              <button v-if="currentTab !== 'deleted'" class="btn btn-sm btn-outline-danger"
                @click="deleteBook(book)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)">«</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)">»</button>
        </li>
      </ul>
    </nav>
    <!-- component con -->
    <!-- Cha thay đổi các giá trị này thì component con sẽ tự động cập nhật -->
    <BookFormModal v-model="showModal" :book="selectedBook" :mode="modalMode" @save="handleSave" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import BookService from '@/services/book.service';
// Import component con
import BookFormModal from '@/components/BookFormModal.vue';
import BookFilters from '@/components/BookFilters.vue';
import { toast } from 'vue3-toastify'

const books = ref([]);
const totalBooks = ref(0);
const search = ref('');
const showModal = ref(false);
const selectedBook = ref(null);
const modalMode = ref('add');
const currentTab = ref('active');
const currentPage = ref(1);
const itemsPerPage = ref(5);

const filter = reactive({
  genre: '',
  nxb: '',
  year: ''
});
const genres = ref([]);
const nxbs = ref([]);

function switchTab(tab) {
  currentTab.value = tab;
  currentPage.value = 1;
  loadBooks();
}

async function loadBooks() {
  try {
    const params = {
      q: search.value || undefined,
      page: currentPage.value,
      limit: itemsPerPage.value,
      TrangThai: currentTab.value === 'deleted' ? 'Đã xóa' : undefined,
      genre: filter.genre || undefined,
      nxb: filter.nxb || undefined,
      year: filter.year || undefined,
    };

    const res = await BookService.getFiltered(params);
    books.value = res.data;
    totalBooks.value = res.total;
  } catch (e) {
    console.error('Lỗi khi tải danh sách:', e);
    toast.error('Không thể tải danh sách sách.');
  }
}

onMounted(() => {
  loadBooks();
  loadFilters();
});

watch([search, itemsPerPage], () => { currentPage.value = 1; loadBooks(); });
watch(currentPage, loadBooks);
watch([() => filter.genre, () => filter.nxb, () => filter.year], () => {
  currentPage.value = 1;
  loadBooks();
});

const totalPages = computed(() => Math.ceil(totalBooks.value / itemsPerPage.value));

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

function getImageUrl(path) {
  return `http://localhost:3000/${path}`;
}

// Khi bấm thêm sách, tạo dữ liệu để truyền cho component con
function addBook() {
  selectedBook.value = null; // :book
  modalMode.value = 'add'; // :mode
  showModal.value = true; // v-model
}
// Khi bấm sửa sách, sao chép dữ liệu sách để truyền cho component con
function editBook(book) {
  selectedBook.value = { ...book }; // :book
  modalMode.value = 'edit'; // :mode
  showModal.value = true; // v-model
}

// Xử lý sự kiện lưu từ component con
// Hàm này sẽ được gọi khi người dùng nhấn nút Lưu trong modal
async function handleSave(book) {
  try {
    const formData = new FormData();
    for (const key in book) formData.append(key, book[key]);
    // Nếu là chế độ thêm thì gọi create, nếu là sửa thì gọi update
    if (modalMode.value === 'add') {
      await BookService.create(formData);
      toast.success('Thêm sách thành công');
    } else if (modalMode.value === 'edit' && book._id) {
      await BookService.update(book._id, formData);
      toast.success('Cập nhật sách thành công');
    }

    loadBooks();
  } catch (e) {
    console.error('Lỗi khi lưu:', e);
    toast.error(e.response?.data?.message || 'Không thể lưu sách.');
  }
}

// Xử lý sự kiện xóa sách
async function deleteBook(book) {
  if (!confirm(`Xác nhận xóa "${book.TenSach}"?`)) return;
  try {
    await BookService.update(book._id, { TrangThai: 'Đã xóa' });
    toast.success('Đã xóa sách thành công');
    loadBooks();
  } catch (e) {
    console.error('Lỗi khi xóa sách:', e);
    toast.error(e.response?.data?.message || 'Xóa sách thất bại.');
  }
}

// Xử lý sự kiện khôi phục sách
async function restoreBook(book) {
  if (!confirm(`Khôi phục sách "${book.TenSach}"?`)) return;
  try {
    await BookService.update(book._id, { TrangThai: 'Hoạt động' });
    toast.success('Khôi phục sách thành công');
    loadBooks();
  } catch (e) {
    console.error('Lỗi khi khôi phục sách:', e);
    toast.error(e.response?.data?.message || 'Khôi phục thất bại.');
  }
}

// Lấy giá trị cho bộ lọc
async function loadFilters() {
  try {
    const { genres: genreList, nxbs: nxbList } = await BookService.getFilters();
    genres.value = genreList;
    nxbs.value = nxbList;
  } catch (e) {
    console.error("Không thể tải danh sách bộ lọc:", e);
    toast.error('Không thể tải bộ lọc sách');
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

th:nth-child(1),
td:nth-child(1) {
  width: 80px;
}

th:nth-child(2),
td:nth-child(2),
th:nth-child(3),
td:nth-child(3),
th:nth-child(7),
td:nth-child(7) {
  max-width: 200px;
}

th:nth-child(4),
td:nth-child(4) {
  width: 100px;
}

th:nth-child(5),
td:nth-child(5) {
  width: 90px;
}

th:nth-child(6),
td:nth-child(6) {
  width: 90px;
}

th:nth-child(8),
td:nth-child(8) {
  width: 60px;
  text-align: center;
}

th:nth-child(9),
td:nth-child(9) {
  width: 130px;
}

.truncate {
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.book-cover {
  width: 50px;
  height: 70px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>
