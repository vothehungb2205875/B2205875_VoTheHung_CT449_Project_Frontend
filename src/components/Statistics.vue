<template>
  <div class="container py-5">
    <h2 class="mb-4 fw-bold text-center">
      Thống kê - Tháng {{ currentMonth }}/{{ currentYear }}
    </h2>

    <div class="row g-4 justify-content-center mt-5">
      <div class="col-md-6 col-lg-4" v-for="item in stats" :key="item.label">
        <div class="card shadow-sm text-center p-4">
          <h5 class="text-muted mb-2">{{ item.label }}</h5>
          <h2 class="fw-bold text-primary">{{ item.value }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ReaderService from '@/services/reader.service'
import BorrowService from '@/services/borrow.service'

// Dữ liệu thống kê
const totalReaders = ref(0)
const newReadersThisMonth = ref(0)
const borrowsThisMonth = ref(0)
const borrowsExpiredThisMonth = ref(0)
const today = new Date()
const currentMonth = today.getMonth() + 1 // Tháng trong JS: 0 = Jan
const currentYear = today.getFullYear()


onMounted(async () => {
  try {
    const readerStat = await ReaderService.statistic()
    const borrowStat = await BorrowService.statistic()
    totalReaders.value = readerStat.totalReaders
    newReadersThisMonth.value = readerStat.newReadersThisMonth
    borrowsThisMonth.value = borrowStat.soLuotMuon
    borrowsExpiredThisMonth.value = borrowStat.soLuotQuaHan

  } catch (error) {
    console.error("Lỗi khi tải thống kê:", error)
  }
})

// Tạo danh sách để render UI dễ
const stats = [
  { label: 'Tổng số độc giả', value: totalReaders },
  { label: 'Độc giả mới trong tháng', value: newReadersThisMonth },
  { label: 'Lượt mượn trong tháng', value: borrowsThisMonth },
  { label: 'Lượt quá hạn mượn trong tháng', value: borrowsExpiredThisMonth },
]
</script>

<style scoped>
.card {
  border-left: 5px solid #0d6efd;
  transition: transform 0.2s ease;
  cursor: pointer;
}
.card:hover {
  transform: scale(1.03);
}
</style>
