import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import propsals from "../views/propsals.vue";
import home from "../views/home.vue";
import stake from "../views/stake.vue";
import pending from "../views/pending.vue";
import delegate from "../views/delegate.vue";
import submit from "../views/submit.vue";
import detail from "../views/detail.vue";
import close from "../views/close.vue";
import index from "../views/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: home,
  },
  {
    path: "/",
    name: "index",
    component: index,
  },
  {
    path: "/home",
    name: "home",
    component: home,
  },
  {
    path: "/stake",
    name: "stake",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: stake,
  },
  {
    path: "/propsals",
    name: "propsals",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: propsals,
  },
  {
    path: "/pending",
    name: "pending",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: pending,
  },
  {
    path: "/close",
    name: "close",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: close,
  },
  {
    path: "/delegate",
    name: "delegate",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: delegate,
  },
  {
    path: "/detail",
    name: "detail",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: detail,
  },
  {
    path: "/submit",
    name: "submit",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: submit,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
