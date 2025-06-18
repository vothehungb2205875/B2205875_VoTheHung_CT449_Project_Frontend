<template>
  <div id="app">
    <HeaderComponent v-if="showLayout" />
    
    <main class="content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>

      <MessengerButton />
      <GoTop />
    </main>

    <FooterComponent v-if="showLayout" />
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue'
import FooterComponent from './components/Footer.vue'
import MessengerButton from './components/MessengerButton.vue';
import GoTop from './components/GoTop.vue';    

export default {
  computed: {
    showLayout() {
      return this.$route.meta.layout !== 'none';
    }
  },
  components: {
    HeaderComponent,
    FooterComponent,
    MessengerButton,
    GoTop,
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
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
