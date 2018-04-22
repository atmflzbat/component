# Network模块使用说明

---

## 模块依赖

该模块不依赖任何其他模块

---

## 常规使用

- 引用地址：[network.js](../../core/network.js)

- 该模块（外部接口统一挂载在window.fengluzhe.network下）只提供了三个方法供调用，各个方法传入必要参数就可以运行（详细API如下）

---

## 调用说明
```javascript
window.fengluzhe.network.ajax({
    url: '',
    type: 'GET',
    data: null,
    contentType: 'application/json',
    dataType: 'json',
    timeout: 1000, //1s
    async: true,
    before: function () {},
    error: function () {},
    success: function () {},
    complete: function () {}
});
```
## API概览
该模块提供API如下:
- ajax：请求ajax方法
- get：对ajax的get类型的简易调用
- post：对ajax的post类型的简易调用
## API详细说明
### 统一说明如下：

- 参数都是按照传入顺序说明
- @param是参数的意思
- @return方法的返回值

### ajax：

ajax方法，参数是一个对象，对象各属性如下
- @param {String} url 请求网址
- @param {String} type 方法，默认值:’GET’[可选]
- @param {Object/String} data 请求的数据[可选]
- @param {String} contentType 请求头[可选]
- @param {String} dataType 请求的类型 ，默认是’json’[可选’json/jsonp’]
- @param {Boolean} async 是否异步,默认true[可选]
- @param {Number} timeout 超时时间，默认是2000ms（@注：xhr可用，jsonp不可用）[可选]
- @param {Function} before 发送之前执行的函数，可接收过滤后的参数[可选]
- @param {Function} error 请求报错执行的函数，可接收失败的状态码和状态信息[可选]
- @param {Function} success 请求成功的回调函数，可接收成功之后返回的数据
- @param {Function} complete 无论成功失败都会执行的回调[可选]

```javascript
window.fengluzhe.network.ajax({
    url: '',
    type: 'GET',
    data: null,
    contentType: 'application/json',
    dataType: 'json',
    timeout: 1000, //1s
    async: true,
    before: function () {},
    error: function () {},
    success: function () {},
    complete: function () {}
});
```
  
### get：

get方法的简单封装
- @param {String} url 请求网址
- @param {Object/String} data 请求的数据[可选]
- @param {Function} success 请求成功的回调函数，可接收成功之后返回的数据
- @param {String} dataType 请求的类型 ，可选’json/jsonp’[可选]

```javascript
window.fengluzhe.network.get(url, null, function(res){
    //your code
}, 'json');
```

### post：

post方法的简单封装
- @param {String} url 请求网址
- @param {Object/String} data 请求的数据[可选]
- @param {Function} success 请求成功的回调函数，可接收成功之后返回的数据
- @param {String} dataType 请求的类型 ，可选’json/jsonp’[可选]

```javascript
window.fengluzhe.network.post(url, null, function(res){
    //your code
}, 'json');
```

![image](../images/yes.jpg)
