import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

/* Bootstrap */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/* Font Awesome via <i> tag */
import "@fortawesome/fontawesome-free/css/all.min.css";

/* Tạo app */
const app = createApp(App);

app.use(router);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});

app.mount("#app");
