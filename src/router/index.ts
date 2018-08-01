import Vue from 'vue';
import Router, { RouteConfig, Route, NavigationGuard } from 'vue-router';
import oauthRely from '../nmb/oauth2-mobile-wx/oauth2rely';
import createRoute from '../nmb/oauth2-mobile-wx/routes';
Vue.use(Router);

const Login: NavigationGuard = (to, from, next) => {
  oauthRely.checkLogon(to, next);
  next();
};

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    beforeEnter: Login,
    component: (): any => import('./demo/index.vue')
  },
  createRoute()
];

const router: Router = new Router({
  mode: 'history',
  base: '/',
  routes
});

export default router;
