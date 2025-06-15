<template>
    <button
      v-show="isVisible"
      @click="scrollToTop"
      class="go-to-top"
      aria-label="Lên đầu trang"
    >
      <font-awesome-icon :icon="['fas', 'arrow-up']" />
    </button>

  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const isVisible = ref(false)
  
  const toggleVisibility = () => {
    isVisible.value = window.scrollY > 200
  }
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  onMounted(() => {
    window.addEventListener('scroll', toggleVisibility)
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', toggleVisibility)
  })
  </script>
  
  <style scoped>
  .go-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #0084ff;
    color: white;
    border: none;
    padding: 3px 15px;
    border-radius: 10px;
    font-size: 24px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 999;
    transition: opacity 0.3s ease;
  }
  .go-to-top:hover {
    background-color: white;
    color: #0084ff;
  }
  </style>
  