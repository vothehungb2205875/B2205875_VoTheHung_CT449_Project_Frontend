<template>
  <div class="container py-4">
    <h4>Quản lý Mượn sách</h4>

    <!-- Tìm kiếm -->
    <input
      v-model="search"
      type="text"
      class="form-control my-3"
      placeholder="Tìm kiếm theo mã sách, số điện thoại..."
    />

    <!-- Bộ lọc nâng cao -->
    <div class="row mb-3 d-flex flex-row justify-content-center">
      <div class="col-md-3">
        <input type="date" v-model="filterStart" class="form-control" />
      </div>
      <div class="col-md-3">
        <input type="date" v-model="filterEnd" class="form-control" />
      </div>
      <div class="col-md-2">
        <select v-model="filterStatus" class="form-select">
          <option value="">-- Tất cả trạng thái --</option>
          <option>Đăng ký mượn</option>
          <option>Đang mượn</option>
          <option>Đã trả</option>
          <option>Đã hủy</option>
          <option>Quá hạn trả</option>
          <option>Quá hạn nhận</option>
        </select>
      </div>
      <div class="col-md-1">
        <button class="btn btn-primary w-100" @click="loadBorrows">Lọc</button>
      </div>
      <div class="col-md-1">
        <button class="btn btn-secondary w-100" @click="resetFilters">Reset</button>
      </div>
      <div class="col-md-2">
        <button class="btn btn-warning w-100" @click="remindAllOverdue">
          Email nhắc quá hạn
        </button>
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
            <th>Ghi chú</th>
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
              <div class="d-flex flex-wrap justify-content-center gap-1">

                <!-- Đã nhận sách -->
                <button
                  v-if="item.TrangThai === 'Đăng ký mượn'"
                  class="btn btn-sm btn-outline-primary"
                  @click="markAsBorrowed(item)"
                >
                  Đã nhận sách
                </button>

                <!-- Đã trả & Mất sách -->
                <template v-if="item.TrangThai === 'Đang mượn' || item.TrangThai === 'Quá hạn trả'">
                  <button
                    class="btn btn-sm btn-outline-success"
                    @click="markReturned(item)"
                  >
                    Đã trả
                  </button>

                  <button
                    class="btn btn-sm btn-outline-dark"
                    @click="markAsLost(item)"
                  >
                    Mất sách
                  </button>
                </template>

                <!-- Hủy -->
                <button
                  v-if="item.TrangThai === 'Đăng ký mượn' || item.TrangThai === 'Quá hạn nhận'"
                  class="btn btn-sm btn-outline-danger"
                  @click="cancelBorrow(item)"
                >
                  Hủy
                </button>

              </div>
            </td>
            <td>
              <div>
                <template v-if="extractFine(item.GhiChu) !== '0đ'">
                  <span class="fw-semibold">
                    Phạt: {{ extractFine(item.GhiChu) }}
                  </span>
                </template>
                <button class="btn btn-sm btn-link p-0 ms-2" @click="showDetail(item)">
                  Chi tiết
                </button>
              </div>
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
  <!-- Overlay + Progress bar theo % -->
  <div v-if="isSendingBulk" class="overlay-progress">
    <div class="progress w-75">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated bg-info"
        role="progressbar"
        :style="{ width: sendProgress + '%' }"
      >
        {{ sendProgress }}%
      </div>
    </div>
    <div class="mt-2 text-white">
      Đang gửi email nhắc {{ sendProgress }}% ({{ sentCount }}/{{ totalToSend }})
    </div>
  </div>
  <!-- Modal Chi tiết -->
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.4);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Chi tiết mượn sách</h5>
          <button type="button" class="btn-close" @click="showModal = false"></button>
        </div>
        <div class="modal-body">
          <p><strong>Mã độc giả:</strong> {{ selectedItem?.MaDocGia }}</p>
          <p><strong>Mã sách:</strong> {{ selectedItem?.MaSach }}</p>
          <p><strong>Trạng thái:</strong> {{ selectedItem?.TrangThai }}</p>
          <p><strong>Ngày mượn:</strong> {{ formatDate(selectedItem?.NgayMuon) }}</p>
          <p><strong>Hạn trả:</strong> {{ formatDate(selectedItem?.NgayTra) }}</p>
          <p><strong>Ngày trả TT:</strong> {{ formatDate(selectedItem?.NgayTraTT) }}</p>
          <p><strong>Ghi chú:</strong> {{ selectedItem?.GhiChu || 'Không có' }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showModal = false">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import BorrowService from '@/services/borrow.service'
import MailService from '@/services/mail.service'
import ReaderService from '@/services/reader.service'
import BookService from '@/services/book.service'
import { toast } from 'vue3-toastify'

const borrows = ref([])
const totalBorrows = ref(0)
const showModal = ref(false)
const selectedItem = ref(null)

const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const loadingMap = ref({})
const isSendingBulk = ref(false)
const sendProgress = ref(0) // phần trăm
const totalToSend = ref(0)

// Bộ lọc
const filterStart = ref('')
const filterEnd = ref('')
const filterStatus = ref('')

let intervalId = null

onMounted(() => {
  loadBorrows()
  intervalId = setInterval(loadBorrows, 60000) // Tự động reload mỗi phút
})
onBeforeUnmount(() => clearInterval(intervalId))

watch([search, itemsPerPage], () => {
  currentPage.value = 1
  loadBorrows()
})
watch(currentPage, loadBorrows)

function showDetail(item) {
  selectedItem.value = item
  showModal.value = true
}

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

    // Gắn thông tin độc giả cho từng bản ghi
    for (const item of borrowList) {
      try {
        const reader = await ReaderService.getReaderByMa(item.MaDocGia)
        item.reader = reader
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
    'badge bg-dark': status === 'Mất sách',
    'badge bg-warning text-dark': status === 'Quá hạn trả' || status === 'Quá hạn nhận',
  }
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

async function markAsLost(item) {
  if (!confirm('Bạn chắc chắn muốn đánh dấu là mất sách?')) return

  try {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const dueDate = new Date(item.NgayTra)
    dueDate.setHours(0, 0, 0, 0) 

    const diffTime = now - dueDate
    const lateDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0

    let DonGia = item.DonGia
    if (!DonGia) {
      DonGia = await BookService.getBookPriceByMa(item.MaSach)
      if (!DonGia) {
        toast.error('Không thể lấy giá sách từ mã: ' + item.MaSach)
        return
      }
    }

    const tienPhat = lateDays * 5000 + DonGia

    const data = {
      TrangThai: 'Mất sách',
      GhiChu: `Mất sách: ${DonGia}đ + Trễ ${lateDays} ngày: 5000đ/ngày. Phạt: ${tienPhat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`,
    }

    await BorrowService.markAsLost(item._id, data)

    // Cập nhật UI
    item.TrangThai = 'Mất sách'
    item.GhiChu = data.GhiChu

    toast.success('Đã đánh dấu là mất sách và cập nhật tiền phạt')
  } catch (err) {
    toast.error('Không thể cập nhật trạng thái')
    console.error(err)
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

async function remindAllOverdue() {
  const overdueItems = borrows.value.filter(
    (item) => item.TrangThai === 'Quá hạn trả'
  )

  if (overdueItems.length === 0) {
    toast.info('Không có bản ghi nào quá hạn trả')
    return
  }

  if (!confirm(`Bạn có chắc muốn gửi nhắc trả cho ${overdueItems.length} lượt mượn?`)) {
    return
  }

  isSendingBulk.value = true
  sendProgress.value = 0
  totalToSend.value = overdueItems.length
  let sentCount = 0
  let failCount = 0

  for (const item of overdueItems) {
    try {
      const reader = await ReaderService.getReaderByMa(item.MaDocGia)
      if (!reader?.email) {
        failCount++
        continue
      }

      await MailService.sendReminder({
        to: reader.email,
        readerName: reader.Ten || 'Độc giả',
        bookCode: item.MaSach,
        dueDate: formatDate(item.NgayTra),
      })

      sentCount++
    } catch (err) {
      failCount++
      console.error(`Lỗi gửi cho ${item.MaDocGia}:`, err)
    }

    sendProgress.value = Math.round((sentCount + failCount) * 100 / totalToSend.value)
  }

  setTimeout(() => {
  isSendingBulk.value = false
  sendProgress.value = 0
  }, 2000)
  toast.success(`Đã gửi nhắc thành công cho ${sentCount} lượt. Thất bại: ${failCount}.`)
}

function resetFilters() {
  filterStart.value = ''
  filterEnd.value = ''
  filterStatus.value = ''
  search.value = ''
  currentPage.value = 1
  loadBorrows()
}

function extractFine(ghiChu) {
  if (!ghiChu) return '0đ'
  const match = ghiChu.match(/Phạt[:\s]*([\d.]+)/i)
  if (match && match[1]) {
    // Xóa dấu . để lấy số rồi format lại theo chuẩn Việt
    const amount = parseInt(match[1].replace(/\./g, ''))
    return isNaN(amount)
      ? '0đ'
      : amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'
  }
  return '0đ'
}

</script>



<style scoped>
.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.6em;
}

.overlay-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>
