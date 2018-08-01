import Vue from 'vue';
import * as TYPES from './types';
import { MutationTree } from 'vuex';
import { IState } from './states';

const mutations: MutationTree<any> = {
    [TYPES.GET_DEMO_REQUEST](state: IState) {
        state.demo.loading = true;
    },
    [TYPES.GET_DEMO_SUCCESS](state: IState, data) {
        state.demo.loading = false;
        state.demo.data = data.data;
    },
    [TYPES.GET_DEMO_FAILD](state: IState, err) {
        state.demo.loading = false;
        state.demo.data = err;
    }
};
export default mutations;
