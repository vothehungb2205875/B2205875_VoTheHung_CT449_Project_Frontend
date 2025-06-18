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
          <!-- Cột trái -->
          <div class="col-md-2 mb-4 bg-light p-3">
            <h5>📘 Thông báo</h5>
            <p class="text-muted small">Giới thiệu, thời gian mở cửa, địa chỉ...</p>
          </div>

          <!-- Cột giữa: Sách tiêu biểu -->
          <div class="col-md-8 mb-4">
            <h5 class="mb-4">✨ Sách tiêu biểu</h5>
            <div class="row justify-content-center">
              <div class="col-6 col-md-3 mb-4" v-for="book in books" :key="book._id">
                <router-link
                  :to="`/books/${book._id}`"
                  class="text-decoration-none text-dark"
                >
                  <div class="card h-100 text-center shadow-sm border-0">
                    <img :src="`http://localhost:3000/${book.BiaSach}`" class="book-cover card-img-top" />
                    <div class="card-body p-2">
                      <h6 class="book-title text-truncate fw-semibold mb-1">{{ book.TenSach }}</h6>
                      <div class="book-author text-muted small">Tác giả: {{ book.TacGia }}</div>
                      <div
                        class="book-stock small"
                        :class="{
                          'text-success': book.SoQuyen >= 3,
                          'text-warning': book.SoQuyen > 0 && book.SoQuyen < 3,
                          'text-danger': book.SoQuyen === 0
                        }"
                      >
                        Còn: {{ book.SoQuyen }}
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Cột phải -->
          <div class="col-md-2 mb-4 bg-light p-3">
            <h5>📰 Tin tức</h5>
            <ul class="list-unstyled small">
              <li>📅 Sự kiện tháng 6</li>
              <li>📚 Sách mới về</li>
              <li>🎁 Ưu đãi mùa hè</li>
            </ul>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BookService from '@/services/book.service';

const books = ref([]);

onMounted(async () => {
  try {
    books.value = await BookService.getTopViewed(); // Gọi top books
  } catch (error) {
    console.error("Lỗi khi tải sách tiêu biểu:", error);
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

/* Banner */
#main-content img {
  margin-bottom: 10px;
}

/* Card tổng thể */
.card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* Ảnh bìa sách */
.book-cover {
  width: 100%;
  height: 160px;
  object-fit: contain;
  background-color: #f9f9f9;
  padding: 4px;
  border-bottom: 1px solid #eee;
}

/* Tên sách */
.book-title {
  font-size: 0.9rem;
  height: 2.2em;
  line-height: 1.1em;
  overflow: hidden;
}

/* Tác giả & số lượng */
.book-author,
.book-stock {
  font-size: 0.75rem;
  color: #555;
}

/* Sticky side columns */
.col-md-2 {
  position: sticky;
  top: 50px;
  align-self: flex-start;
  height: fit-content;
}
</style>
