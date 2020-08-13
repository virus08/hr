import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import ques from "../views/ques.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "ques",
    component: ques,
  },
  {
    path: "/score",
    name: "Score",
    component: () => import("../views/score.vue"),
  },
  {
    path: "/allscore",
    name: "AllScore",
    component: () => import("../views/allscore.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
