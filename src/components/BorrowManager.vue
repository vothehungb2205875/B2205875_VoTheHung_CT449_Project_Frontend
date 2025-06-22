<template>
  <div class="container py-4">
    <h4>Quản lý Mượn sách</h4>

    <input
      v-model="search"
      type="text"
      class="form-control my-3"
      placeholder="Tìm kiếm theo tên, mã sách, trạng thái..."
    />

    <div class="d-flex justify-content-between align-items-end mb-3">
      <div class="d-flex align-items-center gap-2 ms-auto">
        <label class="mb-0">Số dòng/trang:</label>
        <select v-model="itemsPerPage" class="form-select w-auto">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </div>
    </div>

    <div class="table-responsive" style="min-height: 400px;">
      <table class="table table-bordered table-hover table-sm align-middle">
        <thead class="table-light">
          <tr>
            <th>Độc giả</th>
            <th>Mã sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedBorrows" :key="item._id">
            <td>{{ item.MaDocGia }}</td>
            <td>{{ item.MaSach }}</td>
            <td>{{ formatDate(item.NgayMuon) }}</td>
            <td>{{ formatDate(item.NgayTra) }}</td>
            <td>
              <span :class="statusClass(item.TrangThai)">
                {{ item.TrangThai }}
              </span>
            </td>
            <td class="text-center">
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
                v-if="item.TrangThai === 'Đang mượn'"
              >
                Hủy
              </button>
              <button
                class="btn btn-sm btn-outline-warning"
                @click="remindReturn(item)"
                v-if="item.TrangThai === 'Đang mượn' && isOverdue(item)"
                :disabled="loadingMap[item._id]"
                :class="{ blinking: isOverdue(item) }"
              >
                <span v-if="loadingMap[item._id]" class="spinner-border spinner-border-sm me-1"></span>
                Nhắc trả
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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

const borrows = ref([])
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const loadingMap = ref({})

let intervalId = null

onMounted(() => {
  loadBorrows()
  intervalId = setInterval(loadBorrows, 60000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

watch([search, itemsPerPage], () => {
  currentPage.value = 1
})

async function loadBorrows() {
  try {
    borrows.value = await BorrowService.getAll()
  } catch (err) {
    console.error('Không thể tải danh sách mượn:', err)
  }
}

const filteredBorrows = computed(() => {
  const keyword = search.value.toLowerCase()
  return borrows.value.filter(b =>
    Object.values(b).some(v =>
      v && v.toString().toLowerCase().includes(keyword)
    )
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredBorrows.value.length / itemsPerPage.value)
)

const paginatedBorrows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredBorrows.value.slice(start, start + itemsPerPage.value)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function statusClass(status) {
  return {
    'badge bg-secondary': status === 'Chưa trả',
    'badge bg-success': status === 'Đã trả',
    'badge bg-danger': status === 'Đã hủy',
    'badge bg-primary': status === 'Đang mượn',
    'badge bg-warning text-dark': status === 'Quá hạn',
  }
}

function isOverdue(item) {
  if (item.TrangThai !== 'Đang mượn' || !item.NgayTra) return false
  const today = new Date()
  const dueDate = new Date(item.NgayTra)
  return dueDate < today
}

async function markReturned(item) {
  try {
    await BorrowService.markAsReturned(item._id)
    item.TrangThai = 'Đã trả'
  } catch (err) {
    alert('Không thể cập nhật trạng thái')
  }
}

async function cancelBorrow(item) {
  if (confirm('Bạn chắc chắn muốn hủy lượt mượn này?')) {
    try {
      await BorrowService.cancelBorrow(item._id)
      item.TrangThai = 'Đã hủy'
    } catch (err) {
      alert('Không thể hủy mượn')
    }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return 'Chưa có'
  const date = new Date(dateStr)
  return !isNaN(date) ? date.toLocaleDateString('vi-VN') : 'Không hợp lệ'
}

async function remindReturn(item) {
  loadingMap.value[item._id] = true
  try {
    const reader = await ReaderService.getReaderByMa(item.MaDocGia)

    if (!reader || !reader.email) {
      alert('Không tìm thấy email độc giả!')
      return
    }

    const payload = {
      to: reader.email,
      readerName: reader.HoTen || reader.Ten || 'Độc giả',
      bookCode: item.MaSach,
      dueDate: formatDate(item.NgayTra),
    }

    await MailService.sendReminder(payload)
    await BorrowService.markAsReminded(item._id)
    item.TrangThai = 'Quá hạn'

    alert(`Đã gửi email nhắc trả đến: ${reader.email}`)
  } catch (err) {
    console.error(err)
    alert('Gửi email thất bại!')
  } finally {
    loadingMap.value[item._id] = false
  }
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
