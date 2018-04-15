/**
 * @overview canvas
 * @author Fenglz
 * @createDate 2017-08-07
 * @lastModifiedDate 2017-08-07
 * @lastModifiedBy Fenglz
 * @version 0.0.1
 */

;(function(){
    'use strict';
    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {};

    if(("getContext" in (document.createElement("canvas"))) === false){
        alert("您的设备不支持canvas.js中提供的服务");
        return;
    }

    if (flz.canvas) {
        return;
    }

    /**
     * canvas组件入口暴露draw_img、draw_text、get_url三个方法
     */

    flz.canvas = {

        /**
         * draw_img方法
         * @param {Object} canvas_dom 需要生成canvas图片的dom对象
         * @param {String} url 图片url
         * @param {Number} x 图片x轴位置
         * @param {Number} y 图片x轴位置
         * @param {Number} width 图片宽度
         * @param {Number} height 图片高度
         * @param {String} crossOrigin 图片域名地址
         * @param {Function} end_fn 绘制完一张图片的回调函数
         */
        draw_img: function(obj){
            var canvas_dom = obj.canvas_dom,
                context = canvas_dom.getContext("2d"),
                url = obj.url,
                crossOrigin = obj.crossOrigin || "flz.cn",
                x = obj.x,
                y = obj.y,
                width = obj.width || canvas_dom.width,
                height = obj.height || canvas_dom.height,
                end_fn = obj.end_fn || function(){},
                img = new Image();

            img.crossOrigin = crossOrigin;
            img.crossOrigin = "Anonymous";
            img.crossOrigin = "*";
            img.onload = img.onerror = function(e){
                context.drawImage(img, x, y,width,height);
                setTimeout(function(){
                    end_fn(e);
                },0);
            };
            img.src = url;
      /*      //  确保缓存的图片也触发 load 事件
            if ( img.complete || img.complete === undefined ) {
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            }*/
        },

        /**
         * draw_text方法
         * @param {Object} canvas_dom 需要生成canvas图片的dom对象
         * @param {String} text 文字内容
         * @param {Number} x 文字x轴位置
         * @param {Number} y 文字x轴位置
         * @param {String} font 文字大小粗细字型等属性
         * @param {String} textAlign 文字左右对齐方式
         * @param {String} textBaseline 文字上下对齐方式
         * @param {String} fillStyle 文字颜色
         * @param {String} strokeStyle 文字描边颜色
         */
        draw_text: function(obj){
            var canvas_dom = obj.canvas_dom,
                context = canvas_dom.getContext("2d"),
                text = obj.text,
                x = obj.x,
                y = obj.y,
                font = obj.font,
                textAlign = obj.textAlign || "start",
                textBaseline = obj.textBaseline || "top",
                fillStyle = obj.fillStyle,
                strokeStyle = obj.strokeStyle || "";

            context.fillStyle = fillStyle;
            context.strokeStyle = strokeStyle;
            context.font = font;
            context.textAlign = textAlign;
            context.textBaseline = textBaseline;
            context.fillText(text, x, y);
            if(strokeStyle !== ""){
                context.strokeText(text, x, y);
            }
        },

        /**
         * get_url方法
         * @param {Object} canvas_dom 需要生成canvas图片的dom对象
         * @param {String} mime 图像的MIME类型格式
         * @return {String} 返回图片base64位url编码
         */
        get_url: function(obj){
            var canvas_dom = obj.canvas_dom,
                mime = obj.mime || "image/png";
            return canvas_dom.toDataURL(mime);
        }
    };

})();