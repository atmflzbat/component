/**
 * @overview shake
 * @author Fenglz
 * @createDate 2017-07-07
 * @lastModifiedDate 2017-07-07
 * @lastModifiedBy Fenglz
 * @version 0.0.1
 */

;(function(){
    'use strict';
    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {},
        handler = {};

    if(!('ondevicemotion' in window)){
        alert('您的设备不支持shake.js中的提供的摇一摇服务');
    }

    if (flz.shake) {
        return;
    }

    /**
     * 摇一摇组件入口
     * @param {string} name 标识本次配置摇一摇
     * @param {string} orientation 设备摇动方向
     * @param {Number} threshold 加速度改变阈值
     * @param {Number} timeout 持续时间阈值
     * @param {function} callback 摇一摇事件触发的处理函数
     * @return {string}本次配置摇一摇的名字
     * @param {string} name 将要关闭摇一摇的名字
     */
    flz.shake = {
        init: function(obj){
            var name = obj.name || ('_' + Math.random().toString(36).slice(2)),
                orientation = obj.orientation || "left_right",
                threshold = obj.threshold || 6,
                timeout = obj.timeout || 700,
                callback = obj.callback,
                last_time = new Date(),
                last_x = null,
                last_y = null,
                last_z = null;

            /**
             * devicemotion事件处理程序
             */
            handler[name] = function(e){
                var current = e.accelerationIncludingGravity,
                    delta_x = 0,
                    delta_y = 0,
                    delta_z = 0,
                    current_time,
                    delta_time;

                //初始化
                if((last_x === null) && (last_x === null) && (last_x === null)){
                    last_x = current.x;
                    last_y = current.y;
                    last_z = current.z;
                    return;
                }

                delta_x = Math.abs(last_x - current.x);
                delta_y = Math.abs(last_y - current.y);
                delta_z = Math.abs(last_z - current.z);

                /**
                 * 判断是否达到持续时间的最小阈值
                 */
                function verify_duration(timeout){
                    current_time = new Date();
                    delta_time = current_time.getTime() - last_time.getTime();
                    if(delta_time > timeout){
                        callback(name);
                        last_time = new Date();
                    }
                }
                switch(orientation){
                    case "left_right":
                        if((delta_x > threshold)&&(delta_y > threshold)){
                            verify_duration(timeout);
                        }
                        break;
                    case "front_end":
                        if((delta_y > threshold)&&(delta_z > threshold)){
                            verify_duration(timeout);
                        }
                        break;
                    case "vertical_rolled":
                        if((delta_x > threshold)&&(delta_z > threshold)){
                            verify_duration(timeout);
                        }
                        break;
                }

                last_x = current.x;
                last_y = current.y;
                last_z = current.z;
            };
            _win.addEventListener("devicemotion", handler[name], false);
            return name;
        },
        stop : function(name){
            switch (name){
                case "all" :
                    (function(){
                        var key;
                        for(key in handler){
                            if(handler.hasOwnProperty(key)){
                                _win.removeEventListener("devicemotion", handler[key], false);
                            }
                        }
                    })();
                    break;
                default :
                    _win.removeEventListener("devicemotion", handler[name], false);
                    break;
            }
        }
    };
})();