/**
 * @overview scratch_award
 * @author Fenglz
 * @createDate 2017-12-13
 * @lastModifiedDate 2017-12-13
 * @lastModifiedBy Fenglz
 * @version 0.0.1
 */

;(function(){
    'use strict';
    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {},
        canvas = flz.canvas;

    if(("getContext" in (document.createElement("canvas"))) === false){
        alert("您的设备不支持canvas.js中提供的服务");
        return;
    }

    if(!canvas) {
        console.error('scratch_award插件：【依赖缺失】', '如果你看到该条信息,说明没有加载canvas.js作为本脚本依赖');
    }

    if (flz.scratch_award) {
        return;
    }

    /**
     * 获取已擦除面积百分数分子
     * @param {canvas} ctx canvas 2d作用域上下文
     * @param {Number} width canvas区域宽度
     * @param {Number} height canvas区域高度
     */
    function getTransparentPercent(ctx, width, height){

        /*ImageData 对象中的每个像素，都存在着四方面的信息，即 RGBA 值
        color/alpha 以数组形式存在，并存储于 ImageData 对象的 data 属性中。
        alpha 存在于数组索引值为4的倍数的位置。*/

        var imgData = ctx.getImageData(0, 0, width, height),
            pixles = imgData.data,
            pixles_len = pixles.length,
            transPixs = [],
            i;

        for (i = 0; i < pixles_len; i += 4) {
            if (pixles[i + 3] < 128) {
                transPixs.push(i);
            }
        }

        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    }

    /**
     * scratch_award方法
     * @param {Object} canvas_dom 需要生成canvas图片的dom对象
     * @param {Number} percent 已擦除占比 默认为60
     * @param {Number} radius 圆的半径，默认为30
     * @param {Boolean} radial 渐变效果，默认为false
     * @param {String} from_color 渐变开始颜色值
     * @param {String} to_color 渐变结束颜色值
     * @param {Function} start_fn 开始擦除回调函数
     * @param {Function} end_fn 完成擦除回调函数
     */
    function scratch_award(obj){

        var canvas_dom= obj.canvas_dom,
            ctx= canvas_dom.getContext('2d'),
            percent= obj.percent || 60,
            radius= obj.radius || 30,
            radial= obj.radial || false,
            from_color = obj.from_color || 'rgba(0,0,0,0.6)',
            to_color = obj.to_color || 'rgba(255, 255, 255, 0)',
            start_fn = obj.start_fn || function(){},
            end_fn = obj.end_fn || function(){},
            look_h = canvas_dom.offsetHeight,
            real_h = canvas_dom.height,
            rate = real_h/look_h,
            device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),
            scratch_flag = false,
            start_fn_flag = true,
            click_eve = device? 'touchstart': 'mousedown',
            move_eve = device? 'touchmove': 'mousemove',
            end_eve = device? 'touchend': 'mouseup';

        function reset(){
            canvas_dom.removeEventListener(move_eve,move);
            canvas_dom.removeEventListener(end_eve,end);
            canvas_dom.removeEventListener(click_eve,start);
        }

        function start(e){
            scratch_flag = true;

            var x = device? rate*(e.changedTouches[0].clientX-canvas_dom.getBoundingClientRect().left) : e.offsetX,
                y = device? rate*(e.changedTouches[0].clientY-canvas_dom.getBoundingClientRect().top) : e.offsetY;

            fengluzhe.canvas.draw_arc({
                canvas_dom: canvas_dom,
                x: x,
                y: y,
                radius: radius,
                erase: true,
                radial: radial,
                from_color: from_color,
                to_color: to_color
            });

            if(start_fn_flag){
                start_fn(e);
                start_fn_flag = false;
            }

            if(parseInt(getTransparentPercent(ctx, 535, 240))> percent){
                reset();
                end_fn(percent);
            }
        }

        function move(e){
            var x = device? rate*(e.changedTouches[0].clientX-canvas_dom.getBoundingClientRect().left) : e.offsetX,
                y = device? rate*(e.changedTouches[0].clientY-canvas_dom.getBoundingClientRect().top) : e.offsetY;

            if(scratch_flag){
                fengluzhe.canvas.draw_arc({
                    canvas_dom: canvas_dom,
                    x: x,
                    y: y,
                    radius: radius,
                    erase: true,
                    radial: radial,
                    from_color: from_color,
                    to_color: to_color
                });

                if(parseInt(getTransparentPercent(ctx, 535, 240))> percent){
                    reset();
                    end_fn();
                }
            }
            e.preventDefault();
        }

        function end(){

            scratch_flag = false;
        }

        canvas_dom.addEventListener(click_eve,start,false);
        canvas_dom.addEventListener(move_eve,move,false);
        canvas_dom.addEventListener(end_eve,end,false);
    }

    flz.scratch_award = scratch_award;

})();