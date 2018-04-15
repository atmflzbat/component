/**
 * @overview loadlazy module of fengluzhe framework
 * @author fenglz
 * @createDate 2016-12-26
 * @lastModifiedDate 2016-12-27
 * @lastModifiedBy fenglz
 * @version 0.0.1
 */
;(function (undefined) {

    'use strict';

    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {};

    if (flz.loadlazy) {
        return;
    }

    if(!window.Sizzle || !flz.event){
        alert('本模块是loadlazy.js模块,请先加载依赖项sizzle.js和event.js');
        return ;
    }

    var doc = document,
        $ = _win.Sizzle,
        event = flz.event;

    /**
     * lazyload入口
     * @param {Object} args 参数配置项[可选]，各项如下：
     * @param {Number} timer 滑动时间隔多久执行判断函数，默认值是60[毫秒]
     * @param {Number} top  元素在窗口顶部伸出多少触发加载，默认值是0[像素]
     * @param {Number} right 元素在窗口右边伸出多少触发加载，默认值是0[像素]
     * @param {Number} bottom 元素在窗口底部伸出多少触发加载，默认值是0[像素]
     * @param {Number} left 元素在窗口左边伸出多少触发加载，默认值是0[像素]
     * @return {Object} 公开的API,每个API详细信息，见内部说明
     */
    function loadlazy(args) {
        args = args || {};
        var status = {
                old: +new Date
            },
            config = {
                target: $('img[data-src]'),
                timer: args.timer || 60,
                top: args.top || 0,
                left: args.left || 0,
                right: args.right || 0,
                bottom: args.bottom || 0,
                scroll_dom:args.scroll_dom || _win
            },
            client = {
                width: doc.documentElement.clientWidth || doc.body.clientWidth,
                height: doc.documentElement.clientHeight || doc.body.clientHeight,
                left: doc.documentElement.clientLeft || doc.body.clientLeft, //仅IE返回2，用于兼容
                top: doc.documentElement.clientTop || doc.body.clientTop //仅IE返回2，用于兼容
            };

        function update(){
            config.target = $('img[data-src]');
        }

        function get_offset(el) {
            var rect = el.getBoundingClientRect(),
                result = {
                    width: rect.right - rect.left,
                    height: rect.bottom - rect.top,
                    left: rect.left - client.left,
                    top: rect.top - client.top,
                    right: rect.right - client.left,
                    bottom: rect.bottom - client.top
                };
            return result;
        }

        function visual_area(el){
            var _position = get_offset(el),
                ready_x = _position.right - config.left > 0 && _position.left + config.right < client.width,
                ready_y = _position.bottom - config.top > 0 && _position.top + config.bottom < client.height;
            return _position.width > 0  && _position.height > 0  && ready_x && ready_y;
        }

        /**
         * 滚动判断函数[内部使用，不公开]
         * @param {Object} e 滚动函数事件，首次加载是null
         * @param {Boolean} once 判断是不是首屏加载
         */
        function scroll_fn(e, once){
            var i,
                data_src;
            if(!once && status.old){
                status.now = +new Date;
                if(status.now - status.old <= config.timer){
                    return;
                }else{
                    status.old = status.now;
                }
            }
//            if(config.target.length <= 0){
//                event.unbind(_win, 'scroll', scroll_fn);
//                return;
//            }
            //为了低版本浏览器，实时计算长度
            for(i = 0; i < config.target.length; i++){
                if(visual_area(config.target[i])){
                    data_src = config.target[i].getAttribute('data-src');
                    if(data_src){
                        config.target[i].src = data_src;
                        config.target[i].removeAttribute('data-src');
                    }
                    !once && config.target.splice(i, 1);
                }
            }
        }

        //等待样式渲染完成，再去计算位置
        event.ready(function(){
            event.bind(config.scroll_dom, 'scroll', scroll_fn);
            //手动触发一次，保证第一屏正常
            scroll_fn(null, true);
        });

        return {

            /**
             * 公开的方法，用于ajax异步更新数据
             */
            update: update,

            /**
             * 获取元素相对窗口的位置，内部是getBoundingClientRect函数的封装
             * @param {Object} el 需要判读位置的dom对象
             * @return {Object} 元素的宽高上下左右具体窗口的位置，其中下是相对于窗口顶部来说，右是相对窗口左部来说的
             */
            get_offset: get_offset,

            /**
             * 判断元素是否在可视窗口内
             * @param {Object} el 需要判读位置的dom对象
             * @return {Boolean} 是否在可视窗口内
             */
            visual_area: visual_area
        }
    };

    flz.loadlazy = loadlazy;

})();
