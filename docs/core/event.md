# Event模块使用说明

---

## 模块依赖

该模块不依赖任何其他模块

---

## 常规使用

- 引用地址：[event.js](../../core/event.js)
- 该模块是对addEventListener的兼容配置，兼容所有浏览器，包括IE5，请放心使用
- 该模块（外部接口统一挂载在window.fengluzhe.event下）提供了一系列方法供调用，各个方法传入必要参数就可以运行（详细API如下）

---

## 调用说明
```javascript
window.fengluzhe.event.bind(target,'click',function(e){
    //回调
});

window.fengluzhe.event.click(target,function(e){
    //回调
});
```
## API概览
该模块提供API如下:（该模块只提供方法，前8个方法（除ready外）第一个参数必需是一个dom对象，即把事件绑定给谁）
- ready：dom准备完成回调
- bind：事件绑定
- click：click事件绑定
- tap：移动端tap事件绑定（pc端使用，默认使用click替换）
- delegate：事件委托
- down：（pc）鼠标按下或者（移动端）手指按下
- move：（pc）鼠标拖动或者（移动端）手指拖动
- up：（pc）鼠标松开或者（移动端）手指松开
- unbind：删除事件绑定
- undelegate：删除事件委托
- undown：解绑按下
- unmove：解绑拖动
- unup：解绑松开
- event：获取事件对象
- target：获取事件发生元素
- touch_enable：设置可触摸事件（默认自动识别）
- prevent_default：阻止事件默认行为
- stop_propagation：停止事件冒泡
## API详细说明
### 统一说明如下：

- 参数都是按照传入顺序说明
- target参数是需要绑定事件的dom对象，
- type是需要绑定的事件类型，如’click’（@注：不带’on’）
- fn是绑定事件的回调函数
- @param是参数的意思
- @return方法的返回值

### ready：

dom准备完成回调，该方法同样挂载到了fengluzhe上，以方便使用
- @param {Function} fn 回调函数，形参是fengluzhe对象[可选]

```javascript
window.fengluzhe.event.ready(function(flz){
    //your code here
});
```
  
### bind：

事件绑定
- @param {Object} target dom对象
- @param {String} type 事件类型
- @param {Function} fn 事件回调函数，形参是事件对象
- @return {String} guid 唯一的事件句柄，用来快捷解绑事件

```javascript
window.fengluzhe.event.bind(target, 'click', function(e){
    //your code here
});
```

### click：

click事件绑定
- @param {Object} target dom对象
- @param {String} selector 标签名或者类名（如’a’、’.btn’、’#btn’）：事件委托[可选]
- @param {Function} fn 事件回调函数。当没有selector时，形参是事件对象。当有selector参数时，形参是事件对象和发生事件的目标
- @return {String} guid 唯一的事件句柄，用来快捷解绑事件

```javascript
//常规绑定
window.fengluzhe.event.click(target,function(e){
    //your code here
});
//事件委托
window.fengluzhe.event.click(target, 'a', function(e, item){
    //your code here
});
```

### tap：

移动端tap事件绑定（pc端默认执行click事件）
- @param {Object} target dom对象
- @param {String} selector 标签名或者类名（如’a’、’.btn’、’#btn’）：事件委托[可选]
- @param {Function} fn 事件回调函数。当没有selector时，形参是事件对象。当有selector参数时，形参是事件对象和发生事件的目标
- @return {String} guid 唯一的事件句柄，用来快捷解绑事件

```javascript
//常规绑定
window.fengluzhe.event.tap(target,function(e){
    //your code here
});
//事件委托
window.fengluzhe.event.tap(target, 'a', function(e, item){
    //your code here
});
```

### delegate：

事件委托
- @param {Object} target dom对象
- @param {String} type 事件类型
- @param {String} selector 标签名或者类名（如’a’、’.btn’、’#btn’）：事件委托
- @param {Function} fn 事件回调函数。当没有selector时，形参是事件对象。当有selector参数时，形参是事件对象和发生事件的目标
- @return {String} guid 唯一的事件句柄，用来快捷解绑事件

```javascript
//常规绑定
window.fengluzhe.event.delegate(target, 'click', 'a', function(e, item){
    //your code here
});
```

### down：

鼠标（mousedown）按下或者手指（touchstart）按下
- @param {Object} target dom对象
- @param {Function} fn 事件回调函数，形参是事件对象
- @return {String} guid 唯一的事件句柄，用来快捷解绑事件

```javascript
//常规绑定
window.fengluzhe.event.down(target, function(e){
    //your code here
});
```

### move：

鼠标（mousemove）拖动或者手指（touchmove）拖动
- @param {Object} target dom对象
- @param {Function} fn 事件回调函数，形参是事件对象
- @return {String} guid 唯一的事件句柄，用来快捷解绑事件

```javascript
//常规绑定
window.fengluzhe.event.move(target, function(e){
    //your code here
});
```

### up：

鼠标（mouseup）松开或者手指（touchend）松开
- @param {Object} target dom对象
- @param {Function} fn 事件回调函数，形参是事件对象
- @return {String} guid 唯一的事件句柄，用来快捷解绑事件

```javascript
//常规绑定
window.fengluzhe.event.up(target, function(e){
    //your code here
});
```

### unbind：

鼠标（mouseup）松开或者手指（touchend）松开
- @param {Object} target dom对象或者guid（当使用guid时，其他参数就不需要了）
- @param {String} type 事件类型
- @param {Function} fn 事件回调函数

```javascript
//常规解绑
window.fengluzhe.event.unbind(target, 'click', fn);
//快捷解绑
window.fengluzhe.event.unbind(guid);
```

### undelegate：

删除事件委托
- @param {String} guid 唯一的事件句柄（即delegate方法的返回值）

```javascript
window.fengluzhe.event.undelegate(guid);
```

### undown：

解绑按下
- @param {Object} target dom对象或者guid（当使用guid时，其他参数就不需要了）
- @param {Function} fn 事件回调函

```javascript
//常规解绑
window.fengluzhe.event.undown(target, fn);
//快捷解绑
window.fengluzhe.event.undown(guid);
```

### unmove：

解绑拖动
- @param {Object} target dom对象或者guid（当使用guid时，其他参数就不需要了）
- @param {Function} fn 事件回调函数

```javascript
//常规解绑
window.fengluzhe.event.unmove(target, fn);
//快捷解绑
window.fengluzhe.event.unmove(guid);
```

### unup：

解绑松开
- @param {Object} target dom对象或者guid（当使用guid时，其他参数就不需要了）
- @param {Function} fn 事件回调函数

```javascript
//常规解绑
window.fengluzhe.event.unup(target, fn);
//快捷解绑
window.fengluzhe.event.unup(guid);
```

### event：

获取事件对象
- @param {Object} e 事件对象

```javascript
window.fengluzhe.event.event(e);
```

### target：

获取事件元素
- @param {Object} e 事件对象

```javascript
window.fengluzhe.event.target(e);
```

### touch_enable：

设置可触摸事件
- @param {Boolean} enable 真或者假

```javascript
window.fengluzhe.event.touch_enable(true);
```

### prevent_default：

阻止事件默认行为
- @param {Object} event 事件对象

```javascript
window.fengluzhe.event.prevent_default(event);
```

### stop_propagation：

停止事件冒泡
- @param {Object} event 事件对象

```javascript
window.fengluzhe.event.stop_propagation(event);
```


![image](../images/yes.jpg)
