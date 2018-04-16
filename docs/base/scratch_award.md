# Scratch_award模块使用说明

---

## 模块依赖

该模块依赖canvas模块

---

## 常规使用

- 引用地址：

[canvas.js](../../base/canvas.js)

[scratch_award.js](../../base/scratch_award.js)
- 该模块（外部接口统一挂载在window.fengluzhe.scratch_award）只提供了scratch_award方法供调用，传入必要参数就可以运行（详细API如下）

---

## 调用说明
## API概览
该模块提供API如下:
## API详细说明
统一说明如下：
- 参数都是按照传入顺序说明
- @param是参数的意思
- @return方法的返回值

scratch_award方法：

- @param {Object} canvas_dom 需要生成canvas图片的dom对象
- @param {Number} percent 已擦除占比 默认为60
- @param {Number} radius 圆的半径，默认为30
- @param {Boolean} radial 渐变效果，默认为false
- @param {String} from_color 渐变开始颜色值
- @param {String} to_color 渐变结束颜色值
- @param {Function} start_fn 开始擦除回调函数
- @param {Function} end_fn 完成擦除回调函数
---
```javascript
    fengluzhe.scratch_award({
        canvas_dom: canvas, //必填
        radius: 40,
        percent: 60,
        radial: true,
        start_fn: function(e){
            console.log('开始刮奖回调');
        },
        end_fn: function(arg){
            console.log('刮开区域大于阈值回调');
        }
    });
```


![image](../images/ok.jpg)
