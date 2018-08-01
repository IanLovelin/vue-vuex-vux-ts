// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './style/animate.min.css';
import app from './nmb/app';
import clientConfig from './params/config.js';
import './assets/font/iconfont.css';
import FastClick from 'fastclick';
// 拦截请求
import './mock';

Vue.config.productionTip = false;
app.params = Object.assign(app.params, clientConfig);
// rely.defaultParams = Object.assign(rely.defaultParams, oauth2);

FastClick.attach(document.body);

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
