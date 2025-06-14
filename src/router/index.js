import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import BookDetail from "@/views/BookDetail.vue";
import LoginSuccess from "../views/LoginSuccess.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/books/:id", name: "BookDetail", component: BookDetail },
  { path: "/login/success", component: LoginSuccess },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
