import { ActionTree, Commit } from 'vuex';
import * as TYPES from './types';
import { IState } from './states';
import { apiFetchAction } from '../../apiUtil';
import { __DEV__, __TEST__ } from '../../../params/config';
import app from '../../../nmb/app';

const userTest = __DEV__ || __TEST__ ? true : false;

// 检索人员信息
const getDemoApi = async (context: { commit: Commit, state: IState }, payload: any) => {
  apiFetchAction(context.commit, 'demo/get', 'GET', {
    request: TYPES.GET_DEMO_REQUEST,
    success: TYPES.GET_DEMO_SUCCESS,
    failed: TYPES.GET_DEMO_FAILD
  }, payload);
};

const actions: ActionTree<any, any> = {
  getDemoApi
};

export default actions;
