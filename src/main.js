import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* Bootstrap */
import "bootstrap/dist/css/bootstrap.min.css";

/* Font Awesome (Vue-style) */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHouse,
  faArrowLeft,
  faRightToBracket,
  faRightFromBracket,
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
  faFacebookMessenger
);

/* Tạo app */
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router).mount("#app");
