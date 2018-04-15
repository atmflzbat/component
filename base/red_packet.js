/**
 * @overview red_packet
 * @author Fenglz
 * @createDate 2017-10-31
 * @lastModifiedDate 2017-10-31
 * @lastModifiedBy Fenglz
 * @version 0.0.1
 */

;(function(){
    'use strict';
    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {};

    if(!document.addEventListener){
        alert('您的设备不支持red_packet.js中的提供的转盘服务');
    }

    if (flz.red_packet) {
        return;
    }

    if(!flz.event){
        alert('本模块是red_packet.js,它依赖event.js运行，请先加载依赖项');
    }

    var event = flz.event;

    flz.red_packet = function(obj){
        var btn_dom = obj.btn_dom,
            red_packet_dom = obj.red_packet_dom,
            animation_str = obj.animation_str,
            times= obj.times === 0 ? 0 : true,
            end_fn= obj.end_fn || function(){},
            zero_fn= obj.zero_fn || function(){},
            clicks = true;

        /*普通动画 */
        function get_data(obj){
            console.log("获得开奖网络数据");

            function stop_animation(){
                event.unbind(red_packet_dom, "webkitTransitionEnd", stop_animation);
                end_fn(obj);
                clicks = true;
            }

            event.bind(red_packet_dom, "webkitAnimationEnd", stop_animation);

            red_packet_dom.style.webkitAnimation = animation_str;
            red_packet_dom.style.webkitAnimationFillMode = "forwards";
        }

        if(typeof btn_dom !== "undefined"){
            event.down(btn_dom, function(){
                if(!times){
                    zero_fn();
                    return;
                }
                if(clicks){
                    clicks = false;
                    obj.click_fn({
                        end: get_data
                    });
                }
            });
        }

    };

})();
