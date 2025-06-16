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
          <li class="nav-item"><router-link to="/" class="nav-link text-white">Trang chủ</router-link></li>
          <li class="nav-item"><router-link to="/introduction" class="nav-link text-white">Giới thiệu</router-link></li>
          <li class="nav-item"><router-link to="/books" class="nav-link text-white">Kho sách</router-link></li>
          <li class="nav-item"><router-link to="/su-kien" class="nav-link text-white">Sự kiện</router-link></li>
          <li class="nav-item"><router-link to="/lien-he" class="nav-link text-white">Liên hệ</router-link></li>
        </ul>

        <div class="d-flex align-items-center gap-2">
          <template v-if="user">
            <router-link to="/profile" class="d-flex align-items-center text-white text-decoration-none gap-2">
              <img :src="getAvatarUrl(user.avatar)" alt="Avatar" class="rounded-circle" width="32" height="32" />
              <span>{{ user.name }}</span>
            </router-link>
            <button class="btn btn-secondary text-white" @click="logout">
              <font-awesome-icon icon="fa-solid fa-right-from-bracket" /> Logout
            </button>
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
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AuthService from '@/services/auth.service'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const userStore = useUserStore()
const user = userStore.user

function getAvatarUrl(path) {
  if (!path) return "/images/default-avatar.jpg"
  return /^https?:\/\//.test(path) ? path : `http://localhost:3000${path}`
}

async function logout() {
  await AuthService.logout()
  userStore.clearUser()
  localStorage.removeItem("user")
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
