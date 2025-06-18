<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <router-link to="/" class="navbar-brand text-white">CTLIB</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link text-white">Trang chủ</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/introduction" class="nav-link text-white">Giới thiệu</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/books" class="nav-link text-white">Kho sách</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/su-kien" class="nav-link text-white">Sự kiện</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/lien-he" class="nav-link text-white">Liên hệ</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-2">
          <template v-if="user">
            <div class="dropdown">
              <button
                class="btn dropdown-toggle d-flex align-items-center gap-2 text-white"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  :src="getAvatarUrl(user.avatar)"
                  alt="Avatar"
                  class="rounded-circle"
                  width="32"
                  height="32"
                />
                <span>{{ user.name }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <router-link class="dropdown-item" to="/profile">Thông tin cá nhân</router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">Đăng xuất</a>
                </li>
              </ul>
            </div>
          </template>

          <template v-else>
            <router-link to="/login" class="btn btn-light">
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
              Login
            </router-link>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service'
import ReaderService from "@/services/reader.service";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const user = ref(null)

onMounted(async() => {
  const res = await AuthService.getCurrentUser();
  user.value = await ReaderService.getReaderById(res._id);
})

function getAvatarUrl(path) {
  if (!path) return "http://localhost:3000/uploads/avatars/default.jpg"
  return /^https?:\/\//.test(path) ? path : `http://localhost:3000${path}`
}

async function logout() {
  await AuthService.logout()
  localStorage.removeItem('user')
  user.value = null
  router.push('/login')
}
</script>

<script>
export default {
  components: {
    FontAwesomeIcon
  }
}
</script>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>