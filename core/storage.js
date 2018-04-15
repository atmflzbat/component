/**
 * @overview event manager module of fengluzhe framework
 * @author fenglz
 * @createDate 2017-04-10
 * @lastModifiedDate 2017-04-10
 * @lastModifiedBy fenglz
 * @version 0.0.1
 */
;(function (flz) {
    'use strict';
    !flz && (window.fengluzhe = flz = {});
    if (flz.storage) {
        return;
    }
    if(!window.localStorage){//判断浏览器是否支持本地存储
        alert("浏览器不支持本地存储");
        return false;
    }
    var storage,
        store;
    function check_type(obj){
         if({}.toString.call(obj) === "[object Object]"){
             if(obj.type === "session"){
                 store = sessionStorage;
             }else{
                 store = localStorage;
             }
         }else{
             alert("storage所有方法传值均为对象")
         }

     }
    storage = {
        set : function(obj){
            check_type(obj);
            store.setItem(obj.name, obj.val);
        },
        get : function(obj){
            if(obj.type === "all"){
                if(localStorage.getItem(obj.name)){
                    return localStorage.getItem(obj.name);
                }else{
                    return sessionStorage.getItem(obj.name);
                }
            }else{
                check_type(obj);
                return store.getItem(obj.name);
            }
        },
        remove : function(obj){
            if(obj.type === "all"){
                sessionStorage.removeItem(obj.name);
                localStorage.removeItem(obj.name);
            }else{
                check_type(obj);
                store.removeItem(obj.name);
            }
        },
        clear : function (obj) {
            if(obj.type === "all"){
                sessionStorage.clear();
                localStorage.clear();
            }else{
                check_type(obj);
                store.clear();
            }
        }
    };
    flz.storage = storage;

})(window.fengluzhe);

