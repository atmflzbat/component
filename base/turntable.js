/**
 * @overview turntable
 * @author Fenglz
 * @createDate 2017-06-25
 * @lastModifiedDate 2017-06-27
 * @lastModifiedBy Fenglz
 * @version 0.0.1
 */

;(function(){
	'use strict';
	var _win = window,
		flz = _win.fengluzhe = _win.fengluzhe || {},
        turn_infinite = "infinite_" + (+new Date()),
        animation_timer = /qq/.test(navigator.userAgent.toLowerCase()) ? 100 : 1;

    if(!document.addEventListener){
        alert('您的设备不支持lottery_turnable.js中的提供的转盘服务');
    }

	if (flz.turntable) {
		return;
	}

	if(!flz.event){
	    alert('本模块是lottery_turnable.js,它依赖event.js运行，请先加载依赖项');
    }

    var event = flz.event;

    /**
     * 创建css动画
     */
    (function(){
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = "@-webkit-keyframes " + turn_infinite + "{0% {-webkit-transform: rotate(0deg);}100% {-webkit-transform: rotate(1080deg);}}\n" + "@keyframes " + turn_infinite + "{0% {transform: rotate(0deg);}100% {transform: rotate(1080deg);}}";
        document.body.appendChild(style);
    })();

	/**
     * 点击开始转函数
     * @param {object} turntable 添加旋转动画的dom对象
	*/
    function add_animation(turntable){
        turntable.style.cssText = "";
        turntable.style.webkitAnimation = turn_infinite + " 1s linear 2";
    }

    /**
     * 转盘组件入口
     * @param {object} pointer 启动转盘dom对象
     * @param {object} turntable 转盘dom对象
     * @param {Boolean} is_pointer 转盘是否是指针自身
     * @param {Number} awards_num 转盘奖品种类总数
     * @param {function} end_fn 转盘抽奖完毕回调函数
     * @param {function} click_fn 点击按钮请求中奖数据函数
     * @param {function} zero_fn 抽奖次数为0的回调函数
     */
	flz.turntable = function(obj){
        var pointer = obj.pointer,
            turntable = obj.turntable,
            is_pointer = obj.is_pointer,
            awards_num = obj.awards_num,
            end_fn = obj.end_fn || function(){},
            zero_fn = obj.zero_fn || function(){},
            target_position,
            clicks = true,
            times = obj.times === 0 ? 0 : true

        /**
         * 请求中将数据回调并转停到指定位置
         * @param {object} obj 请求中将返回的数据
         */
        function get_data(obj){
            //请求数据成功失败转盘听的位置判断
            var turn_deg;

            //调整数据格式
            try{
                if(obj.REV){
                    times = obj.DATA.lottery_times;
                    var position = obj.DATA.prize.seq;
                    target_position = is_pointer ? position : awards_num - position;
                    turn_deg = (1080 + (360/awards_num) * target_position);
                }else{
                    turn_deg = 1080 + 180/awards_num;
                }
            }catch (ex){
                turn_deg = 1080 + 180/awards_num;
                console.log("抽奖接口返回数据有问题");
                console.log(ex);
            }
            turntable.style.webkitAnimation = 'none';
            setTimeout(function(){
                turntable.style.webkitAnimation = turn_infinite + " 1s linear 1";
                /**
                 * 转停后回调
                 */
                function stop_transition(){
                    event.unbind(turntable, "webkitTransitionEnd", stop_transition);
                    end_fn(obj);
                    clicks = true;
                }

                /**
                 * 一直转停止回调
                 */
                function stop_animation(){
                    event.unbind(turntable, "webkitAnimationEnd", stop_animation);
                    turntable.style.webkitAnimation = 'none';
                    setTimeout(function(){
                        turntable.style.webkitTransition = "-webkit-transform 2s ease-out";
                        turntable.style.webkitTransform = "rotate(" + turn_deg + "deg)";
                        event.bind(turntable, "webkitTransitionEnd", stop_transition);
                    }, 1);
                }
                event.bind(turntable, "webkitAnimationEnd", stop_animation);
            }, animation_timer);
        }

        /**
         * 添加绑定事件
         */
        if(typeof pointer !== "undefined"){
            event.down(pointer, function(){
                if(!times){
                    zero_fn();
                    return;
                }
                if(clicks){
                    clicks = false;
                    add_animation(turntable);
                    obj.click_fn({
                        end: get_data
                    });
                }
            });
       }
    };
})();

