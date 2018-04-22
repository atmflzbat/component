# Turntable模块使用说明

---

## 模块依赖

该模块依赖event.js模块，请事先加载依赖的模块后再运行该模块。

---

## 常规使用

- 引用地址：

   [turntable.js](../../base/turntable.js)

   [scratch_award.js](../../base/scratch_award.js)
- 该模块（外部接口统一挂载在window.fengluzhe.turntable）只提供了一个方法供调用，传入必要参数就可以运行（详细API如下）

---

## 调用说明
```javascript
window.fengluzhe.turntable({
    pointer : lottery_btn,
    turntable : lottery_panel,
    is_pointer : true,
    awards_num : 5,
    click_fn: function (obj) {
        obj.end(obj);
    },
    end_fn: function(obj){
        console.log(obj);
    },
    zero_fn: function () {
        //your code here
    }
});
```
## API概览
该模块提供API如下:
turntable：转盘主方法
## API详细说明
统一说明如下：

参数都是按照传入顺序说明
(*) 开头的为必填参数
@param是参数的意思
turntable方法：

@param {object} pointer 启动转盘dom对象
@param {object} turntable 转盘dom对象
@param {Boolean} is_pointer 转盘是否是指针自身（可选）
@param {Number} awards_num 转盘奖品种类总数
@param {function} end_fn 转盘抽奖完毕回调函数
@param {function} click_fn 点击按钮请求中奖数据函数
@param {function} zero_fn 抽奖次数为0的回调函数
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
## 抽奖prize组件
- prize地址：[prize.js](../../common/prize.js)
- 开始旋转回调函数由prize组件提供

```javascript
var click_fn_obj;
var data = {
    no: "iAmiD",//活动id
    open: {
        open_id: 'open1',//抽奖任务的id号
        url: '//mob.my.jj.cn/api/activity/2017bnhb.php', //抽奖活动对应的接口
    },
    task_list: [],
    success: function(data) {
        if (data.TASK_ID === 'open1') {
            click_fn_obj.end(data);
        }
    },
    error: function(data) {
        if (data.TASK_ID === 'open1') {
            click_fn_obj.end(data);
        }
    }
};
if (window.jjmatch.prize.init(data,"test1") === false) {
    console.error('初始化时失败');
}
window.jjmatch.turntable({
    pointer : lottery_btn,
    turntable : lottery_panel,
    is_pointer : true,
    awards_num : 5,
    //times为首次加载页面通过任务系统获取用户的抽奖机会
    times : time,
    click_fn: function (obj) {
        //开始旋转回调 对象参数 通过变量click_fn_obj传递给prize组件的成功回调处理
        click_fn_obj = obj;
        window.jjmatch.prize.open("test1");
    },
    end_fn: function(obj){
        console.log(obj);
    },
    zero_fn: function () {
        //your code here
    }
});
```

![image](../images/ok.jpg)
