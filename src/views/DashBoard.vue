<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar bg-primary">
      <h2>Dash Board</h2>
      <p>Xin chào {{ staff?.HoTenNV || 'ADMIN' }}</p>
      <ul>
        <li @click="currentView = 'books'" :class="{ active: currentView === 'books' }">
          <i class="fas fa-book"></i> Quản lý Sách
        </li>
        <li @click="currentView = 'readers'" :class="{ active: currentView === 'readers' }">
          <i class="fas fa-book-open-reader"></i> Quản lý Độc giả
        </li>
        <li @click="currentView = 'borrowings'" :class="{ active: currentView === 'borrowings' }">
          <i class="fas fa-arrows-rotate"></i> Quản lý mượn sách
        </li>
        <li @click="currentView = 'publishers'" :class="{ active: currentView === 'publishers' }">
          <i class="fas fa-building"></i> Quản lý NXB
        </li>
        <li @click="currentView = 'notifys'" :class="{ active: currentView === 'notifys' }">
          <i class="fas fa-calendar"></i> Quản lý Thông báo
        </li>
        <li @click="currentView = 'staffs'" :class="{ active: currentView === 'staffs' }">
          <i class="fas fa-user-tie"></i> Quản lý nhân viên
        </li>
        <li @click="currentView = 'statistics'" :class="{ active: currentView === 'statistics' }">
          <i class="fas fa-chart-simple"></i> Thống kê
        </li>
        <li @click.prevent="logout">
          <i class="fas fa-right-from-bracket"></i> Đăng xuất
        </li>
      </ul>
    </aside>

    <!-- Nội dung -->
    <main class="content">
      <div class="container">
        <div class="row d-flex justify-content-center">
          <img src="/images/banner.png" style="max-width: 200px;" />
        </div>

        <div class="row">
          <component :is="currentViewComponent" />
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import BookManager from '@/components/BookManager.vue'
import ReaderManager from '@/components/ReaderManager.vue'
import BorrowManager from '@/components/BorrowManager.vue'
import PublisherManager from '@/components/PublisherManager.vue'
import Statistics from '@/components/Statistics.vue'
import AuthService from '@/services/auth.service.js'
import StaffService from '@/services/staff.service.js'
import NotifyManager from '@/components/NotifyManager.vue';
import StaffManager from '@/components/StaffManager.vue';

const staff = ref(null)
const router = useRouter()

const currentView = ref('books')

const currentViewComponent = computed(() => {
  return {
    books: BookManager,
    readers: ReaderManager,
    borrowings: BorrowManager,
    publishers: PublisherManager,
    statistics: Statistics,
    notifys: NotifyManager,
    staffs: StaffManager
  }[currentView.value];
});


// Kiểm tra quyền truy cập khi component mount
onMounted(async () => {
  try {
    const res = await AuthService.getCurrentUser()
    if (res.role !== 'staff') return router.push('/')
    const staffInfo = await StaffService.getStaffById(res._id)
    staff.value = staffInfo
  } catch (err) {
    console.error('Lỗi xác thực:', err)
    router.push('/login')
  }
})

async function logout() {
  await AuthService.logout()
  localStorage.removeItem('user')
  staff.value = null
  router.push('/login')
}
</script>


<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
}

/* Sidebar */
.sidebar {
  width: 240px;
  color: white;
  padding: 20px;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.05);
}

.sidebar .logo {
  max-width: 120px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.sidebar h2 {
  font-size: 18px;
  margin: 10px 0 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px 14px;
  margin-bottom: 6px;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
}

.sidebar li:hover,
.sidebar li.active {
  background-color: white;
  color: #000000;
}

/* Main content */
.content {
  flex: 1;
  background-color: #ecf0f1;
}

/* Responsive logo + text alignment */
@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }
  .sidebar ul {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-left: auto;
  }
}
</style>
