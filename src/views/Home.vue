<template>
    <div class="page-layout">
        <Header />

        <main class="flex-fill" id="main-content">
            <!-- Banner chào mừng -->
            <section class="text-center mb-5">
                <img src="/images/banner.png" style="max-width: 200px;" />
                <h2 class="fw-bold mt-3">Chào mừng bạn đến với Thư viện!</h2>
                <p class="text-muted">Hàng ngàn đầu sách chờ bạn khám phá...</p>
            </section>

            <!-- 3 Cột chính -->
            <div class="container-fluid">
                <div class="row">
                    <!-- Cột 1: Thông tin thư viện -->
                    <div class="col-md-2 mb-4 bg-light p-3">
                        <h5>📘 Thông báo</h5>
                        <p class="text-muted small">Giới thiệu, thời gian mở cửa, địa chỉ...</p>
                    </div>

                    <!-- Cột 2: Sách tiêu biểu -->
                    <div class="col-md-8 mb-4">
                        <h5 class="mb-4">✨ Sách tiêu biểu</h5>
                        <div class="scrollable-content">
                            <div class="row justify-content-center">
                                <div class="col-md-4 mb-4" v-for="book in books" :key="book._id">
                                    <router-link :to="`/books/${book._id}`" class="text-decoration-none text-dark">
                                        <div class="card h-100 shadow-sm">
                                            <img :src="`http://localhost:3000/${book.BiaSach}`" class="card-img-top" />
                                            <div class="card-body text-start">
                                                <h6 class="card-title fw-bold">{{ book.TenSach }}</h6>
                                                <p class="card-text text-muted mb-1">Tác giả: {{ book.TacGia }}</p>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div> 
                        </div>
                    </div>

                    <!-- Cột 3: Tin tức -->
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

        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.service';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const books = ref([]);

onMounted(async () => {
  try {
    const response = await api.get("/books");
    books.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải sách:", error);
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
    height: 1000px;
}

/* Ảnh logo */
#main-content img {
    margin-bottom: 10px;
}

/* Card sách */
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-radius: 12px;
    overflow: hidden;
    border: none;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* Ảnh sách */
.card-img-top {
    height: 220px;
    object-fit: cover;
    border-bottom: 1px solid #eee;
}

/* Tiêu đề sách */
.card-title {
    font-size: 1rem;
    margin-bottom: 0.3rem;
    color: #333;
}

/* Văn bản bên trong */
.card-text {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.2rem;
}

/* Chỉnh padding */
.card-body {
    padding: 0.8rem 1rem;
}

/* Làm cho cột 1 và 3 đứng yên khi scroll */
.col-md-2 {
  position: sticky;
  top: 0px; /* chỉnh theo độ cao Header nếu cần */
  align-self: flex-start;
  height: fit-content;
}

/* Cho cột 2 scroll độc lập */
.scrollable-content {
  max-height: 80vh; /* chiều cao tối đa */
  padding-right: 8px; /* tránh đè scrollbar */
}

</style>
  
