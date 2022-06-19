import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import store from "./store";
import "lib-flexible/flexible.js";
import "element-plus/theme-chalk/display.css";
import "./assets/styles/element-variables.scss";
import ElementPlus from "element-plus";

const app = createApp(App);
app.use(router).use(ElementPlus).mount("#app");
app.config.errorHandler = (err, vm, info) => {
  // 处理错误
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
};
