import { isUndefined, isEmptyString } from './util';

const app = {
    // export default{
    params: {
        client_id: '',
        home: '',
        errorRedirectUrl: 'https://pps.mingyuanyun.com/help/exception/',
    },

    /**
     * 跳转至 pps 提供的通用错误页面
     * @param err
     * @param newWindow
     * @param redirect_url
     */
    showError(err, newWindow = false, redirect_url = '') {
        if (isUndefined(err))
            return;
        if (isEmptyString(redirect_url))
            redirect_url = this.params.home;
        // TODO: 这里最好是对ERR有个检查
        let url = `${this.params.errorRedirectUrl}${err.code}/${encodeURIComponent(err.name)}/${encodeURIComponent(err.message)}`;
        url = `${url}?redirect_url=${encodeURIComponent(redirect_url)}`;
        newWindow ? window.open(url) : (window.location.href = url);
    },


    testVisitor: () => {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;

        app.gecko = /gecko\/\d/i.test(userAgent);
        app.ie_upto10 = /MSIE \d/.test(userAgent);
        app.ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
        app.ie = app.ie_upto10 || app.ie_11up;
        app.ie_version = app.ie && (app.ie_upto10 ? document.documentMode || 6 : app.ie_11up[1]);
        app.edge = /Edge\/(\d)/i.test(userAgent);
        app.firefox = /Firefox\/(\d)/i.test(userAgent);
        app.webkit = /WebKit\//.test(userAgent);
        app.qtwebkit = app.webkit && /Qt\/\d+\.\d+/.test(userAgent);
        app.chrome = /Chrome\//.test(userAgent);
        app.presto = /Opera\//.test(userAgent);
        app.safari = /Apple Computer/.test(navigator.vendor);
        app.mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
        app.phantom = /PhantomJS/.test(userAgent);

        app.ios = /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
        // This is woefully incomplete. Suggestions for alternative methods welcome.
        app.mobile = app.ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
        app.mac = app.ios || /Mac/.test(platform);
        app.chromeOS = /\bCrOS\b/.test(userAgent);
        app.windows = /win/i.test(platform);
    }
}

export default app;
