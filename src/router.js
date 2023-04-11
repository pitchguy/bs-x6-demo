import Router from "vue-router";
export default new Router({
  base: "",
  routes: [
    {
      path: "/graph",
      name: "graph",
      component: () => import("./page/graph/index.vue"),
    },
    {
      path: "/elGraph",
      name: "elGraph",
      component: () => import("./page/elGraph/index.vue"),
    },
  ],
});
