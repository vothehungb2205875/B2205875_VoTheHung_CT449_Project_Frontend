<template>
    <div class="page-layout">
  
      <main class="flex-fill mb-5">
        <div class="container mt-5" v-if="book">
          <div class="row">
            <!-- Hình ảnh sách -->
            <div class="col-md-4 d-flex justify-content-center align-items-start">
              <img
                :src="`http://localhost:3000/${book.BiaSach}`"
                class="book-image shadow-sm"
                alt="Bìa sách"
              />
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
              </div>
            </div>
          </div>
        </div>
      </main>
  
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import BookService from '@/services/book.service'
  
  const router = useRouter()
  const route = useRoute()
  const book = ref(null)
  
  const goBack = () => router.back()
  
  onMounted(async () => {
    try {
      book.value = await BookService.get(route.params.id);
    } catch (err) {
      console.error('Không tìm thấy sách:', err);
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
  }
  
  /* Ảnh sách cố định kích thước */
  .book-image {
    width: 300px;
    height: 400px;
    object-fit: cover;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    padding: 5px;
  }
  
  /* Khung thông tin sách */
  .book-info-box {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fafafa;
    padding: 20px;
  }
  
  button.btn {
    font-size: 0.9rem;
  }
  </style>
  