<template>
  <div id="app">
    <HeaderComponent v-if="showLayout" />

    <main class="content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>

      <MessengerButton v-if="showFloatingButtons" />
      <GoTop v-if="showFloatingButtons" />
    </main>

    <FooterComponent v-if="showLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import HeaderComponent from './components/Header.vue';
import FooterComponent from './components/Footer.vue';
import MessengerButton from './components/MessengerButton.vue';
import GoTop from './components/GoTop.vue';

const route = useRoute();

const showLayout = computed(() => route.meta.layout !== 'none');

const showFloatingButtons = computed(() => route.path !== '/dashboard');
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
