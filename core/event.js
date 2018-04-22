/**
 * @overview event manager module of fengluzhe framework
 * @author fenglz
 * @createDate 2016-07-06
 * @lastModifiedDate 2016-07-18
 * @lastModifiedBy fenglz
 * @version 0.0.1
 */
;(function () {

    'use strict';
    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {};

    if (flz.event) {
        return;
    }

    var event_helper,
        is_bind = false,
        is_ready = false,
        ready_list = [],
        event_list = {},
        content_loaded = null,
        to_string = Object.prototype.toString,
        touch_enable = 'ontouchstart' in window,
        is_function = function (obj) {
            return to_string.call(obj) === '[object Function]';
        },
        is_array = function (obj) {
            return to_string.call(obj) === '[object Array]';
        },
        get_event = function (key) {
            var i, cuid;
            for (i in event_list) {
                if (event_list[i] === event_list[key]) {
                    cuid = event_list[i];
                    try {
                        delete event_list[i];
                    } catch (e) {
                        event_list[i] = null;
                    }
                    break;
                }
            }
            return cuid;
        },
        delegate_helper = function (obj) {

            var _selector,
                selector = obj.selector,
                items = obj.items,
                event = obj.event,
                fn = obj.fn,
                target = obj.target,
                parent_handle,
                find_parent = function (obj, _fn) {
                    if (obj === target) {
                        return false;
                    }
                    obj = obj.parentElement || obj.parentNode || null;
                    if (obj) {
                        if (_fn(obj)) {
                            return obj;
                        } else {
                            return find_parent(obj, _fn);
                        }
                    }
                };

            selector = selector.toLowerCase();

            if (/^#([\w-]+)$/.test(selector)) {
                _selector = selector.split('#')[1];
                if (_selector === items.id.toLowerCase()) {
                    fn(event, items);
                } else {
                    parent_handle = find_parent(items, function (obj) {
                        return _selector === obj.id.toLowerCase();
                    });
                    parent_handle && fn(event, parent_handle);
                }
            } else if (/^\.([\w-]+)$/.test(selector)) {
                _selector = selector.split('.')[1];
                if (new RegExp(_selector).test(items.className)) {
                    fn(event, items);
                } else {
                    parent_handle = find_parent(items, function (obj) {
                        return new RegExp(_selector).test(obj.className);
                    });
                    parent_handle && fn(event, parent_handle);
                }
            } else {
                if (items.nodeName.toLowerCase() == selector) {
                    fn(event, items);
                } else {
                    parent_handle = find_parent(items, function (obj) {
                        return obj.nodeName.toLowerCase() == selector;
                    });
                    parent_handle && fn(event, parent_handle);
                }
            }
        };

    /**
     * 兼容版添加事件
     * @param {Object} target 添加事件的dom对象
     * @param {String} type 事件类型
     * @param {Function} fn 回调事件
     */
    function add_event(target, type, fn) {
        if (target.addEventListener) {
            target.addEventListener(type, fn, false);
        } else if (target.attachEvent) {
            target.attachEvent('on' + type, fn);
        } else {
            target['on' + type] = fn;
        }
    }

    /**
     * 兼容版移除事件
     * @param {Object} target 移除事件的dom对象

     * @param {String} type 事件类型
     * @param {Function} fn 回调事件
     */
    function remove_event(target, type, fn) {
        if (target.removeEventListener) {
            target.removeEventListener(type, fn, false);
        } else if (target.detachEvent) {
            target.detachEvent('on' + type, fn);
        } else {
            target['on' + type] = null;
        }
    }

    /**
     * ready事件的事件队列处理
     */
    function ready() {
        if (!is_ready) {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (!document.body) {
                return setTimeout(ready, 13);
            }
            is_ready = true;
            if (ready_list) {
                var fn, i = 0;
                while ((fn = ready_list[i++])) {
                    fn(flz);
                }
                ready_list = null;
            }
        }
    }

    if (document.addEventListener) {
        content_loaded = function () {
            document.removeEventListener('content_loaded', content_loaded, false);
            ready();
        };
    } else if (document.attachEvent) {
        content_loaded = function () {
            if (document.readyState === 'complete') {
                document.detachEvent('onreadystatechange', content_loaded);
                ready();
            }
        };
    }

    /**
     * IE检查dom是否准备好
     */
    function scroll_check() {
        if (is_ready) {
            return false;
        }
        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll('left');
        } catch (error) {
            setTimeout(scroll_check, 1);
            return;
        }
        ready();
    }

    /**
     * 绑定准备事件
     */
    function bind_ready() {
        if (is_bind) {
            return;
        }
        is_bind = true;
        if (document.readyState === 'complete') {
            ready();
        }
        if (document.addEventListener) {
            document.addEventListener('content_loaded', content_loaded, false);
            window.addEventListener('load', ready, false);
        } else if (document.attachEvent) {
            document.attachEvent('onreadystatechange', content_loaded);
            window.attachEvent('onload', ready);
            if (document.documentElement.doScroll) {
                scroll_check();
            }
        }
    }

    event_helper = {

        /**
         * dom准备完成回调
         * @param {Function} fn 回调函数
         */
        ready: function (fn) {
            bind_ready();
            if (is_ready) {
                fn(flz);
            } else {
                ready_list.push(fn);
            }
        },

        /**
         * 设置可触摸事件
         * @param {Boolean} enable 真或者假
         */
        touch_enable: function (enable) {
            touch_enable = !!enable;
        },

        /**
         * 事件绑定
         * @param {Object} target dom对象
         * @param {String} type 事件类型
         * @param {Function} fn 事件回调函数
         * @return {String} guid 唯一的事件句柄
         */
        bind: function (target, type, fn) {
            var guid;

            (function debug(){
                if (typeof type != 'string') {
                    alert('事件类型必需传,且必需是字符串，如：click');
                    return;
                }
            })();

            guid = '_' + Math.random().toString(36).slice(2);
            event_list[guid] = {
                target: target,
                type: type,
                fn: fn
            };
            add_event(target, type, fn);
            return guid;
        },

        /**
         * 事件删除
         * @param {Object} target dom对象或者唯一的事件句柄
         * @param {String} type 事件类型
         * @param {Function} fn 事件回调函数
         */
        unbind: function (target, type, fn) {
            var event_handle;
            if (!target) {
                return;
            }
            if (typeof target === 'string') {
                event_handle = get_event(target);
                target = event_handle.target;
                type = event_handle.type;
                fn = event_handle.fn;
            }
            remove_event(target, type, fn);
        },

        /**
         * 鼠标按下或者手指按下
         * @param {Object} target dom对象
         * @param {Function} fn 事件回调函数
         * @return {String} guid 唯一的事件句柄
         */
        down: function (target, fn) {
            return event_helper.bind(target, touch_enable ? 'touchstart' : 'mousedown', fn);
        },

        /**
         * 鼠标拖动或者手指拖动
         * @param {Object} target dom对象
         * @param {Function} fn 事件回调函数
         * @return {String} guid 唯一的事件句柄
         */
        move: function (target, fn) {
            return event_helper.bind(target, touch_enable ? 'touchmove' : 'mousemove', fn);
        },

        /**
         * 鼠标松开或者手指松开
         * @param {Object} target dom对象
         * @param {Function} fn 事件回调函数
         * @return {String} guid 唯一的事件句柄
         */
        up: function (target, fn) {
            return event_helper.bind(target, touch_enable ? 'touchend' : 'mouseup', fn);
        },

        /**
         * 解绑按下
         * @param {Object} target dom对象或者唯一的事件句柄
         * @param {Function} fn 事件回调函数
         */
        undown: function (target, fn) {
            event_helper.unbind(target, touch_enable ? 'touchstart' : 'mousedown', fn);
        },

        /**
         * 解绑拖动
         * @param {Object} target dom对象或者唯一的事件句柄
         * @param {Function} fn 事件回调函数
         */
        unmove: function (target, fn) {
            event_helper.unbind(target, touch_enable ? 'touchmove' : 'mousemove', fn);
        },

        /**
         * 解绑松开
         * @param {Object} target dom对象或者唯一的事件句柄
         * @param {Function} fn 事件回调函数
         */
        unup: function (target, fn) {
            event_helper.unbind(target, touch_enable ? 'touchend' : 'mouseup', fn);
        },

        /**
         * click事件绑定
         * @param {Object} target dom对象
         * @param {String} selector 标签名或者类名（如.btn）：事件委托
         * @param {Function} selector 事件回调函数：直接绑定事件
         * @param {Function} fn 事件回调函数
         * @return {String} guid 唯一的事件句柄
         */
        click: function (target, selector, fn) {
            if (is_function(selector)) {
                return event_helper.bind(target, 'click', selector);
            } else if (typeof selector === 'string') {
                return event_helper.delegate(target, 'click', selector, fn);
            }
        },

        /**
         * 移动端tap事件绑定
         * @param {Object} target dom对象
         * @param {String} selector 标签名或者类名（如.btn）：事件委托
         * @param {Function} selector 事件回调函数：直接绑定事件
         * @param {Function} fn 事件回调函数
         * @return {Array} guid 唯一的事件句柄
         */
        tap: function (target, selector, fn) {

            if (!touch_enable) {
                event_helper.click(target, selector, fn);
                return;
            }

            var cuid,
                tap_info = {
                    begin_x: 0,
                    begin_y: 0,
                    begin_time: 0,
                    end_x: 0,
                    end_y: 0,
                    end_time: 0
                };

            cuid = event_helper.bind(target, 'touchstart', function (_e) {
                var touch_end_id, touchs = _e.changedTouches[0];
                tap_info.begin_x = touchs.pageY;
                tap_info.begin_y = touchs.pageX;
                tap_info.begin_time = +new Date();
                touch_end_id = event_helper.bind(target, 'touchend', function (e) {

                    var event,
                        items,
                        touchs = e.changedTouches[0];

                    tap_info.end_x = touchs.pageY;
                    tap_info.end_y = touchs.pageX;
                    tap_info.end_time = +new Date();

                    if ((Math.abs(tap_info.begin_y - tap_info.end_y) < 6 && Math.abs(tap_info.begin_x - tap_info.end_x) < 6 && (tap_info.end_time - tap_info.begin_time) > 30 && (tap_info.end_time - tap_info.begin_time) < 1500) || ((tap_info.end_time - tap_info.begin_time > 8) && Math.abs(tap_info.begin_y - tap_info.end_y) == 0)) {
                        if (is_function(selector)) {
                            selector(e);
                        } else if (typeof selector === 'string') {
                            event = e || window.event,
                            items = event.target || event.srcElement;
                            if (typeof selector === 'string') {
                                delegate_helper({
                                    fn: fn,
                                    items: items,
                                    event: event,
                                    target: target,
                                    selector: selector
                                });
                            }
                        }
                        event_helper.unbind(touch_end_id);
                    }
                });
            });

            return cuid;
        },

        /**
         * 阻止事件默认行为
         * @param {Object} event 事件对象
         */
        prevent_default: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },

        /**
         * 停止事件冒泡
         * @param {Object} event 事件对象
         */
        stop_propagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },

        /**
         * 事件委托
         * @param {Object} target dom对象或者对象
         * @param {String} type 事件类型
         * @param {String} selector 标签名或者类名（如.btn）
         * @param {Function} fn 事件回调函数
         * @return {String} guid 唯一的事件句柄
         */
        delegate: function (target, type, selector, fn) {
            return event_helper.bind(target, type, function (e) {
                var event = e || window.event,
                    items = event.target || event.srcElement;
                if (typeof selector === 'string') {
                    delegate_helper({
                        fn: fn,
                        items: items,
                        event: event,
                        target: target,
                        selector: selector
                    });
                }
            });
        },

        /**
         * 删除事件委托
         * @param {String} target 唯一的事件句柄
         */
        undelegate: function (target) {
            if (typeof target === 'string') {
                event_helper.unbind(target);
            } else {
                alert('删除事件委托，请保证参数是一个唯一的事件字符串或者数组');
            }
        },

        /**
         * 获取事件对象
         * @param {Object} e 事件对象
         */
        event: function (e) {
            return e || window.event;
        },

        /**
         * 获取事件元素
         * @param {Object} e 事件对象
         */
        target: function (e) {
            var event = e || window.event;
            return event.target || event.srcElement;
        }
    };

    flz.event = event_helper;
    flz.ready = event_helper.ready; //把常用ready函数挂载出去

})();
