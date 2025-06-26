<template>
  <div class="container py-4">
    <h4>Quản lý Độc giả</h4>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'active' }" href="#" @click.prevent="switchTab('active')">Hoạt động</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentTab === 'inactive' }" href="#" @click.prevent="switchTab('inactive')">Đã vô hiệu hóa</a>
      </li>
    </ul>

    <!-- Tìm kiếm -->
    <input type="text" v-model="search" class="form-control my-3" placeholder="Tìm kiếm độc giả..." />

    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-primary" @click="addReader">Thêm độc giả</button>

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
            <th>Mã ĐG</th>
            <th>Họ lót</th>
            <th>Tên</th>
            <th>Ngày sinh</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Avatar</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reader in readers" :key="reader._id">
            <td>{{ reader.MaDocGia }}</td>
            <td>{{ reader.HoLot }}</td>
            <td>{{ reader.Ten }}</td>
            <td>{{ reader.NgaySinh }}</td>
            <td>{{ reader.email }}</td>
            <td>{{ reader.DienThoai }}</td>
            <td class="text-center">
              <img v-if="reader.avatar" :src="getImageUrl(reader.avatar)" class="avatar-img rounded-circle" alt="Avatar" />
            </td>
            <td class="text-center">
              <button class="btn btn-sm" :class="currentTab === 'inactive' ? 'btn-outline-success' : 'btn-outline-primary me-2'" 
                      @click="currentTab === 'inactive' ? restoreReader(reader) : editReader(reader)">
                {{ currentTab === 'inactive' ? 'Khôi phục' : 'Sửa' }}
              </button>
              <button v-if="currentTab === 'active'" class="btn btn-sm btn-outline-danger" @click="deleteReader(reader)">Vô hiệu hóa</button>
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
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)">»</button>
        </li>
      </ul>
    </nav>

    <!-- Modal -->
    <ReaderFormModal v-model="showModal" :reader="selectedReader" :mode="modalMode" @save="handleSave" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ReaderService from '@/services/reader.service'
import ReaderFormModal from '@/components/ReaderFormModal.vue'

const readers = ref([])
const totalReaders = ref(0)
const search = ref('')
const showModal = ref(false)
const selectedReader = ref(null)
const modalMode = ref('add')
const currentTab = ref('active')

const currentPage = ref(1)
const itemsPerPage = ref(5)

function switchTab(tab) {
  currentTab.value = tab
  currentPage.value = 1
  loadReaders()
}

async function loadReaders() {
  try {
    const params = {
      q: search.value || undefined,
      page: currentPage.value,
      limit: itemsPerPage.value,
      TrangThai: currentTab.value === 'inactive' ? 'Vô hiệu hóa' : undefined
    }

    const res = await ReaderService.getFiltered(params)
    readers.value = res.data
    totalReaders.value = res.total
  } catch (e) {
    console.error('Lỗi khi tải danh sách độc giả:', e)
  }
}

onMounted(loadReaders)
watch([search, itemsPerPage], () => { currentPage.value = 1; loadReaders() })
watch(currentPage, loadReaders)

const totalPages = computed(() => Math.ceil(totalReaders.value / itemsPerPage.value))
function goToPage(page) { if (page >= 1 && page <= totalPages.value) currentPage.value = page }
function getImageUrl(path) { return path.startsWith('http') ? path : `http://localhost:3000/${path}` }
function addReader() { selectedReader.value = null; modalMode.value = 'add'; showModal.value = true }
function editReader(reader) { selectedReader.value = { ...reader }; modalMode.value = 'edit'; showModal.value = true }

async function handleSave(readerFormData) {
  try {
    if (modalMode.value === 'add') {
      await ReaderService.create(readerFormData)
      alert("Thêm độc giả thành công")
    } else if (modalMode.value === 'edit' && selectedReader.value?._id) {
      await ReaderService.update(selectedReader.value._id, readerFormData)
    }
    loadReaders()
  } catch (e) {
    console.error('Lỗi khi lưu độc giả:', e)
    alert('Không thể lưu độc giả.')
  }
}

async function deleteReader(reader) {
  if (!confirm(`Xác nhận vô hiệu hóa độc giả "${reader.Ten}"?`)) return

  try {
    await ReaderService.update(reader._id, { TrangThai: 'Vô hiệu hóa' })
    loadReaders()
  } catch (error) {
    console.error('Lỗi khi vô hiệu hóa độc giả:', error)
    alert('Vô hiệu hóa độc giả thất bại.')
  }
}

async function restoreReader(reader) {
  if (!confirm(`Khôi phục độc giả "${reader.Ten}"?`)) return

  try {
    await ReaderService.update(reader._id, { TrangThai: 'Hoạt động' })
    loadReaders()
  } catch (error) {
    console.error('Lỗi khi khôi phục độc giả:', error)
    alert('Khôi phục độc giả thất bại.')
  }
}
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
th:nth-child(1), td:nth-child(1) { width: 80px; }
th:nth-child(2), td:nth-child(2),
th:nth-child(3), td:nth-child(3),
th:nth-child(5), td:nth-child(5) { max-width: 180px; }
th:nth-child(4), td:nth-child(4) { width: 110px; }
th:nth-child(6), td:nth-child(6) { width: 120px; }
th:nth-child(7), td:nth-child(7) { width: 70px; text-align: center; }
th:nth-child(8), td:nth-child(8) { width: 130px; }

.avatar-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
