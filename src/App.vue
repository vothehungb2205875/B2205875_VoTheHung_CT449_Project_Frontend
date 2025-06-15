<template>
  <div id="app">
    <router-view />
    <MessengerButton />
    <GoToTop />
  </div>
</template>

<script setup>
import MessengerButton from "@/components/MessengerButton.vue";
import GoToTop from "@/components/GoTop.vue"
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
