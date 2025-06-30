<template>
  <div class="container py-4">
    <h4>Quản lý Mượn sách</h4>

    <!-- Tìm kiếm -->
    <input
      v-model="search"
      type="text"
      class="form-control my-3"
      placeholder="Tìm kiếm theo tên, mã sách, trạng thái..."
    />

    <!-- Bộ lọc nâng cao -->
    <div class="row mb-3 d-flex flex-row justify-content-center">
      <div class="col-md-3">
        <input type="date" v-model="filterStart" class="form-control" />
      </div>
      <div class="col-md-3">
        <input type="date" v-model="filterEnd" class="form-control" />
      </div>
      <div class="col-md-3">
        <select v-model="filterStatus" class="form-select">
          <option value="">-- Tất cả trạng thái --</option>
          <option>Đăng ký mượn</option>
          <option>Đang mượn</option>
          <option>Đã trả</option>
          <option>Đã hủy</option>
          <option>Quá hạn</option>
        </select>
      </div>
      <div class="col-md-1">
        <button class="btn btn-primary w-100" @click="loadBorrows">Lọc</button>
      </div>
      <div class="col-md-1">
        <button class="btn btn-secondary w-100" @click="resetFilters">Reset</button>
      </div>
    </div>

    <!-- Số dòng / trang -->
    <div class="d-flex justify-content-end mb-3">
      <label class="me-2">Số dòng/trang:</label>
      <select v-model="itemsPerPage" class="form-select w-auto">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
      </select>
    </div>

    <!-- Bảng dữ liệu -->
    <div class="table-responsive" style="min-height: 400px;">
      <table class="table table-bordered table-hover table-sm align-middle">
        <thead class="table-light">
          <tr>
            <th>Mã độc giả</th>
            <th>Tên độc giả</th>
            <th>SĐT</th>
            <th>Mã sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả thực tế</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedBorrows" :key="item._id">
            <td>{{ item.MaDocGia }}</td>
            <td>{{ item.reader?.HoLot }} {{ item.reader?.Ten }}</td>
            <td>{{ item.reader?.DienThoai || 'N/A' }}</td>
            <td>{{ item.MaSach }}</td>
            <td>{{ formatDate(item.NgayMuon) }}</td>
            <td>{{ formatDate(item.NgayTra) }}</td>
            <td>{{ formatDate(item.NgayTraTT) }}</td>
            <td>
              <span :class="statusClass(item.TrangThai)">
                {{ item.TrangThai }}
              </span>
            </td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="markAsBorrowed(item)"
                v-if="item.TrangThai === 'Đăng ký mượn'"
              >
                Đã nhận sách
              </button>

              <button
                class="btn btn-sm btn-outline-success me-2"
                @click="markReturned(item)"
                v-if="item.TrangThai === 'Đang mượn' || item.TrangThai === 'Quá hạn'"
              >
                Đã trả
              </button>
              <button
                class="btn btn-sm btn-outline-danger me-2"
                @click="cancelBorrow(item)"
                v-if="item.TrangThai === 'Đăng ký mượn'"
              >
                Hủy
              </button>
              <button
                class="btn btn-sm btn-outline-warning"
                @click="remindReturn(item)"
                v-if="item.TrangThai === 'Quá hạn'"
                :disabled="loadingMap[item._id]"
                :class="{ blinking: item.TrangThai === 'Quá hạn' }"
              >
                <span v-if="loadingMap[item._id]" class="spinner-border spinner-border-sm me-1"></span>
                Nhắc trả
              </button>
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
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)">»</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import BorrowService from '@/services/borrow.service'
import MailService from '@/services/mail.service'
import ReaderService from '@/services/reader.service'
import { toast } from 'vue3-toastify'

const borrows = ref([])
const totalBorrows = ref(0)

const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const loadingMap = ref({})

// Bộ lọc
const filterStart = ref('')
const filterEnd = ref('')
const filterStatus = ref('')

let intervalId = null

onMounted(() => {
  loadBorrows()
  intervalId = setInterval(loadBorrows, 60000)
})
onBeforeUnmount(() => clearInterval(intervalId))

watch([search, itemsPerPage], () => {
  currentPage.value = 1
  loadBorrows()
})
watch(currentPage, loadBorrows)

