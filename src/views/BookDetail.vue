<template>
  <div class="page-layout">
    <main class="flex-fill mb-5">
      <div class="container mt-5" v-if="book">
        <div class="row">
          <!-- Hình ảnh sách -->
          <div class="col-md-4 d-flex justify-content-center align-items-start">
            <img :src="`http://localhost:3000/${book.BiaSach}`" class="book-image shadow-sm" />
          </div>

          <!-- Thông tin sách -->
          <div class="col-md-8">
            <div class="book-info-box shadow-sm rounded p-4 bg-white">
              <button class="btn btn-secondary mb-3" @click="goBack">
                <font-awesome-icon :icon="['fas', 'arrow-left']" /> Quay lại
              </button>

              <h2 class="fw-bold mb-3">{{ book.TenSach }}</h2>
              <p><strong>Tác giả:</strong> {{ book.TacGia }}</p>
              <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</p>
              <p><strong>Giá:</strong> {{ book.DonGia.toLocaleString() }}₫</p>
              <p><strong>Số quyển còn:</strong> {{ book.SoQuyen }}</p>
              <p><strong>Nhà xuất bản:</strong> {{ book.MaNXB }}</p>

              <div v-if="book.SoQuyen > 0" class="mt-4">
                <button class="btn btn-primary" @click="showForm = !showForm">
                  Đăng ký mượn sách
                </button>
              </div>

              <div v-if="showForm" class="mt-4 border-top pt-3">
                <div class="mb-3">
                  <label class="form-label">Ngày nhận sách:</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="startDate"
                    :min="today"
                    :max="maxBorrowDate"
                  />
                  <div v-if="startDateWarning" class="text-danger small mt-1">
                    Chỉ được chọn hôm nay hoặc ngày mai.
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Ngày trả sách:</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="endDate"
                    :min="startDate"
                    :max="maxReturnDate"
                  />
                  <div v-if="dateWarning" class="text-danger small mt-1">
                    Ngày trả sách không được quá 7 ngày kể từ ngày nhận.
                  </div>
                </div>

                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="agreeTerms" v-model="agreed" />
                  <label class="form-check-label" for="agreeTerms">
                    Tôi đồng ý với điều khoản và chính sách mượn sách.
                  </label>
                </div>

                <button class="btn btn-success" :disabled="!canSubmit" @click="handleBorrow">
                  Xác nhận mượn sách
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookService from '@/services/book.service'
import BorrowService from '@/services/borrow.service'

const router = useRouter()
const route = useRoute()

const book = ref(null)
const showForm = ref(false)
const startDate = ref('')
const endDate = ref('')
const agreed = ref(false)

const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  } else {
    alert("Bạn cần đăng nhập để mượn sách.")
    router.push("/login")
  }
})

const today = new Date().toISOString().split('T')[0]

const maxBorrowDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const maxReturnDate = computed(() => {
  if (!startDate.value) return ''
  const d = new Date(startDate.value)
  d.setDate(d.getDate() + 7)
  return d.toISOString().split('T')[0]
})

const startDateWarning = computed(() => {
  if (!startDate.value) return false
  return startDate.value > maxBorrowDate.value
})

const dateWarning = computed(() => {
  if (!startDate.value || !endDate.value) return false
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  return (end - start) / (1000 * 60 * 60 * 24) > 7
})

const canSubmit = computed(() => {
  return (
    startDate.value &&
    endDate.value &&
    !dateWarning.value &&
    !startDateWarning.value &&
    agreed.value
  )
})

onMounted(async () => {
  try {
    book.value = await BookService.get(route.params.id)
  } catch (err) {
    console.error('Không tìm thấy sách:', err)
  }
})

const goBack = () => router.back()

const toYYYYMMDD = (dateStr) => {
  const d = new Date(dateStr)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const handleBorrow = async () => {
  try {
    if (!user.value || !user.value.MaDocGia) {
      alert("Không xác định được thông tin người dùng.")
      return
    }

    await BorrowService.create({
      MaSach: book.value.MaSach,
      MaDocGia: user.value.MaDocGia,
      NgayMuon: new Date(startDate.value),
      NgayTra: new Date(endDate.value)
    })


    alert("Mượn sách thành công")
    book.value = await BookService.get(route.params.id)
    showForm.value = false
  } catch (err) {
    const message = err.response?.data?.message || "Lỗi khi mượn sách"
    alert(message)

    if (message.includes("Vui lòng cập nhật thông tin độc giả trước khi mượn sách")) {
      router.push("/profile")
    }
  }
}
</script>

<style scoped>
.book-image {
  width: 300px;
  height: 400px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  padding: 5px;
}
</style>
