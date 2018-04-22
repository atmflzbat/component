# Cookie模块使用说明

---

## 模块依赖

该模块不依赖任何其他模块

---

## 常规使用

- 引用地址：[cookie.js](../../core/cookie.js)

- 该模块（外部接口统一挂载在window.fengluzhe.cookie下）只提供了一个方法供调用，传入必要参数就可以运行（详细API如下）

---

## 调用说明
```javascript
//set cookie
window.fengluzhe.cookie('name', 'fenglz', {
    domain: 'xx.cn',
    path: '/',
    expires: 1,
    secure: true
});

//get cookie
window.fengluzhe.cookie('name');
```
## API概览
该模块提供API如下:
- cookie 设置和获取cookie方法
## API详细说明
### 统一说明如下：

- 参数都是按照传入顺序说明
- @param是参数的意思
- @return方法的返回值

### cookie操作主函数：

- @param {String} key 需要存储cookie的键（只传该参数则是获取cookie值）
- @param {String} value 需要存储cookie的值[可选]
- @param {Object} options 设置域名，过期时间等参数，该参数是一个对象，对象各属性如下[可选]
- @param {String} path 该cookie的可访问路径
- @param {String} domain 该cookie的所属域名（多个域下的情况,如css.xx.cn和img.xx.cn想要访问各自设置的cookie，则domain应该是.xx.cn才可以，注意域名前面的点不是故意添加的，是必需）
- @param {Number/Object} expires 该cookie的有效时间，当是数字类型时，是以天为单位。当是日期对象时，直接就是该日期
- @param {Boolean} secure 设置secure为真，则该cookie只有在https协议下才会传输到服务端
  ```javascript
  //set cookie
  window.fengluzhe.cookie('company', 'xx', {
  domain: 'xx.cn',
  path: '/',
  expires: 1,
  secure: true
  });

  //get cookie
  window.fengluzhe.cookie('company');
  ```

![image](../images/cool.jpg)
