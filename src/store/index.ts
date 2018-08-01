import Vue from 'vue';
import Vuex from 'vuex';
import middlewarePlugin from '../nmb/middleware';
import demo from './moudules/demo';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        demo
    },
    plugins: [middlewarePlugin]
});
