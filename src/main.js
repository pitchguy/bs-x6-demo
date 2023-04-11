import Vue from "vue";
import App from "./App.vue";
import Router from "vue-router";
import router from "./router";
import bsview from "bsview-3.0";
import ElementUI from "element-ui";
import "@antv/x6-vue-shape";
import "element-ui/lib/theme-chalk/index.css";
import "bsview-3.0/dist/styles/bsview.css";

Vue.use(Router);
Vue.use(ElementUI);
Vue.config.productionTip = false;

bsview.Page.defaultPageSize = 25;
//处理poc问题之修改通知组件Message为NoticeMessage
bsview.NoticeMessage.limit = 40;
Vue.use(bsview, {
  themeColor: "#377cff",
});

new Vue({
  el: "#app",
  router,
  render: h => h(App),
}).$mount("#app");
