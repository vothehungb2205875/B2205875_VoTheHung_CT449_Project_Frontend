<template>
  <div class="page-layout">
    <main class="flex-fill" id="main-content">
      <!-- Banner -->
      <section class="text-center mb-5">
        <img src="/images/banner.png" style="max-width: 200px;" />
        <h2 class="fw-bold mt-3">Chào mừng bạn đến với CTLIB!</h2>
        <p class="text-muted">Hàng ngàn đầu sách chờ bạn khám phá...</p>
      </section>

      <!-- 3 Cột -->
      <div class="container-fluid">
        <div class="row">
          <!-- Cột trái -->
          <div class="col-md-2 mb-4">
            <div class="sidebar-sticky bg-light p-3 rounded shadow-sm">
              <h5>📘 Thông báo</h5>
              <ul class="list-unstyled small">
                <li v-for="(item, i) in thongbaos" :key="i">
                  <a href="https://www.ctu.edu.vn/thong-bao.html" class="text-decoration-none d-block text-dark small">📢 {{ item.NoiDung }}</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Cột giữa -->
          <div class="col-md-8 mb-4">
            <h5 class="mb-4">✨ Sách tiêu biểu</h5>
            <div class="d-flex flex-column gap-3">
              <div v-for="(book, index) in books" :key="book._id" class="card h-100 text-center shadow-sm border-0 p-2">
                <router-link :to="`/books/${book._id}`" class="text-decoration-none text-dark">
                  <div class="d-flex align-items-center">
                    <img :src="`http://localhost:3000/${book.BiaSach}`" class="book-cover me-3" />
                    <div class="text-start">
                      <h6 class="mb-1 fw-semibold">{{ index + 1 }}. {{ book.TenSach }}</h6>
                      <div class="text-muted small">Tác giả: {{ book.TacGia }}</div>
                      <div class="" :class="{
                        'text-success': book.SoQuyen > 0,
                        'text-danger': book.SoQuyen === 0
                      }">
                        Còn: {{ book.SoQuyen }} – Lượt xem: {{ book.LuotXem }}
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="col-md-2 mb-4">
            <div class="sidebar-sticky bg-light p-3 rounded shadow-sm">
              <h5>🗓️ Sự kiện</h5>
              <ul class="list-unstyled small">
                <li v-for="(item, i) in sukien" :key="i">
                  <a href="https://events.ctu.edu.vn/" class="text-decoration-none d-block text-dark small">🎉 {{ item.NoiDung }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Vai trò Thư viện Số -->
      <section class="digital-library-section mt-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-5 mb-3 mb-md-0">
              <img src="/images/ht_06-05-2025.jpg" alt="Thư viện số" class="img-fluid rounded shadow-sm" />
            </div>
            <div class="col-md-7">
              <h4 class="fw-bold mb-3">📖 Vai trò của Thư viện Số trong thời đại 4.0</h4>
              <p class="text-muted">
                Thư viện số đóng vai trò quan trọng trong việc cung cấp tri thức không giới hạn về không gian và thời gian.
              </p>
              <ul class="text-muted small ps-3">
                <li>🌐 Truy cập nhanh chóng từ bất kỳ đâu</li>
                <li>📱 Tương thích đa thiết bị</li>
                <li>🔍 Tìm kiếm thông minh</li>
                <li>🔐 Quản lý truy cập & bảo mật thông tin</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div class="section-divider">
        <img src="/images/asset-957.png" alt="divider" class="img-separator" />
      </div>
      <!-- Nhà xuất bản đồng hành -->
      <section class="partner-section">
        <div class="container">
          <h4 class="fw-bold mb-4 text-center">🤝 Nhà xuất bản đồng hành</h4>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="d-flex align-items-start bg-white p-4 rounded shadow-sm h-100">
                <img src="/images/nxbvnuhcm.png" alt="NXB ĐHQG TPHCM" class="me-3" style="width: 80px; height: 80px; object-fit: contain;" />
                <div>
                  <h6 class="fw-bold mb-1">NXB ĐHQG TP.HCM</h6>
                  <p class="small text-muted mb-0">
                    Nhà xuất bản học thuật uy tín, chuyên cung cấp sách nghiên cứu và giáo trình chất lượng cao.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex align-items-start bg-white p-4 rounded shadow-sm h-100">
                <img src="/images/logo.png" alt="NXB Đại học Cần Thơ" class="me-3" style="width: 80px; height: 80px; object-fit: contain;" />
                <div>
                  <h6 class="fw-bold mb-1">NXB Đại học Cần Thơ</h6>
                  <p class="small text-muted mb-0">
                    Xuất bản nhiều tài liệu chuyên ngành, phục vụ cho công tác giảng dạy và nghiên cứu tại khu vực ĐBSCL.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Thống kê độc giả -->
      <section class="reader-statistic-section py-5" ref="statSection">
        <div class="container">
          <h4 class="fw-bold text-center mb-4">Những con số nổi bật</h4>
          <div class="row g-4 justify-content-center text-center">
            <div class="col-md-6 col-lg-3" v-for="item in stats" :key="item.label">
              <div class="stat-box p-4 h-100">
                <i :class="['stat-icon', 'mb-2', item.iconClass]"></i>
                <h2 class="text-sta fw-bold">{{ item.displayed }}</h2>
                <h6 class="text-muted mt-2">{{ item.label }}</h6>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="section-divider">
        <img src="/images/asset-957.png" alt="divider" class="img-separator" />
      </div>

    </main>
  </div>
</template>


<script setup>
import { ref, onMounted, nextTick  } from 'vue';
import BookService from '@/services/book.service';
import NotifyService from '@/services/notify.service';
import BorrowService from '@/services/borrow.service'
import ReaderService from '@/services/reader.service'

const books = ref([]);
const thongbaos = ref([]);
const sukien = ref([]);
const stats = ref([
  { label: 'Tổng số độc giả', value: 0, displayed: 0, iconClass: 'fas fa-book-open-reader' },
  { label: 'Độc giả mới trong tháng', value: 0, displayed: 0, iconClass: 'fas fa-user-plus' },
  { label: 'Lượt mượn trong tháng', value: 0, displayed: 0, iconClass: 'fas fa-arrows-rotate' }
])

const statSection = ref(null)
const animationStarted = ref(false)

onMounted(async () => {
  try {
    books.value = await BookService.getTopViewed()
    const notifies = await NotifyService.getAll()
    thongbaos.value = notifies.filter(n => n.Loai === 'thongbao')
    sukien.value = notifies.filter(n => n.Loai === 'sukien')

    const readerStat = await ReaderService.statistic()
    const borrowStat = await BorrowService.statistic()

    stats.value[0].value = readerStat.totalReaders
    stats.value[1].value = readerStat.newReadersThisMonth
    stats.value[2].value = borrowStat.soLuotMuon

    await nextTick()
    observeSection()
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu trang chủ:', err)
  }
})

function observeSection() {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && !animationStarted.value) {
        animationStarted.value = true
        stats.value.forEach(stat => animateCount(stat))
        observer.disconnect() // stop observing
      }
    },
    {
      threshold: 0.6, // cần vào 60% mới chạy
      rootMargin: '0px 0px -100px 0px' // tránh chạy quá sớm
    }
  )
  if (statSection.value) {
    observer.observe(statSection.value)
  }
}

// Tăng số từ 0 đến giá trị đúng, mượt
function animateCount(stat) {
  const duration = 100
  const start = 0
  const end = stat.value
  const startTime = performance.now()

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    stat.displayed = Math.floor(progress * (end - start) + start)

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      stat.displayed = end
    }
  }

  requestAnimationFrame(update)
}

</script>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 20px 0;
}

/* Sticky sidebar */
.sidebar-sticky {
  position: sticky;
  top: 60px;
  z-index: 2;
}

/* Ảnh bìa sách */
.book-cover {
  width: 80px;
  height: 120px;
  object-fit: contain;
  background-color: #f9f9f9;
  padding: 4px;
  border: 1px solid #eee;
  border-radius: 6px;
}

.partner-section {
  background-color: #f8f9fa;
  padding: 40px 0;
  border-top: 1px solid #ddd;
}

.stat-icon {
  font-size: 120px;
  color: #0d6efd;
}

.text-sta {
  font-size: 60px;
}

.section-divider {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.img-separator {
  max-width: 1500px;
  width: 100%;
  height: auto;
  opacity: 0.8;
}

</style>
