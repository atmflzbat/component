# Frame_animation模块使用说明

---

## 模块依赖

该模块不依赖任何其他模块

---

## 常规使用

- 引用地址：[frame_animation.js](../../base/frame_animation.js)

- 该模块（外部接口统一挂载在window.fengluzhe.shake）只提供了canvas、css3、stop三个方法供调用，传入必要参数就可以运行（详细API如下）

---

## 调用说明
## API概览
该模块提供API如下:
## API详细说明
### 统一说明如下：
- 参数都是按照传入顺序说明
- @param是参数的意思
- @return方法的返回值

### canvas 方法：

- @param {Object} show_dom 需要生成canvas动画的dom对象（必填）
- @param {Number} width canvas宽度（必填）
- @param {Number} height canvas高度（必填）
- @param {Array} img_arr 需要生产canvas动画的图片绝对地址有序数组（必填）
- @param {Function} end_fn 动画执行后的回调（动画只执行一次时可选）
- @param {Function} load_fn 动画帧预加载后的回调（动画帧预加载时可选）
- @param {Boolean} loop 该动画是否无限次循环播放
- @param {Boolean} is_loaded 该动画的各帧是否需要预加载
- @param {Number} time 动画执行一次所需要的时间
---
```javascript
window.fengluzhe.frame_animation.canvas({
    show_dom : dom,
    width: 300,
    height: 600,
    time: 1200,
    loop: true,
    img_arr: ['//img1.cache.xx.cn/cj/countdown4.png','//img1.cache.xx.cn/cj/countdown5.png'],
    is_loaded: true,
    end_fn: function(obj){
        //帧动画只执行一次的回调
        console.log(obj)
    },
    load_fn: function(obj){
        //动画帧预加载完毕的回调
        console.log(obj)
    }
});
```
### css3方法：

- @param {Object} show_dom 需要生成canvas动画的dom对象（必填）
- @param {Array} img_arr 需要生产canvas动画的图片绝对地址有序数组（必填）
- @param {Function} end_fn 动画执行后的回调（动画只执行一次时可选）
- @param {Function} load_fn 动画帧预加载后的回调（动画帧预加载时可选）
- @param {Boolean} loop 该动画是否无限次循环播放
- @param {Boolean} is_loaded 该动画的各帧是否需要预加载
- @param {Number} time 动画执行一次所需要的时间
---
```javascript
window.fengluzhe.frame_animation.css3({
    show_dom : dom,
    time: 1200,
    loop: true,
    is_loaded: true,
    img_arr: ['//img1.cache.xx.cn/cj/countdown4.png','//img1.cache.xx.cn/cj/countdown5.png'],
    end_fn: function(obj){
        //帧动画只执行一次的回调
        console.log(obj)
    },
    load_fn: function(obj){
        //动画帧预加载完毕的回调
        console.log(obj)
    }
});
```
### stop方法：

- @param {Object} show_dom 需要停止帧动画的dom对象（必填）
- @param {String} render 帧动画的生成方式（必填）
---
```javascript
window.fengluzhe.frame_animation.stop({
    show_dom : dom,
    render: "canvas"
});
```

![image](../images/cool.jpg)
