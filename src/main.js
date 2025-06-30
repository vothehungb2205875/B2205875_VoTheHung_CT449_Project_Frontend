import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
  faBook,
  faCalendar,
  faChartSimple,
  faBuilding,
  faUserTie,
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
  faEnvelope,
  faBook,
  faCalendar,
  faChartSimple,
  faBuilding,
  faUserTie
);

/* Tạo app */
const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});
app.mount("#app");
