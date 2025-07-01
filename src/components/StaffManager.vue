<template>
    <div class="container py-4">
      <h4>Quản lý Nhân viên</h4>
  
      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: currentTab === 'active' }" href="#" @click.prevent="switchTab('active')">Hoạt động</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: currentTab === 'inactive' }" href="#" @click.prevent="switchTab('inactive')">Đã vô hiệu hóa</a>
        </li>
      </ul>
  
      <input type="text" v-model="search" class="form-control my-3" placeholder="Tìm kiếm nhân viên..." />
  
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-primary" @click="addStaff">Thêm nhân viên</button>
        <div>
          <label class="me-2">Số dòng:</label>
          <select v-model="itemsPerPage" class="form-select d-inline-block w-auto">
            <option :value="5">5</option>
            <option :value="10">10</option>
          </select>
        </div>
      </div>
  
      <table class="table table-bordered table-hover table-sm align-middle">
        <thead class="table-light">
          <tr>
            <th>Mã NV</th>
            <th>Họ tên</th>
            <th>Chức vụ</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in staffs" :key="staff._id">
            <td>{{ staff.MSNV }}</td>
            <td>{{ staff.HoTenNV }}</td>
            <td>{{ staff.ChucVu }}</td>
            <td>{{ staff.email }}</td>
            <td>{{ staff.SoDienThoai }}</td>
            <td>
              <button class="btn btn-sm"
                :class="currentTab === 'inactive' ? 'btn-outline-success' : 'btn-outline-primary me-2'"
                @click="currentTab === 'inactive' ? restoreStaff(staff) : editStaff(staff)">
                {{ currentTab === 'inactive' ? 'Khôi phục' : 'Sửa' }}
              </button>
              <button v-if="currentTab === 'active'" class="btn btn-sm btn-outline-danger" @click="deactivateStaff(staff)">
                Vô hiệu hóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <nav>
        <ul class="pagination justify-content-center mt-3">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">«</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">»</button>
          </li>
        </ul>
      </nav>
  
      <StaffFormModal v-model="showModal" :staff="selectedStaff" :mode="modalMode" @save="handleSave" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import StaffService from '@/services/staff.service'
  import StaffFormModal from '@/components/StaffFormModal.vue'
  import { toast } from 'vue3-toastify'
  
  const staffs = ref([])
  const search = ref('')
  const showModal = ref(false)
  const selectedStaff = ref(null)
  const modalMode = ref('add')
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  const totalStaff = ref(0)
  const currentTab = ref('active')
  
  function switchTab(tab) {
    currentTab.value = tab
    currentPage.value = 1
    loadStaffs()
  }
  
  async function loadStaffs() {
    try {
      const params = {
        q: search.value || undefined,
        page: currentPage.value,
        limit: itemsPerPage.value,
        TrangThai: currentTab.value === 'inactive' ? 'Vô hiệu hóa' : undefined
      }
  
      const res = await StaffService.getAll(params)
      staffs.value = res.data
      totalStaff.value = res.total
    } catch (err) {
      toast.error('Lỗi khi tải danh sách nhân viên')
    }
  }
  
  const totalPages = computed(() => Math.ceil(totalStaff.value / itemsPerPage.value))
  
  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  
  watch([search, itemsPerPage], () => {
    currentPage.value = 1
    loadStaffs()
  })
  watch(currentPage, loadStaffs)
  onMounted(loadStaffs)
  
  function addStaff() {
    selectedStaff.value = null
    modalMode.value = 'add'
    showModal.value = true
  }
  
  function editStaff(staff) {
    selectedStaff.value = { ...staff }
    modalMode.value = 'edit'
    showModal.value = true
  }
  
  async function handleSave(data) {
    try {
      if (modalMode.value === 'add') {
        await StaffService.create(data)
        toast.success('Thêm nhân viên thành công')
      } else {
        await StaffService.update(selectedStaff.value._id, data)
        toast.success('Cập nhật nhân viên thành công')
      }
      loadStaffs()
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  }
  
  async function deactivateStaff(staff) {
    if (!confirm(`Xác nhận vô hiệu hóa nhân viên "${staff.HoTenNV}"?`)) return
    try {
      await StaffService.update(staff._id, { TrangThai: 'Vô hiệu hóa' })
      toast.success('Đã vô hiệu hóa nhân viên')
      loadStaffs()
    } catch {
      toast.error('Vô hiệu hóa thất bại')
    }
  }
  
  async function restoreStaff(staff) {
    if (!confirm(`Khôi phục nhân viên "${staff.HoTenNV}"?`)) return
    try {
      await StaffService.update(staff._id, { TrangThai: 'Hoạt động' })
      toast.success('Đã khôi phục nhân viên')
      loadStaffs()
    } catch {
      toast.error('Khôi phục thất bại')
    }
  }
  </script>
  
  
  <style scoped>
  .table td, .table th {
    vertical-align: middle;
  }
  </style>
  