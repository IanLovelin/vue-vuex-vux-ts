import app from './app';
import rely from './oauth2-mobile-wx/oauth2rely';

/**
 * 获取API请求头
 * @param apiPath
 * @param method
 * @param opts
 * @param apiRoot
 * @returns {url: string, method: string, headers: any}
 */
function getApiFetchOptions(apiPath, method = 'GET', opts = {}, apiRoot = null) {
    let headers = opts.headers || {};

    const apiRootPath = isEmptyString(apiRoot) ? `${app.params.apiDomain}/${app.params.apiVersion}` : apiRoot;
    if (rely.__DEV__) {
        apiPath = apiPath.indexOf('?') == -1 ? `${apiPath}?XDEBUG_SESSION_START=PHPSTORM` : `${apiPath}&XDEBUG_SESSION_START=PHPSTORM`;
    }
    if (method == 'GET')
        apiPath = apiPath.indexOf('?') == -1 ? `${apiPath}?__rnd=${getRandomCode(4)}` : `${apiPath}&__rnd=${getRandomCode(4)}`;
    let endpoint = `${apiRootPath}/${apiPath}`;

    return {
        ...opts,
        url: endpoint,
        method: method,
        timeout: 1000,
        //credentials: __DEV__ ? 'include' : 'same-origin', //cookie，开发环境下，因为需要跨域，所以使用include
        headers: {
            ...headers,
            "Accept": "application/json",
            "Content-Type": headers['Content-Type'] || "application/json"
        }
    };
}

/**
 * 检查参数是否为undefined 或者 null
 * @param variable
 * @returns {boolean}
 */
function isUndefined(variable) {
    if (variable === undefined) return true;
    if (variable == null) return true;
    return false;
}

/**
 * 检查字符串是否为undefined 或 长度为 0
 * @param variable
 * @returns {boolean}
 */
function isEmptyString(variable) {
    if (isUndefined(variable)) return true;
    return (variable.length == 0);
}

/**
 * 获取当前的Host
 * @returns {string}
 */
function host() {
    const { protocol, host } = window.location;
    return protocol + '//' + host + '/';
}

/**
 * 过滤XSS
 * @param  {String}    str 需要过滤的内容
 * @return {String}    显示的内容
 */
function xss(str) {
    var div = document.createElement("div"),
        text = document.createTextNode(str), val = '';

    div.appendChild(text);
    val = div.innerHTML;
    text = null;
    div = null;

    return val.replace(/&amp;nbsp;/ig, ' ');
}
/**
 * 过滤><,&
 * @param  {String}    str 需要过滤的内容
 * @return {String}    显示的内容
 */
function escape2Html(str) {
    // var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    str = str.replace(/&lt;/ig, '<');
    str = str.replace(/&gt;/ig, '>');
    str = str.replace(/&nbsp;/ig, ' ');
    str = str.replace(/&amp;/ig, '&');
    str = str.replace(/&quot;/ig, '"');
    return str;
}
/**
 * 获取url或者自定义字符串中的参数
 *
 * @param {String} name 不传name则直接返回整个参数对象
 * @param {String} queryStr 自定义字符串
 * @param {Boolean} true 不进行参数XSS安全过滤
 * @param {Boolean} true 不进行自动解码
 * @return {String|Object} 获取到的参数值或者由所有参数组成完整对象
 */
function getQuery(name, queryStr = null, unxss = false, undecode = false) {
    var str = queryStr || location.search.replace("?", ""), tempArr,
        obj = {}, temp, arr = str.split("&"), len = arr.length;

    if (len > 0) {
        for (var i = 0; i < len; i++) {
            try {
                if ((tempArr = arr[i].split('=')).length === 2) {
                    temp = undecode ? tempArr[1] : decodeURIComponent(tempArr[1]);
                    obj[tempArr[0]] = unxss ? temp : xss(temp);
                }
            } catch (e) {
            }
        }
    }

    return name ? obj[name] : obj;
}

