import { NavigationGuard } from 'vue-router';
import rely from '../oauth2rely';

const onEnter: NavigationGuard = (to, from, next) => {
    rely.redirectToAuthUrl();
    next();
};

export const createRoute = () => ({
    path: '/__oauth2_mobile',
    component: () => import('./Layout.vue'),
    children: [
        {
            path: 'auth',
            name: 'auth',
            beforeEnter: onEnter,
            component: (): any => import('./auth')
        },
        { path: 'callback', name: 'callback', component: (): any => import('./callback') },
        { path: 'logout', name: 'logout', component: (): any => import('./logout') }
    ]
});

export default createRoute;
