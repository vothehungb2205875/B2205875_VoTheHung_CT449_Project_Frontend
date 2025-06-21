<template>
  <div class="container py-5">
    <h2 class="mb-4 fw-bold text-center">Thống kê thư viện</h2>

    <div class="row g-4">
      <div class="col-md-6 col-lg-3" v-for="item in stats" :key="item.label">
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

// Dữ liệu thống kê
const totalReaders = ref(0)
const newReadersThisMonth = ref(0)
const borrowsThisMonth = ref(0)
const overdueBorrows = ref(0)

// Gọi API tại đây (giả lập)
onMounted(async () => {
  // Gọi API thật nếu có, ví dụ:
  // totalReaders.value = await ReaderService.countAll()
  // newReadersThisMonth.value = await ReaderService.countNewInMonth()
  // borrowsThisMonth.value = await BorrowService.countBorrowsInMonth()
  // overdueBorrows.value = await BorrowService.countOverdues()

  // Dữ liệu demo
  totalReaders.value = 120
  newReadersThisMonth.value = 8
  borrowsThisMonth.value = 56
  overdueBorrows.value = 4
})

// Tạo danh sách để render UI dễ
const stats = [
  { label: 'Tổng số độc giả', value: totalReaders },
  { label: 'Độc giả mới trong tháng', value: newReadersThisMonth },
  { label: 'Lượt mượn trong tháng', value: borrowsThisMonth },
  { label: 'Lượt mượn quá hạn', value: overdueBorrows }
]
</script>

<style scoped>
.card {
  border-left: 5px solid #0d6efd;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: scale(1.03);
}
</style>
