<template>
  <div id="app">
    <HeaderComponent v-if="showLayout" />
    
    <main class="content">
      <router-view />
    </main>

    <FooterComponent v-if="showLayout" />
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue'
import FooterComponent from './components/Footer.vue'

export default {
  computed: {
    showLayout() {
      return this.$route.meta.layout !== 'none';
    }
  },
  components: {
    HeaderComponent,
    FooterComponent
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Đảm bảo luôn cao bằng viewport */
}

.content {
  flex: 1; /* Đẩy footer xuống dưới */
  padding-bottom: 1rem; /* Nếu cần khoảng cách nhỏ với footer */
}
</style>
