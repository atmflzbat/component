# Layer模块使用说明

---

## 模块依赖

该模块依赖event.js和handlers模块，请事先加载依赖的模块后再运行该模块。

---

## 常规使用

- 引用地址：

1. [event.js](../../core/event.js)

1. [handlers.js](https://css.cache.jj.cn/js/jjmatch/utf8/core/handlers.js)

1. [canvas.js](../../base/canvas.js)

- 该模块（外部接口统一挂载在window.fengluzhe.layers）只提供了draw_img、draw_text、get_url、draw_arc、draw_rect三个方法供调用，传入必要参数就可以运行（详细API如下）

---

## 调用说明
## API概览
该模块提供API如下:
- draw_img：在画布上绘制图片
- draw_text：在画布上绘制文字
- draw_arc：在画布上绘制圆
- draw_rect：在画布上绘制矩形
- get_url：导出canvas所绘制图片的base64位url编码
## API详细说明
### 统一说明如下：
- 参数都是按照传入顺序说明
- @param是参数的意思
- @return方法的返回值

### draw_img方法：

- @param {Object} canvas_dom 需要生成canvas图片的dom对象(必填)
- @param {String} url 图片url(必填)
- @param {Number} x 图片x轴位置(必填)
- @param {Number} y 图片x轴位置(必填)
- @param {Number} width 图片宽度(必填)
- @param {Number} height 图片高度(必填)
- @param {String} crossOrigin 图片域名地址
- @param {Function} end_fn 绘制完一张图片的回调函数（多张图片绘制时需要一张一张绘制）

```javascript
window.fengluzhe.canvas.draw_img({
    canvas_dom : dom,
    url: '//img1.cache.xxx.cn/act/2017/qixi/res_front_pic.png',
    crossOrigin: '*',
    x: 0,
    y: 0,
    width: 673,
    height: 670,
    end_fn: function(e){
        console.log(e)
    }
});
```

### draw_text方法：

- @param {Object} canvas_dom 需要生成canvas图片的dom对象(必填)
- @param {String} text 文字内容(必填)
- @param {Number} x 文字x轴位置(必填)
- @param {Number} y 文字x轴位置(必填)
- @param {String} font 文字大小粗细字型等属性(必填)
- @param {String} fillStyle 文字颜色(必填)
- @param {String} textAlign 文字左右对齐方式
- @param {String} textBaseline 文字上下对齐方式
- @param {String} strokeStyle 文字描边颜色

```javascript
window.fengluzhe.canvas.draw_text({
    canvas_dom : dom,
    text: '请输入文字',
    x: 425,
    y: 155,
    font: '67px bold sans-serif',
    fillStyle: "#ffffff",
    textAlign: 'start',
    textBaseline: 'top',
    strokeStyle: "#e076bb"
});
```

### draw_arc方法：

- @param {Object} canvas_dom 需要生成canvas图片的dom对象
- @param {Number} x 矩形x轴位置
- @param {Number} y 矩形y轴位置
- @param {Number} radius 圆的半径，默认为30
- @param {String} url 背景图url地址，默认为空
- @param {Boolean} erase 用来擦除，默认为false
- @param {Boolean} radial 渐变效果，默认为false
- @param {Boolean} hollow 是否为中空圆，默认为false
- @param {Boolean} border 是否有边框，默认为false
- @param {String} bg_repeat 背景图重复方式，默认为不重复
- @param {Boolean} direction 圆的绘制方向，默认为false 顺时针
- @param {Number} sAngle 起始角，以弧度计
- @param {Number} eAngle 结束角，以弧度计
- @param {String} color 颜色
- @param {String} from_color 渐变开始颜色值
- @param {String} to_color 渐变结束颜色值
- @param {String} line_width 边框宽度

```javascript
    window.fengluzhe.canvas.draw_arc({
        canvas_dom : dom,//必填
        x : 50,//必填
        y : 50,//必填
        radius : 30,
        erase : true,//用于擦除
        radial : true,//用于渐变效果
        color : 'red',
        url:"http://img1.cache.xx.cn/www/2017/icon_02.jpg",//用于圆形图
        border:true, //url有值是填写
        bg_repeat:'no-repeat',//url有值是填写
        from_color : 'rgba(0,0,0,0.6)',
        to_color : 'rgba(255, 255, 255, 0)',
        hollow : true, //默认为false,为true时下方字段可选择配置
        direction : true,
        sAngle : 0,
        eAngle : Math.PI,
        line_width : '1'
    });
```

### draw_rect方法：

- @param {Object} canvas_dom 需要生成canvas图片的dom对象
- @param {Number} x 矩形x轴位置
- @param {Number} y 矩形y轴位置
- @param {Number} width 矩形宽度
- @param {Number} height 矩形高度
- @param {String} color 矩形颜色
- @param {Boolean} hollow 是否为中空矩形，默认为false
- @param {String} line_width 中空矩形时，边框宽度

```javascript
    fengluzhe.canvas.draw_rect({
        canvas_dom : canvas,//必填
        x: 60,//必填
        y: 60,//必填
        width: 415,//必填
        height: 120,//必填
        color: "blue",
        hollow: 'true', //默认为false 为true时以下字段可选择配置
        line_width: '2'
    });
```

### get_url方法：

- @param {Object} canvas_dom 需要生成canvas图片的dom对象(必填)
- @param {String} mime 图像的MIME类型格式
- @return {String} 返回图片base64位url编码

```javascript
var canvas_url = window.fengluzhe.canvas.get_url({
    canvas_dom : dom,
    mime: 'image/png'
});
console.log(canvas_url);
```
![image](../images/cool.jpg)
