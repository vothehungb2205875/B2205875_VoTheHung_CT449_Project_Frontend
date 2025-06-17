import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* Bootstrap */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // bundle đã bao gồm Popper v2

/* Font Awesome (Vue-style) */
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

/* Thêm icon vào thư viện */
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
app.use(router).mount("#app");
