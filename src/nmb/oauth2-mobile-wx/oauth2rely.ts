/**
 * 企业微信 用户登录信息处理
 * created by fanwd
 * 2018-07-05
 * 1. 企业微信授权站点
 * ->
 * 2. callback 微信 code 通过企业微信接口 换取 userName ex: fanwd
 * ->
 * 3. https://pas.mingyuanyun.com/mobile-client-token 使用 userName & id & secret 换取登录用户信息（与EKP打通）信息较全
 */
// 参数	            必须	            说明
// appid	        是	            企业的CorpID
// redirect_uri	    是	            授权后重定向的回调链接地址，请使用urlencode对链接进行处理
// response_type	是	            返回类型，此时固定为：code
// scope	        是	            应用授权作用域。
//                                  snsapi_base：静默授权，可获取成员的基础信息；
//                                  snsapi_userinfo：静默授权，可获取成员的详细信息，但不包含手机、邮箱；
//                                  snsapi_privateinfo：手动授权，可获取成员的详细信息，包含手机、邮箱。
// agentid	        是	            企业应用的id。
//                                  当scope是snsapi_userinfo或snsapi_privateinfo时，该参数必填。
//                                  注意redirect_uri的域名必须与该应用的可信域名一致。
// state	        否	            重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值，长度不可超过128个字节
// #wechat_redirect	是	            微信终端使用此参数判断是否需要带上身份信息

import { host, getQuery, isUndefined, isEmptyString, stringToDate, setCookie, getCookie, removeCookie } from '../util';
import axios, { AxiosResponse } from 'axios';
import VueRouter, { Route } from 'vue-router';

const __DEV__ = process.env.NODE_ENV === 'development';
const __TEST__ = process.env.NODE_ENV === 'test';

