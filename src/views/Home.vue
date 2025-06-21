<template>
  <div class="page-layout">
    <main class="flex-fill" id="main-content">
      <!-- Banner -->
      <section class="text-center mb-5">
        <img src="/images/banner.png" style="max-width: 200px;" />
        <h2 class="fw-bold mt-3">Chào mừng bạn đến với Thư viện!</h2>
        <p class="text-muted">Hàng ngàn đầu sách chờ bạn khám phá...</p>
      </section>

      <!-- 3 Cột -->
      <div class="container-fluid">
        <div class="row">
          <!-- Cột trái: Sticky -->
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

          <!-- Cột giữa: Sách tiêu biểu -->
          <div class="col-md-8 mb-4">
            <h5 class="mb-4">✨ Sách tiêu biểu</h5>
            <div class="d-flex flex-column gap-3">
              <div
                v-for="(book, index) in books"
                :key="book._id"
                class="card h-100 text-center shadow-sm border-0 p-2"
              >
                <router-link
                  :to="`/books/${book._id}`"
                  class="text-decoration-none text-dark"
                >
                  <div class="d-flex align-items-center">
                    <img
                      :src="`http://localhost:3000/${book.BiaSach}`"
                      class="book-cover me-3"
                    />
                    <div class="text-start">
                      <h6 class="mb-1 fw-semibold">
                        {{ index + 1 }}. {{ book.TenSach }}
                      </h6>
                      <div class="text-muted small">Tác giả: {{ book.TacGia }}</div>
                      <div
                        class="small"
                        :class="{
                          'text-success': book.SoQuyen >= 3,
                          'text-warning': book.SoQuyen > 0 && book.SoQuyen < 3,
                          'text-danger': book.SoQuyen === 0
                        }"
                      >
                        Còn: {{ book.SoQuyen }} – Lượt xem: {{ book.LuotXem }}
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Cột phải: Sticky -->
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
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BookService from '@/services/book.service';
import NotifyService from '@/services/notify.service';

const books = ref([]);
const thongbaos = ref([]);
const sukien = ref([]);

onMounted(async () => {
  try {
    const result = await BookService.getTopViewed();
    books.value = result;

    const allNotifies = await NotifyService.getAll();
    thongbaos.value = allNotifies.filter((n) => n.Loai === "thongbao");
    sukien.value = allNotifies.filter((n) => n.Loai === "sukien");
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
});

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
</style>
