import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import BookDetail from "@/views/BookDetail.vue";
import LoginSuccess from "../views/LoginSuccess.vue";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import Register from "@/views/Register.vue";
const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/books/:id", name: "BookDetail", component: BookDetail },
  { path: "/login/success", component: LoginSuccess },
  { path: "/login", name: "Login", component: Login },
  { path: "/profile", name: "Profile", component: Profile },
  { path: "/register", name: "Register", component: Register },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
