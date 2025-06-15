import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import BookDetail from "@/views/BookDetail.vue";
import LoginSuccess from "../views/LoginSuccess.vue";
import Profile from "@/views/Profile.vue";
import Auth from "@/views/Auth.vue";
import DashBoard from "@/views/DashBoard.vue";
import Introduction from "@/views/Introduction.vue";
const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/books/:id", name: "BookDetail", component: BookDetail },
  { path: "/login/success", component: LoginSuccess },
  { path: "/login", name: "Login", component: Auth },
  { path: "/profile", name: "Profile", component: Profile },
  { path: "/register", name: "Register", component: Auth },
  { path: "/dashboard", name: "DashBoard", component: DashBoard },
  { path: "/introduction", name: "Introduction", component: Introduction },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
