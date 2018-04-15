/**
 * @overview layer
 * @author Fenglz
 * @createDate 2017-01-20
 * @lastModifiedDate 2017-03-24
 * @lastModifiedBy Fenglz
 * @version 0.3
 */
;(function(){
    var _win = window,
        flz = window.fengluzhe = window.fengluzhe ||{};
    if(flz.layer){
        return;
    }
    flz.layer = {
        init:function(obj){

            var open_dom = obj.open_dom,
                close_dom = obj.close_dom,
                box_dom = obj.box_dom,
                position = obj.position,
                content_html = obj.content,
                callback_obj = obj.callback,
                box_container = document.getElementById("box_container"),
                content = document.getElementById("content"),
                mask = document.getElementById("mask"),
                callback_btn = document.getElementById("callback_btn"),
                client_h,
                client_w,
                box_h,
                box_w;

            client_h = document.documentElement.clientHeight || document.body.clientHeight;
            mask.height = client_h;

            /*居中函数*/
            function center_box(){
                box_w = box_dom.offsetWidth;
                box_h = box_dom.offsetHeight;
                client_w = document.documentElement.clientWidth || document.body.clientWidth;
                box_dom.style.top = (client_h - box_h)/2 + "px";
                box_dom.style.marginTop = 0;
                box_dom.style.left = (client_w - box_w)/2 + "px";
                box_dom.style.marginLeft = 0;
            }

            /*打开弹窗*/
            function open_box(){
                box_container.style.display = "block";
                if(position == "center"){
                    center_box();
                }
            }

            /*对外暴露关闭弹窗方法*/
            this.close_box = function(){
                box_container.style.display = "none";
            };

            /*弹窗确定按钮绑定回调函数 ： 回来数据、调用函数*/
            if(Object.prototype.toString.call(callback_obj) == "[object Object]"){
                (function(){
                    var callback_btn = callback_obj.callback_btn,
                        callback_fn = callback_obj.callback_fn;
                    callback_btn.onclick = function(){
                        var data = data || {};
                        callback_fn(data);
                    }
                })();
            }

            /*不传触发按钮自动打开弹窗*/
            if(open_dom){
                open_dom.onclick = open_box;
            }else if(Object.prototype.toString.call(open_dom) == "[object Undefined]"){
                open_box();
            }

            /*自定义弹窗内部html结构*/
            if(content_html){
                content.innerHTML = content_html;
            }

            /*右上角关闭按钮不传不现实*/
            if(Object.prototype.toString.call(close_dom) == "[object HTMLAnchorElement]"){
                close_dom.style.display = "block";
                close_dom.onclick = function(){
                    box_container.style.display = "none";
                };
            }

            /*改变浏览器大小动态居中弹窗*/
            window.onresize = function(){
                if(position == "center"){
                    center_box();
                }
            }
        }

    };
})();
