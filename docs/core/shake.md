# Shake模块使用说明

---

## 模块依赖

该模块不依赖任何其他模块

---

## 常规使用

- 引用地址：[shake.js](../../core/shake.js)

- 该模块（外部接口统一挂载在window.fengluzhe.shake）只提供了init、stop两个方法供调用，传入必要参数就可以运行（详细API如下）

---

## 调用说明
```javascript
window.fengluzhe.shake.init({
    orientation: "left_right",
    threshold: 6,
    timeout: 800,
    callback: function(name){
        //解绑指定name摇一摇
        window.fengluzhe.shake.stop(name);
    }
});
```
## API概览
该模块提供API如下:
- init：配置摇一摇事件及处理程序
- stop：解绑摇一摇(指定名字、全部)
## API详细说明
### 统一说明如下：

- 参数都是按照传入顺序说明
- (*)开头的为必填参数
- @param是参数的意思
- @return方法的返回值

###init方法：

- @param {string} name 标识独立的每一次摇一摇（可选）
- @param {string} orientation 设备摇动方向含left_right、front_end、vertical_rolled三种选项（可选默认为left_right）
- @param {Number} threshold 加速度改变阈值，根据手机兼容性情况值最大建议为20（可选）
- @param {Number} timeout 持续时间阈值（可选）
- @param {function} callback 摇一摇事件触发的处理函数，参数为本次配置摇一摇的名字（必填）
- @return {string}本次配置摇一摇的名字

###stop方法：

- @param {string} name 将要关闭摇一摇的名字
- @param {string} “all” 关闭本页面配置的所有摇一摇功能
```javascript
var shake = window.fengluzhe.shake;
   shake.init({
      name : "view",
      orientation: "left_right",
      threshold: 6,
      timeout: 800,
    * callback: function(name){
         shake.stop(name);
      }
   });
var return_name = shake.init({
      orientation: "front_end",
      threshold: 12,
      timeout: 1000,
    * callback: function(name){
         shake.stop(name);
      }
   });
//关闭指定配置摇一摇
shake.stop(return_name);
//关闭本页面所有摇一摇
shake.stop("all");
```

![image](../images/ok.jpg)