function formatDate(date, format) {
    let dateParams = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S+": date.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in dateParams) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? dateParams[k] : ("00" + dateParams[k]).substr(("" + dateParams[k]).length));
        }
    }
    return format;
}

/**
 * 将时间转换成对应的格式 yyyy-MM-dd hh:mm:ss
 * @param  {string} format 需要转化的格式
 * @param  {object} date   需要转换的时间
 * @return {string}        按照对应格式转换后的时间
 */
function dateToString(date, format) {
    date = date || new Date();
    return formatDate(date, format);
}

/**
 * 将string转换成时间
 * @param  {string} date    需要转成的字符串
 * @param  {string} split   默认为 '-'，如果显示为‘/’可不传
 * @return {object}         返回时间对象 or 返回本身
 */
function stringToDate(date, split) {
    if (typeof date == 'string') {
        // 匹配 2017-04-10T07:41:24.944Z GMT 时间，不做处理，直接进行转换
        let test = /([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))[ T](([01][0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9])).([0-9][0-9][0-9][zZ])/ig.exec(date);
        if ((!isUndefined(test)) && test.length > 0)
            return new Date(date);
        // 匹配可能的时间格式 2017-04-10 2017/04/10 处理手工拼接的日期字符串
        test = /([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})[-/](((0[13578]|1[02])[-/](0[1-9]|[12][0-9]|3[01]))|((0[469]|11)[-/](0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))[ T](([01][0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9]))/ig.exec(date);
        if ((!isUndefined(test)) && test.length > 0) {
            split = split || '-';
            return new Date(test[0].replace(new RegExp(split, 'gm'), '/').replace(new RegExp('T', 'gm'), ' '));
        }
    }
    return date;
}

function getDateDiff(dateTimeStamp) {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const halfamonth = day * 15;
    const month = day * 30;
    const now = new Date().getTime();
    const diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    const monthC = diffValue / month;
    const weekC = diffValue / (7 * day);
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;
    let result = '';
    if (monthC >= 1) {
        result = '' + parseInt(monthC) + '月前';
    }
    else if (weekC >= 1) {
        result = '' + parseInt(weekC) + '周前';
    }
    else if (dayC >= 1) {
        result = '' + parseInt(dayC) + '天前';
    }
    else if (hourC >= 1) {
        result = '' + parseInt(hourC) + '小时前';
    }
    else if (minC >= 1) {
        result = '' + parseInt(minC) + '分钟前';
    } else
        result = '刚刚';
    return result;
}

function getRandomCode(n) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let res = "";
    for (let i = 0; i < n; i++) {
        let id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}

// region 读写cookie
function getCookie(name) {
    let arr;
    const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURIComponent(arr[2]);
    else
        return undefined;
}
function removeCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const value = getCookie(name);
    if (!isUndefined(value))
        document.cookie = `${name}=${encodeURIComponent(value)}expires=${exp.toGMTString()}`;
}
function setCookie(name, value, expiredInSecond = 0, domain = '') {
    let cookie = `${name}=${encodeURIComponent(value)};path=/`;
    if (expiredInSecond > 0) {
        let exp = new Date();
        exp.setTime(exp.getTime() + expiredInSecond * 1000);
        cookie = `${cookie};expires=${exp.toGMTString()}`;
    }
    if (!isEmptyString(domain)) {
        cookie = `${cookie};domain=${domain}`;
    }
    document.cookie = cookie;
}
// endregion

// region deep assign
// endregion

function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

export {
    isUndefined,
    isEmptyString,
    host,
    xss,
    getQuery,
    dateToString,
    stringToDate,
    getLocalApiFetchOptions,
    getApiFetchOptions,
    getDateDiff,
    getRandomCode,

    getCookie,
    removeCookie,
    setCookie,

    bytesToSize,
    escape2Html
}
