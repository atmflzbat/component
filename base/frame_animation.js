/**
 * @overview frame_animation
 * @author Fenglz
 * @createDate 2017-07-20
 * @lastModifiedDate 2017-07-20
 * @lastModifiedBy Fenglz
 * @version 0.0.1
 */

;(function(){
    'use strict';
    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {};

    if (flz.frame_animation) {
        return;
    }

    /**
     * frame_animation组件入口暴露canvas、css3两个方法
     */

    flz.frame_animation = {
        time_obj : {},

        /**
         * load_frame_img方法
         * @param {Array} img_arr 图片帧url数组
         * @param {Function} callback 图片帧加载完后的回调函数
         */
        load_frame_img: function(obj){
            var img_arr= obj.img_arr,
                callback= obj.callback,
                i,
                len = img_arr.length,
                index = 0;

            for(i=0; i<len; i++){
                (function(j){
                    var img = new Image();
                    img.onload = img.onerror = function(){
                        // console.log(index);
                        index++;
                        if(index == len){
                            callback();
                        }
                    };
                    img.src = img_arr[j];
                })(i);
            }
        },

        /**
         * canvas方法
         * @param {Object} show_dom 需要生成canvas动画的dom对象
         * @param {Number} width canvas宽度
         * @param {Number} height canvas高度
         * @param {Array} img_arr 需要生产canvas动画的图片绝对地址有序数组
         * @param {Function} end_fn 动画执行后的回调
         * @param {Function} load_fn 动画帧预加载后的回调
         * @param {Boolean} loop 该动画是否无限次循环播放
         * @param {Boolean} is_loaded 该动画的各帧是否需要预加载
         * @param {Number} time 动画执行一次所需要的时间
         */
        canvas: function(obj){
            var show_dom = obj.show_dom,
                width = obj.width,
                height = obj.height,
                img_arr = obj.img_arr,
                end_fn = obj.end_fn || function(){},
                load_fn = obj.load_fn || function(){},
                loop = obj.loop || false,
                is_loaded = obj.is_loaded || false,
                len = img_arr.length,
                time_interval = obj.time/(len-1)||100,
                context_index = 0;

            if("getContext" in show_dom === false){
                alert("您的设备不支持frame_animation.js中的canvas方法提供的服务");
                return;
            }

            var context = show_dom.getContext("2d");
            show_dom.width = width;
            show_dom.height = height;

            /**
             * canvas绘制帧动画
             */
            function draw_canvas_animation(){
                function draw_image(index){
                    var img = new Image();
                    img.onload = img.onerror = function(){
                        show_dom.height = height;
                        context.drawImage(img, 0, 0);
                    };
                    img.src = img_arr[index];
                }
                draw_image(context_index);
                var timer = setInterval(function(){
                    context_index++;
                    draw_image(context_index);
                    if(context_index == len-1){
                        if(loop){
                            context_index = -1;
                        }else{
                            clearInterval(timer);
                            end_fn(obj);
                        }
                    }
                },time_interval);
                flz.frame_animation.time_obj[show_dom] = timer;
            }

            if(is_loaded){
                flz.frame_animation.load_frame_img({
                    img_arr: img_arr,
                    callback: function(){
                        draw_canvas_animation();
                        load_fn(obj);
                    }
                })
            }else{
                draw_canvas_animation();
            }

        },

        /**
         * css3方法
         * @param {Object} show_dom 需要生成canvas动画的dom对象
         * @param {Array} img_arr 需要生产canvas动画的图片绝对地址有序数组
         * @param {Function} end_fn 动画执行后的回调
         * @param {Function} load_fn 动画帧预加载后的回调
         * @param {Boolean} loop 该动画是否无限次循环播放
         * @param {Boolean} is_loaded 该动画的各帧是否需要预加载
         * @param {Number} time 动画执行一次所需要的时间
         */
        css3: function(obj){
            var show_dom = obj.show_dom,
                img_arr = obj.img_arr,
                end_fn = obj.end_fn || function(){},
                load_fn = obj.load_fn || function(){},
                loop = obj.loop || false,
                is_loaded = obj.is_loaded || false,
                time = obj.time || 1200,
                len = img_arr.length,
                css_video = 'css_video_' + Math.random().toString(36).slice(2);

            if(!("webkitAnimation" in document.documentElement.style)){
                alert("您的设备不支持frame_animation.js中的css3方法提供的动画服务");
                return;
            }

            /**
             * 生产css3动画字符串函数
             * @param {Array} url_arr 需要生产canvas动画的图片绝对地址有序数组
             * @return {String} css3动画字符串
             */
            function create_css_animation(url_arr){
                var i,
                    step = 100/len,
                    out_str = "@-webkit-keyframes "+ css_video +"{0%{background-image: url(" + url_arr[0] + ");}";
                for(i=0; i<len; i++){
                    var step_num = Math.ceil((i+1)*step),
                        step_str = step_num + "%{background-image: url("+ url_arr[i] +");}";
                    out_str += step_str;
                }
                out_str += "}";
                return out_str;
            }

            /**
             * js生产的css样式挂载到页面函数
             * @param {String} animation_str css3动画字符串
             */
            function add_style(animation_str){
                var style = document.createElement("style");
                style.type = "text/css";
                style.innerHTML = animation_str;
                document.head.appendChild(style);
            }
            var animation_str = create_css_animation(img_arr);
            add_style(animation_str);

            /**
             * css3绘制帧动画
             */
            function add_css3_animation(){
                if(loop){
                    show_dom.style.webkitAnimation = css_video + " " + time + "ms step-start infinite";
                }else{
                    show_dom.addEventListener("webkitAnimationEnd", function(){
                        end_fn(obj);
                    }, false);
                    show_dom.style.webkitAnimation = css_video + " " + time + "ms step-start";
                    show_dom.style.webkitAnimationFillMode = "forwards";
                }
            }

            if(is_loaded){
                flz.frame_animation.load_frame_img({
                    img_arr: img_arr,
                    callback: function(){
                        add_css3_animation();
                        load_fn(obj);
                    }
                })
            }else{
                add_css3_animation();
            }

        },

        /**
         * stop方法
         * @param {Object} show_dom 需要停止帧动画的dom对象
         * @param {String} render 帧动画的生成方式
         */
        stop: function(obj){
            var show_dom = obj.show_dom,
                render = obj.render;
            switch(render){
                case "canvas":
                    (function(){
                        var timer = flz.frame_animation.time_obj[show_dom];
                        clearInterval(timer);
                    })();
                    break;
                case "css3":
                    (function(){
                        show_dom.style.webkitAnimation = "";
                        show_dom.style.webkitAnimation = 'none';
                    })();
                    break;
            }
        }
    };

})();