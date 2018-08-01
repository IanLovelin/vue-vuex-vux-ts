import { GetterTree } from 'vuex';
import { IState } from './states';

const getters: GetterTree<IState, Function> = {
    demoGetter: (state: IState) => state.demo
};

export default getters;
