import authApiMiddleware from './authApiMiddleware';
import authBeforeReduxApiMiddleware from './afterMiddleware';

const middlewarePlugin = (store: any) => {
    // TODO: 暂时不在此处使用beforeAction
    // handler会在action之前执行
    // store.subscribeAction(authApiMiddleware);
    // handler会在mutation之后执行
    store.subscribe(authBeforeReduxApiMiddleware);
};

export default middlewarePlugin;
