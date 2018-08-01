import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { isEmptyString, getRandomCode } from '../nmb/util';
import app from '../nmb/app';
import { Commit } from 'vuex';
import { authApiBefore } from '../nmb/middleware/authApiMiddleware';

interface ITypes {
    request: string;
    success: string;
    failed: string;
}

const getApiFetchOptions = (apiPath: string, method: string = 'GET', opts: { headers?: any } = {}, apiRoot = null) => {
    const headers = opts.headers || {};
    const apiRootPath = isEmptyString(apiRoot) ? `${app.params.apiDomain}` : apiRoot;

    if (method === 'GET') {
        apiPath = apiPath.indexOf('?') === -1 ? `${apiPath}?__rnd=${getRandomCode(4)}` : `${apiPath}&__rnd=${getRandomCode(4)}`;
    }
    const endpoint = `${apiRootPath}/${apiPath}`;

    return {
        ...opts,
        url: endpoint,
        method,
        timeout: 60000, // 超时时间
        headers: {
            ...headers,
            'Accept': 'application/json',
            'Content-Type': headers['Content-Type'] || 'application/json'
        }
    };
};

/**
 * 与服务器交互数据
 * @param {*} commit
 * @param {*} config
 * @param {*} types
 */
const apiFetchAction = async (commit: Commit, apiPath: string, method: string, types: ITypes, payload: any, userTest = false, apiRoot = null) => {
    commit(types.request);
    // 是否使用测试数据
    if (!userTest) {
        const opts = await authApiBefore(payload);
        const config: AxiosRequestConfig = getApiFetchOptions(apiPath, method, opts, apiRoot);
        if (method === 'GET' && payload) config.params = payload.data;
        if (method === 'POST' && payload) config.data = payload.data;

        await axios(config).then((res: AxiosResponse) => {
            if (res.status === 200 && (res.data.code === 0)) {
                commit(types.success, res.data);
            } else {
                commit(types.failed, res.data);
            }
        }).catch((err) => {
            commit(types.failed, err);
        });
    }
};

/**
 * 与服务器交互数据
 */
const apiFetch = async (apiPath: string, method: string, types: ITypes, payload: any, userTest = false) => {
    let data: any = [];

    const opts = await authApiBefore(payload);
    const config: AxiosRequestConfig = getApiFetchOptions(apiPath, method, opts);
    if (method === 'GET' && payload) config.params = payload.data;
    if (method === 'POST' && payload) config.data = payload.data;
    await axios(config).then((res: AxiosResponse) => {
        if (res.status === 200 && res.data.code === 0) {
            data = res.data.data.result;
        }
    });

    return data;
};

export {
    apiFetchAction,
    apiFetch
};
