<template>
  <a
    :href="messengerLink"
    target="_blank"
    rel="noopener"
    class="messenger-btn"
    title="Nhắn tin với chúng tôi qua Facebook"
  >
  <font-awesome-icon icon="fa-brands fa-facebook-messenger" />

  </a>
</template>

<script setup>
const pageId = "665288010002258";
const messengerLink = `https://m.me/${pageId}`;
</script>

<style scoped>
.messenger-btn {
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 9999;
  width: 50px;
  height: 50px;
  background-color: #0084ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: background-color 0.3s ease, transform 0.2s ease;
  animation: ring 2s 0.5s ease-in-out infinite;
}

.messenger-btn:hover {
  background-color: #006fd6;
  transform: translateY(-2px);
}

@keyframes ring {
  0% { transform: rotate(0); }
  1% { transform: rotate(30deg); }
  3% { transform: rotate(-28deg); }
  5% { transform: rotate(34deg); }
  7% { transform: rotate(-32deg); }
  9% { transform: rotate(30deg); }
  11% { transform: rotate(-28deg); }
  13% { transform: rotate(26deg); }
  15% { transform: rotate(-24deg); }
  17% { transform: rotate(22deg); }
  19% { transform: rotate(-20deg); }
  21% { transform: rotate(18deg); }
  23% { transform: rotate(-16deg); }
  25% { transform: rotate(14deg); }
  27% { transform: rotate(-12deg); }
  29% { transform: rotate(10deg); }
  31% { transform: rotate(-8deg); }
  33% { transform: rotate(6deg); }
  35% { transform: rotate(-4deg); }
  37% { transform: rotate(2deg); }
  39% { transform: rotate(-1deg); }
  41% { transform: rotate(1deg); }
  43% { transform: rotate(0); }
  100% { transform: rotate(0); }
}



</style>
