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
            <router-link to="/gioi-thieu" class="nav-link text-white">Giới thiệu</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/kho-sach" class="nav-link text-white">Kho sách</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/su-kien" class="nav-link text-white">Sự kiện</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/lien-he" class="nav-link text-white">Liên hệ</router-link>
          </li>
        </ul>

        <!-- Phần đăng nhập -->
        <div class="d-flex align-items-center gap-2">
          <template v-if="user">
            <router-link :to="'/profile'" class="d-flex align-items-center text-white text-decoration-none gap-2">
              <img
                :src="user.avatar"
                alt="Avatar"
                class="rounded-circle"
                width="32"
                height="32"
                style="object-fit: cover"
              />
              <span>{{ user.name }}</span>
            </router-link>
            <button class="btn btn-secondary text-white" @click="logout"><font-awesome-icon icon="fa-solid fa-right-from-bracket" />Logout</button>
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

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import api from "@/services/api.service";

export default {
  components: { FontAwesomeIcon },
  data() {
    return {
      user: null,
    };
  },
  async mounted() {
    try {
      const res = await api.get("/auth/me");
      this.user = res.data;
    } catch (err) {
      console.warn("Người dùng chưa đăng nhập.");
    }
  },
  methods: {
    logout() {
      api.post("/auth/logout")
        .then(() => {
          this.user = null;
          this.$router.push("/login");
        })
        .catch(() => {
          alert("Đăng xuất thất bại");
        });
    }
  }
};
</script>

