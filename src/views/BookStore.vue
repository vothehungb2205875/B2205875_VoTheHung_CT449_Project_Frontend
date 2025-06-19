<template>
    <div class="page-layout">
      <main class="flex-fill" id="main-content">
        <!-- Thanh tìm kiếm -->
        <section class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="🔍 Tìm kiếm sách theo tên..."
          />
        </section>
  
        <div class="container-fluid">
          <div class="row">
            <!-- Sidebar bộ lọc -->
            <div class="col-md-2 mb-4 bg-light p-3">
              <h5>📂 Lọc theo thể loại</h5>
              <select v-model="selectedGenre" class="form-select mt-2">
                <option value="">Tất cả</option>
                <option v-for="genre in genres" :key="genre" :value="genre">
                  {{ genre }}
                </option>
              </select>
            </div>
  
            <!-- Danh sách sách -->
            <div class="col-md-10">
              <div class="row">
                <div
                  class="col-6 col-md-3 mb-4"
                  v-for="book in paginatedBooks"
                  :key="book._id"
                >
                  <router-link
                    :to="`/books/${book._id}`"
                    class="text-decoration-none text-dark"
                  >
                    <div class="card h-100 text-center shadow-sm border-0">
                      <img
                        :src="`http://localhost:3000/${book.BiaSach}`"
                        class="book-cover card-img-top"
                      />
                      <div class="card-body p-2">
                        <h6 class="book-title text-truncate fw-semibold mb-1">
                          {{ book.TenSach }}
                        </h6>
                        <div class="book-author text-muted small">
                          Tác giả: {{ book.TacGia }}
                        </div>
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
  
              <!-- Phân trang -->
              <div class="d-flex justify-content-center mt-4">
                <nav>
                  <ul class="pagination">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link" @click="goToPage(currentPage - 1)">«</button>
                    </li>
                    <li
                      class="page-item"
                      v-for="page in totalPages"
                      :key="page"
                      :class="{ active: currentPage === page }"
                    >
                      <button class="page-link" @click="goToPage(page)">
                        {{ page }}
                      </button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link" @click="goToPage(currentPage + 1)">»</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import BookService from '@/services/book.service'
  
  const route = useRoute()
  const router = useRouter()
  
  const searchQuery = ref(route.query.q || '')
  const selectedGenre = ref(route.query.genre || '')
  const genres = ['Công nghệ thông tin', 'Luật', 'Kinh tế', 'Kỹ thuật', 'Nông nghiệp, thủy sản']
  
  const books = ref([])
  const currentPage = ref(1)
  const booksPerPage = 12
  
  // Gọi API có lọc từ backend
  const fetchBooks = async () => {
    try {
      const params = {}
      if (selectedGenre.value) params.genre = selectedGenre.value
      if (searchQuery.value) params.q = searchQuery.value
  
      books.value = await BookService.getFiltered(params)
    } catch (err) {
      console.error('Lỗi khi tải danh sách sách:', err)
    }
  }
  
  // Khởi động ban đầu
  onMounted(fetchBooks)
  
  // Cập nhật URL và gọi lại API khi filter thay đổi
  watch([searchQuery, selectedGenre], () => {
    router.replace({
      query: {
        q: searchQuery.value || undefined,
        genre: selectedGenre.value || undefined
      }
    })
  
    currentPage.value = 1
    fetchBooks()
  })
  
  // Phân trang phía FE
  const totalPages = computed(() => Math.ceil(books.value.length / booksPerPage))
  
  const paginatedBooks = computed(() => {
    const start = (currentPage.value - 1) * booksPerPage
    return books.value.slice(start, start + booksPerPage)
  })
  
  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
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
  
  .book-cover {
    width: 100%;
    height: 160px;
    object-fit: contain;
    background-color: #f9f9f9;
    padding: 4px;
    border-bottom: 1px solid #eee;
  }
  
  .book-title {
    font-size: 0.9rem;
    height: 2.2em;
    line-height: 1.1em;
    overflow: hidden;
  }
  
  .book-author,
  .book-stock {
    font-size: 0.75rem;
    color: #555;
  }
  
  .col-md-2 {
    position: sticky;
    top: 80px;
    align-self: flex-start;
    height: fit-content;
  }
  </style>
  