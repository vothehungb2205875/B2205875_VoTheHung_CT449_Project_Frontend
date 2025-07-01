<template>
  <div class="page-layout">
    <main class="flex-fill" id="main-content">
      <!-- Tìm kiếm -->
      <section class="mb-4">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="🔍 Tìm kiếm sách theo tên..." />
      </section>

      <div class="container-fluid">
        <div class="row">
          <!-- Sidebar bộ lọc -->
          <aside class="col-md-3 mb-4 bg-light p-3 rounded shadow-sm">
            <BookFilters v-model="filter" :genres="genres" :nxbs="nxbs" layout="vertical" />
          </aside>

          <!-- Danh sách sách -->
          <section class="col-md-9">
            <!-- Nếu có sách -->
            <div class="row booklist" v-if="paginatedBooks.length">
              <div class="col-6 col-md-4 col-lg-3 mb-4" v-for="book in paginatedBooks" :key="book._id">
                <router-link :to="`/books/${book._id}`" class="text-decoration-none text-dark">
                  <div class="card h-100 text-center shadow-sm border-0">
                    <img :src="`http://localhost:3000/${book.BiaSach}`" class="book-cover card-img-top" />
                    <div class="card-body p-2">
                      <h6 class="book-title text-truncate fw-semibold mb-1">{{ book.TenSach }}</h6>
                      <div class="book-author text-muted small">Tác giả: {{ book.TacGia }}</div>
                      <div class="book-stock fs-6" :class="{
                        'text-success': book.SoQuyen > 0,
                        'text-danger': book.SoQuyen === 0
                      }">
                        Còn: {{ book.SoQuyen }}
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Nếu không có sách -->
            <div v-else class="text-center py-5 text-muted">
              <h5>🔍 Không có kết quả phù hợp</h5>
              <p>Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
            </div>

            <!-- Phân trang -->
            <div class="d-flex justify-content-center mt-4" v-if="totalPages > 1 && paginatedBooks.length">
              <nav>
                <ul class="pagination">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="goToPage(currentPage - 1)">«</button>
                  </li>
                  <li class="page-item" v-for="page in totalPages" :key="page"
                    :class="{ active: currentPage === page }">
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
          </section>

        </div>
      </div>
    </main>

    <div class="section-divider">
      <img src="/images/asset-957.png" alt="divider" class="img-separator" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import debounce from 'lodash/debounce'
import BookService from '@/services/book.service'
import BookFilters from '@/components/BookFilters.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q || '')
const filter = ref({
  genre: route.query.genre || '',
  nxb: route.query.nxb || '',
  year: route.query.year || ''
})

const genres = [
  'Công nghệ thông tin',
  'Luật',
  'Kinh tế',
  'Kỹ thuật',
  'Nông nghiệp, thủy sản'
]
const nxbs = ref([])

const books = ref([])
const totalBooks = ref(0)
const currentPage = ref(Number(route.query.page) || 1)
const booksPerPage = 12

// Hàm cập nhật URL query
function updateQuery() {
  const query = {
    q: searchQuery.value || undefined,
    genre: filter.value.genre || undefined,
    nxb: filter.value.nxb || undefined,
    year: filter.value.year || undefined,
    ...(currentPage.value > 1 ? { page: currentPage.value } : {})
  }
  router.replace({ query })
}

// Gọi API
async function fetchBooks() {
  try {
    const params = {
      q: searchQuery.value || undefined,
      genre: filter.value.genre || undefined,
      nxb: filter.value.nxb || undefined,
      year: filter.value.year || undefined,
      page: currentPage.value,
      limit: booksPerPage
    }

    const res = await BookService.getFiltered(params)
    books.value = res.data
    totalBooks.value = res.total
  } catch (err) {
    console.error('Lỗi khi tải sách:', err)
  }
}

// Lần đầu mount
onMounted(async () => {
  const res = await BookService.getFilters()
  nxbs.value = res.nxbs || []
  fetchBooks()
})

// Watch tìm kiếm
watch(
  searchQuery,
  debounce(() => {
    currentPage.value = 1
    updateQuery()
    fetchBooks()
  }, 400)
)

// Watch bộ lọc nâng cao
watch(
  () => ({ ...filter.value }),
  () => {
    currentPage.value = 1
    updateQuery()
    fetchBooks()
  },
  { deep: true }
)

// Watch phân trang
watch(currentPage, () => {
  updateQuery()
  fetchBooks()
})

const totalPages = computed(() =>
  Math.ceil(totalBooks.value / booksPerPage)
)
const paginatedBooks = computed(() => books.value)

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
