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
            <router-link to="/" class="nav-link text-white">🏠 Trang chủ</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/gioi-thieu" class="nav-link text-white">📖 Giới thiệu</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/kho-sach" class="nav-link text-white">📚 Kho sách</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/su-kien" class="nav-link text-white">📅 Sự kiện</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/lien-he" class="nav-link text-white">📞 Liên hệ</router-link>
          </li>
        </ul>

        <!-- Phần đăng nhập -->
        <div class="d-flex align-items-center gap-2">
          <template v-if="user">
            <img
              :src="user.avatar"
              alt="Avatar"
              class="rounded-circle"
              width="32"
              height="32"
              style="object-fit: cover"
            />
            <span class="text-white">{{ user.name }}</span>
            <button class="btn btn-outline-light btn-sm" @click="logout">Đăng xuất</button>
          </template>
          <template v-else>
            <a :href="googleLoginUrl" class="btn btn-light">
              🔐 Đăng nhập Google
            </a>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      user: null,
    };
  },
  computed: {
    googleLoginUrl() {
      return "http://localhost:3000/api/auth/google";
    }
  },
  mounted() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      location.reload(); // hoặc this.$router.push("/")
    }
  }
};
</script>