async function loadBorrows() {
  try {
    const params = {
      q: search.value || undefined,
      page: currentPage.value,
      limit: itemsPerPage.value,
      startDate: filterStart.value || undefined,
      endDate: filterEnd.value || undefined,
      status: filterStatus.value || undefined,
    }

    const res = await BorrowService.getFiltered(params)
    const borrowList = res.data

    for (const item of borrowList) {
      try {
        const reader = await ReaderService.getReaderByMa(item.MaDocGia)
        item.reader = reader
        if (item.TrangThai === 'Đang mượn' && isOverdue(item)) {
          await markAsOverdue(item)
        }
      } catch {
        item.reader = null
      }
    }

    borrows.value = borrowList
    totalBorrows.value = res.total
  } catch (err) {
    toast.error('Không thể tải danh sách mượn!')
    console.error(err)
  }
}

const totalPages = computed(() =>
  Math.ceil(totalBorrows.value / itemsPerPage.value)
)
const paginatedBorrows = computed(() => borrows.value)

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function statusClass(status) {
  return {
    'badge bg-secondary': status === 'Chưa trả' || status === 'Đăng ký mượn',
    'badge bg-success': status === 'Đã trả',
    'badge bg-danger': status === 'Đã hủy',
    'badge bg-primary': status === 'Đang mượn',
    'badge bg-warning text-dark': status === 'Quá hạn',
  }
}

function isOverdue(item) {
  if (item.TrangThai !== 'Đang mượn' || !item.NgayTra) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(item.NgayTra);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Chưa có'
  const date = new Date(dateStr)
  return !isNaN(date) ? date.toLocaleDateString('vi-VN') : 'Không hợp lệ'
}

async function markReturned(item) {
  try {
    await BorrowService.markAsReturned(item._id)
    item.TrangThai = 'Đã trả'
    item.NgayTraTT = new Date()
    toast.success('Cập nhật trạng thái: Đã trả')
  } catch {
    toast.error('Không thể cập nhật trạng thái')
  }
}

async function markAsOverdue(item) {
  try {
    await BorrowService.markAsOverdue(item._id)
    item.TrangThai = 'Quá hạn'
  } catch (err) {
    console.error(`Không thể cập nhật quá hạn cho ${item._id}`, err)
  }
}

async function cancelBorrow(item) {
  if (confirm('Bạn chắc chắn muốn hủy lượt mượn này?')) {
    try {
      await BorrowService.cancelBorrow(item._id)
      item.TrangThai = 'Đã hủy'
      toast.success('Đã hủy mượn thành công')
    } catch {
      toast.error('Không thể hủy mượn')
    }
  }
}

async function markAsBorrowed(item) {
  try {
    await BorrowService.markAsBorrowed(item._id)
    item.TrangThai = 'Đang mượn'
    toast.success('Đã chuyển trạng thái sang "Đang mượn"')
  } catch {
    toast.error('Không thể cập nhật trạng thái')
  }
}

async function remindReturn(item) {
  loadingMap.value[item._id] = true
  try {
    const reader = await ReaderService.getReaderByMa(item.MaDocGia)
    if (!reader || !reader.email) {
      toast.error('Không tìm thấy email độc giả!')
      return
    }

    await MailService.sendReminder({
      to: reader.email,
      readerName: reader.Ten || 'Độc giả',
      bookCode: item.MaSach,
      dueDate: formatDate(item.NgayTra),
    })

    await BorrowService.markAsReminded(item._id)
    item.TrangThai = 'Quá hạn'
    toast.success(`Đã gửi nhắc trả đến: ${reader.email}`)
  } catch (err) {
    console.error(err)
    toast.error('Gửi email thất bại!')
  } finally {
    loadingMap.value[item._id] = false
  }
}

function resetFilters() {
  filterStart.value = ''
  filterEnd.value = ''
  filterStatus.value = ''
  search.value = ''
  currentPage.value = 1
  loadBorrows()
}
</script>


<style scoped>
.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.6em;
}
.blinking {
  animation: blink 1s infinite;
  border-color: rgb(255, 162, 0);
  color: rgb(0, 0, 0);
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
</style>