const rely = {
    defaultParams: {
        // 这里的token请求身份信息均走的 mp ，若走xmgl token_svr 应该是 xmgl 自己的后台，申请一个 xmgl id + secret
        client_id: '',
        client_secret: '',
        // 企业微信登录
        qywx: {
            qywx_auth_svr: 'https://open.weixin.qq.com/connect/oauth2/authorize',
            appid: 'xxx',
            scope: 'snsapi_base'
        },
        auth_svr: 'xxx',
        token_svr: 'xxx',
        refresh_svr: 'xxx',
        user_info_svr: 'xxx',
        logout_svr: 'xxx',
        local_mode: 'localStorage',
        cookie_duration: 129600,
        cookie_domain: '.xxx.com',
        // 微信登录信息 统一使用 mp 后台
        wxGetUserInfoUrl: 'xxx'
    },

    invalidLogonIdentity: {
        name: 'InvalidLogonIdentityException',
        code: 100110,
        message: '未能检测到有效的登录身份，请重新登录'
    },

    tokenRefreshing: false,

    /* 获取 微信 用户信息 过程 ================================================================================================ */
    wxUserInfo(code: string, success: any, error: any) {
        if (__DEV__) {
            success('fanwd');
        }
        axios({
            url: `${this.defaultParams.wxGetUserInfoUrl}?code=${code}`,
            method: 'GET'
        }).then((res: AxiosResponse) => {
            if (res.status === 200 && res.data.result) {
                success(res.data.userData.userName);
            } else {
                error(res.data.userData);
            }
        });
    },

    /* 获取用户信息 过程 ================================================================================================ */
    // 这里的 token 是 pas 授予的 token
    userInfo(access_token: string, success: any, error: any) {
        axios({
            url: `${this.defaultParams.user_info_svr}/${access_token}`,
            method: 'GET'
        }).then((res: AxiosResponse) => {
            if (res.status === 200 && res.data.result) {
                this.saveLogonUser(res.data.userData);
                success();
            } else {
                error(res.data.userData);
            }
        });
    },

    /**
     * 将拉取到登录用户的 user info 保存在 localStorage 中
     * @param user
     */
    saveLogonUser(user: any) {
        if (this.defaultParams.local_mode === 'cookie') {
            setCookie('__xmgl_auth_user',
                JSON.stringify(user),
                this.defaultParams.cookie_duration,
                __DEV__ ? '' : this.defaultParams.cookie_domain);
        } else if (this.defaultParams.local_mode === 'sessionStorage') {
            sessionStorage.logonUser = JSON.stringify(user);
        } else {
            localStorage.logonUser = JSON.stringify(user);
        }
    },

    /**
     * 获取 localStorage 中保存的 user info
     * @returns mixed
     */
    getLogonUser() {
        try {
            const logonUser = (this.defaultParams.local_mode === 'cookie' ? getCookie('__xmgl_auth_user') :
                (this.defaultParams.local_mode === 'sessionStorage' ? sessionStorage.logonUser
                    : localStorage.logonUser));

            return logonUser === undefined ? undefined : JSON.parse(logonUser);
        } catch (e) {
            return undefined;
        }
    },

    checkLogon(to: Route, next: any) {
        const userInfo = this.getLogonUser();
        const tokens = this.getTokens();
        if (userInfo === undefined || tokens === undefined || isEmptyString(tokens.access_token)) {
            this.saveRedirectUrl(to);
            next('/__oauth2_mobile/auth');
        }
    },

    /* 处理身份缓存 ===================================================================================================== */
    /**
     * 将申请或刷新得到的tokens保存在 localStorage 中
     * @param tokens
     */
    saveTokens(tokens: any) {
        tokens.updated = new Date();
        if (this.defaultParams.local_mode === 'cookie') {
            setCookie('__xmgl_auth_token',
                JSON.stringify(tokens),
                this.defaultParams.cookie_duration,
                __DEV__ ? '' : this.defaultParams.cookie_domain);
        } else if (this.defaultParams.local_mode === 'sessionStorage') {
            sessionStorage.tokens = JSON.stringify(tokens);
        } else {
            localStorage.tokens = JSON.stringify(tokens);
        }

    },

    /**
     * 获取 localStorage 中保存的 tokens
     * @returns mixed
     */
    getTokens() {
        try {
            const tokens = (this.defaultParams.local_mode === 'cookie' ? getCookie('__xmgl_auth_token') :
                (this.defaultParams.local_mode === 'sessionStorage' ? sessionStorage.tokens : localStorage.tokens));

            return tokens === undefined ? undefined : JSON.parse(tokens);
        } catch (e) {
            return undefined;
        }
    },

    /**
     * 从 localStorage 中删除保存的 tokens
     */
    clearTokens() {
        if (this.defaultParams.local_mode === 'cookie') {
            removeCookie('__xmgl_auth_token');
        } else if (this.defaultParams.local_mode === 'sessionStorage') {
            delete sessionStorage.tokens;
        } else {
            delete localStorage.tokens;
        }
    },

    isTokenValid(tokens: any) {
        if (isUndefined(tokens)) return false;
        if (isEmptyString(tokens.access_token) || isUndefined(tokens.expires_in)
            || isUndefined(tokens.updated)) return false;
        // 检查 accessToken 是否还在有效期
        try {
            const ms = (new Date()).getTime() - stringToDate(tokens.updated, '-').getTime();

            return (ms <= ((tokens.expires_in - 10) * 1000));
        } catch (e) {
            return false;
        }
    },

    /* 申请 Token 过程 ======================================================================= */

    /**
     * 解析授权成功后的授权码回调
     */
    resolveAuthCallback() {
        if (__DEV__) {
            return {
                result: true
            };
        }
        const result = this.checkClientState();
        this.clearClientState();

        return {
            result,
            code: getQuery('code'),
            error: result ? undefined : {
                name: 'ClientStateExpiredException',
                code: 100111,
                message: '客户端状态已失效，请重新登录'
            }
        };
    },

    /**
     * 获取token
     */
    token(userName: string, success: any, error: any) {
        axios({
            url: this.defaultParams.token_svr,
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            // data: `client_id=${this.defaultParams.client_id}&client_secret=${this.defaultParams.client_secret}&username=${userName}&domain=${this.defaultParams.cookie_domain}`
            data: `username=${userName}&domain=${this.defaultParams.cookie_domain}`
        }).then((res: AxiosResponse) => {
            if (res.status === 200 && res.data.result) {
                const tokens = res.data.userData;
                // 保存token
                this.saveTokens(tokens);
                success(tokens.access_token);
            } else {
                error(res.data.userData);
            }
        });
    },

    /**
     * 从 localStorage 中删除保存的 user info
     */
    clearLogonUser() {
        if (this.defaultParams.local_mode === 'cookie') {
            removeCookie('__xmgl_auth_user');
        } else if (this.defaultParams.local_mode === 'sessionStorage') {
            delete sessionStorage.logonUser;
        } else {
            delete localStorage.logonUser;
        }
    },

    /**
     * 登出
     */
    logout(route: Route) {
        this.saveRedirectUrl(route);
        // 清除EKP登录记录
        removeCookie('Email_User');
        removeCookie('Login_User');
        const doLogoutUrl = `${host()}__oauth2_mobile/logout`;
        window.location.href = `${this.defaultParams.logout_svr}?redirect_uri=${encodeURIComponent(doLogoutUrl)}`;
    },
    /**
     * 执行登出
     * @param replace
     */
    doLogout() {
        this.clearLogonUser();
        this.clearTokens();
        this.returnToRedirectUrl();
    },

    /**
     * 保存回调页面地址
     */
    saveRedirectUrl(route: Route) {
        const query = route.query;
        let { path } = route;
        if (path.length > 1 && path.substr(0, 1) === '/') path = path.substr(1);
        let search = '';
        Object.keys(query).forEach((key) => {
            search += key + '=' + query[key] + '&';
        });
        search = search.substring(0, search.lastIndexOf('&'));
        const returnPath = search.length > 0 ? `${path}?${search}` : `${path}`;
        localStorage.auth_return_url = (returnPath === '/' ? '/' : `/${returnPath}`);
    },

    // tslint:disable-next-line:no-unnecessary-initializer
    returnToRedirectUrl(replace: VueRouter['replace'] | undefined = undefined) {
        const url = isEmptyString(localStorage.auth_return_url) ? '/' : localStorage.auth_return_url;
        if (replace) {
            replace(url);
        } else {
            window.location.href = url;
        }
        delete localStorage.auth_return_url;
    },

    async waitTokenRefreshed(next: any) {
        await new Promise((resolve) => {
            const waitTime = () => {
                if (this.tokenRefreshing) {
                    this.waitTokenRefreshed(next);
                } else {
                    resolve();
                }
            };
            setTimeout(waitTime, 500);
        });
        next();
    },

    async prepareRefresh(refresh: any, next: any) {
        if (this.tokenRefreshing) {
            // 等待
            await this.waitTokenRefreshed(next);
        } else {
            this.tokenRefreshing = true;
            await refresh();
        }
    },

    /**
     * 刷新token
     */
    async refresh(success: any, error: any) {
        const oldTokens = this.getTokens();
        if (oldTokens === undefined) error(this.invalidLogonIdentity);

        await axios({
            url: this.defaultParams.refresh_svr,
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: `client_id=${this.defaultParams.client_id}&code=${oldTokens.refresh_token}`
        }).then((res: AxiosResponse) => {
            if (res.status === 200 && res.data.result) {
                const tokens = res.data.userData;
                // 保存token
                this.saveTokens(tokens);
                this.tokenRefreshing = false;
                success(tokens.access_token);
            } else {
                this.tokenRefreshing = false;
                error(res.data.userData);
            }
        });
    },

    /**
     * 重新认证
     */
    reAuth() {
        this.clearLogonUser();
        this.clearTokens();
        this.redirectToAuthUrl();
    },

    /**
     * 跳转到授权站点
     * 移动端的授权站点 为 企业微信
     */
    redirectToAuthUrl() {
        if (__DEV__) {
            window.location.href = host() + '__oauth2_mobile/callback';

            return;
        }
        const clientState = this.generateOAuthClientState(6);
        const { qywx, client_id } = this.defaultParams;
        window.location.href =
            qywx.qywx_auth_svr
            + `?response_type=code`
            + `&state=${clientState}`
            + `&redirect_uri=${encodeURIComponent(this.getRedirectUrl())}`
            + `&appid=${qywx.appid}`
            + `&scope=${qywx.scope}#wechat_redirect`;
    },

    /**
     * 获取auth成功之后的跳转地址
     */
    getRedirectUrl() {
        return host() + '__oauth2_mobile/callback';
    },

    /**
     * 生成客户端随机码
     * @param n
     * @returns {string}
     */
    generateOAuthClientState(n: number) {
        const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let res = '';
        for (let i = 0; i < n; i++) {
            const id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        localStorage.oauthState = res;

        return res;
    },

    /**
     * 检查客户端随机码
     * @returns {boolean}
     */
    checkClientState() {
        const state = getQuery('state');

        return !(isEmptyString(localStorage.oauthState) || (state !== localStorage.oauthState));
    },

    /**
     * 清除客户端随机码
     */
    clearClientState() {
        delete localStorage.oauthState;
    }
};

export default rely;
