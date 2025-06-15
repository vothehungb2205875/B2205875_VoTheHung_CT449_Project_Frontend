<template>
  <div id="app">
    <router-view />
    <MessengerButton />
  </div>
</template>

<script setup>
import MessengerButton from "@/components/MessengerButton.vue";
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
