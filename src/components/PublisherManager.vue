<template>
    <div class="container py-4">
      <h4>Quản lý Nhà Xuất Bản</h4>
  
      <!-- Tìm kiếm -->
      <input
        type="text"
        v-model="search"
        class="form-control my-3"
        placeholder="Tìm kiếm theo tên NXB..."
      />
  
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-primary" @click="addPublisher">Thêm NXB</button>
  
        <div class="d-flex align-items-center gap-2">
          <label class="mb-0">Số dòng/trang:</label>
          <select v-model="itemsPerPage" class="form-select w-auto">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </div>
      </div>
  
      <!-- Bảng dữ liệu -->
      <div class="table-responsive" style="min-height: 300px;">
        <table class="table table-bordered table-hover table-sm align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã NXB</th>
              <th>Tên NXB</th>
              <th>Địa chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="publisher in publishers" :key="publisher._id">
              <td>{{ publisher.MaNXB }}</td>
              <td class="truncate" :title="publisher.TenNXB">{{ publisher.TenNXB }}</td>
              <td class="truncate" :title="publisher.DiaChi">{{ publisher.DiaChi }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-2" @click="editPublisher(publisher)">Sửa</button>
                <button class="btn btn-sm btn-outline-danger" @click="deletePublisher(publisher)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Phân trang -->
      <nav class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">«</button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">»</button>
          </li>
        </ul>
      </nav>
  
      <!-- Modal -->
      <PublisherFormModal
        v-model="showModal"
        :publisher="selectedPublisher"
        :mode="modalMode"
        @save="handleSave"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import PublisherService from '@/services/publisher.service'
  import PublisherFormModal from '@/components/PublisherFormModal.vue'
  
  const publishers = ref([])
  const totalPublishers = ref(0)
  const search = ref('')
  const showModal = ref(false)
  const selectedPublisher = ref(null)
  const modalMode = ref('add')
  
  // Phân trang
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  
  async function loadPublishers() {
    try {
      const params = {
        q: search.value || undefined,
        page: currentPage.value,
        limit: itemsPerPage.value
      }
      const res = await PublisherService.getFiltered(params)
      publishers.value = res.data
      totalPublishers.value = res.total
    } catch (e) {
      console.error('Lỗi khi tải danh sách NXB:', e)
    }
  }
  
  onMounted(loadPublishers)
  
  watch([search, itemsPerPage], () => {
    currentPage.value = 1
    loadPublishers()
  })
  
  watch(currentPage, loadPublishers)
  
  const totalPages = computed(() =>
    Math.ceil(totalPublishers.value / itemsPerPage.value)
  )
  
  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  
  function addPublisher() {
    selectedPublisher.value = null
    modalMode.value = 'add'
    showModal.value = true
  }
  
  function editPublisher(publisher) {
    selectedPublisher.value = { ...publisher }
    modalMode.value = 'edit'
    showModal.value = true
  }
  
  async function handleSave(publisher) {
    try {
      if (modalMode.value === 'add') {
        await PublisherService.create(publisher)
      } else if (modalMode.value === 'edit' && publisher._id) {
        await PublisherService.update(publisher._id, publisher)
      }
      loadPublishers()
    } catch (e) {
      console.error('Lỗi khi lưu NXB:', e)
    }
  }
  
  async function deletePublisher(publisher) {
    if (!confirm(`Xác nhận xóa "${publisher.TenNXB}"?`)) return
    try {
      await PublisherService.delete(publisher._id)
      loadPublishers()
    } catch (e) {
      console.error('Lỗi khi xóa NXB:', e)
    }
  }
  </script>
  
  <style scoped>
  .table td,
  .table th {
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  th:nth-child(1), td:nth-child(1) { width: 100px; }
  th:nth-child(2), td:nth-child(2) { max-width: 250px; }
  th:nth-child(3), td:nth-child(3) { max-width: 300px; }
  th:nth-child(4), td:nth-child(4) { width: 130px; text-align: center; }
  .truncate {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  </style>
  