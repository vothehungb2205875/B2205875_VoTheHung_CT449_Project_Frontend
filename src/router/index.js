import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import BookDetail from "@/views/BookDetail.vue";
import LoginSuccess from "../views/LoginSuccess.vue";
import Profile from "@/views/Profile.vue";
import Auth from "@/views/Auth.vue";
import DashBoard from "@/views/DashBoard.vue";
import Introduction from "@/views/Introduction.vue";
import BookStore from "@/views/BookStore.vue";
import QandA from "@/views/QandA.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/books/:id", name: "BookDetail", component: BookDetail },
  { path: "/books", name: "BookStore", component: BookStore },

  { path: "/profile", name: "Profile", component: Profile },
  { path: "/introduction", name: "Introduction", component: Introduction },
  { path: "/Q&A", name: "QandA", component: QandA },

  // Không có header/footer:
  { path: "/login", name: "Login", component: Auth, meta: { layout: "none" } },
  {
    path: "/register",
    name: "Register",
    component: Auth,
    meta: { layout: "none" },
  },
  {
    path: "/dashboard",
    name: "DashBoard",
    component: DashBoard,
    meta: { layout: "none" },
  },
  { path: "/login/success", component: LoginSuccess, meta: { layout: "none" } },

  { path: "/:pathMatch(.*)*", component: NotFound, meta: { layout: "none" } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
