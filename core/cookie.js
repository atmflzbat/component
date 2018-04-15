/**
 * @overview cookie module of fengluzhe framework
 * @author fenglz
 * @createDate 2016-07-29
 * @lastModifiedDate 2016-07-29
 * @lastModifiedBy fenglz
 * @version 0.0.1
 */
;(function(undefined) {
    'use strict';
    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {};

    if (flz.cookie) {
        return;
    }

    var trim = String.prototype.trim;
    //字符截取方法兼容处理
    String.prototype.trim = trim ? trim : function () {
        return this.replace(/(^\s*)|(\s*$)/g,'');
    };

    /**
     * cookie操作主函数
     * @param {String} key 需要存储cookie的键（必需）
     * @param {String} value 需要存储cookie的值
     * @param {Object} options 设置域名，过期时间等参数，详细使用方法如下
     * @param {String} path 该cookie的可访问路径
     * @param {String} domain 该cookie的所属域名（多个域下的情况,如css.flz.cn和img.flz.cn想要访问各自设置的cookie，则domain应该是.flz.cn才可以，注意域名前面的点不是故意添加的，是必需）
     * @param {Number/Object} expires 该cookie的有效时间，当是数字类型时，是以天为单位。当是日期对像时，直接就是该日期
     * @param {Boolean} secure 设置secure为真，则该cookie只有在https协议下才会传输到服务端
     */
    flz.cookie = function(key, value, options) {

        var i, date,
            current_cookie,
            arr_cookie = [],
            old_cookie = null;

        if (!key || document.cookie === undefined) {
            return;
        }
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            arr_cookie.push(key + '=' + encodeURIComponent(value));
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                arr_cookie.push('expires=' + date.toUTCString()); // use expires attribute, max-age is not supported by IE
            }
            options.path && arr_cookie.push('path=' + options.path);
            options.domain && arr_cookie.push('domain=' + options.domain);
            options.secure && arr_cookie.push('secure');
            document.cookie = arr_cookie.join('; '); //设置当前cookie
        }else{
            if (document.cookie != ''){
                old_cookie = document.cookie.split(';');
                for (i = 0; i < old_cookie.length; i++) {
                    current_cookie = old_cookie[i].trim();
                    if (current_cookie.substring(0, key.length + 1) === (key + '=')) {
                        return unescape(decodeURIComponent(current_cookie.substring(key.length + 1)));
                        break;
                    }
                }
                return null; //没有设置该cookie的时候，返回null
            }
        }
    }

})();
