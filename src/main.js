import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "@mdi/font/css/materialdesignicons.css";

import vuetify from "./plugins/vuetify"; // chỉ import 1 lần từ plugins

/* Bootstrap */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/* Font Awesome */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHouse,
  faArrowLeft,
  faRightToBracket,
  faRightFromBracket,
  faArrowUp,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faGithub,
  faFacebookMessenger,
} from "@fortawesome/free-brands-svg-icons";

library.add(
  faHouse,
  faArrowLeft,
  faFacebook,
  faGithub,
  faRightToBracket,
  faRightFromBracket,
  faFacebookMessenger,
  faArrowUp,
  faAnglesLeft,
  faAnglesRight
);

/* Tạo app */
const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.use(vuetify); // dùng vuetify đã import từ plugins
app.mount("#app");
