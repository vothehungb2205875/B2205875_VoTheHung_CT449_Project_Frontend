import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

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
  faBookOpenReader,
  faUserPlus,
  faArrowsRotate,
  faLocationDot,
  faPhone,
  faFax,
  faEnvelope,
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
  faAnglesRight,
  faBookOpenReader,
  faUserPlus,
  faArrowsRotate,
  faLocationDot,
  faPhone,
  faFax,
  faEnvelope
);

/* Tạo app */
const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");
