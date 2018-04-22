# Red_packet模块使用说明

---

## 模块依赖

该模块不依赖任何其他模块

---

## 常规使用

- 引用地址：[red_packet.js](../../base/red_packet.js)

- 该模块（外部接口统一挂载在window.fengluzhe.red_packet）只提供了red_packet方法供调用，可结合抽奖组件prize.js进行抽奖需求的应用。传入必要参数就可以运行（详细API如下）

- 使用该模块需提前定义好需要的CSS动画
```css
@-webkit-keyframes lottery_box {
  0%{background-image: url("//img1.cache.xx.cn/act/2017/fengke/box_close.png");}
  50%{background-image: url("//img1.cache.xx.cn/act/2017/fengke/box_open.png");}
  100%{background-image: url("//img1.cache.xx.cn/act/2017/fengke/box_close.png");}
}
```
- 抽奖动画组件原理：通过抽奖查询接口判断可抽奖次数——如果为0执行相应回调不为零———-点击抽奖按钮——将定义好的css动画应用到dom元素上——发送ajax请求获取抽奖数据—-拿到数据—-动画停止—-执行动画停止回调（中奖弹窗）
---

## 调用说明
## API概览
## API详细说明
### 统一说明如下：
- 参数都是按照传入顺序说明
- @param是参数的意思
- @return方法的返回值

### red_packet方法：
  
- @param {Object} btn_dom 点击按钮的dom对象
- @param {Object} red_packet_dom 挂在动画的dom对象
- @param {String} animation_str CSS3 animation动画 lottery_box 1.5s step-start 1
- @param {Number} times 抽奖机会
- @param {Function} end_fn 动画结束回调函数
- @param {Function} zero_fn 机会为0回调函数
- @param {Function} click_fn 点击开奖回调函数

```javascript
    fengluzhe.red_packet({
        red_packet_dom: lottery_box,
        btn_dom: open_dom,
        times: '1',
        animation_str: 'lottery_box 1.5s step-start 1',
        click_fn: function(){
            console.log("点击先执行开奖动画");
        },
        end_fn: function(obj){
            console.log("动画结束回调");
        },
        zero_fn: function(){
            console.log("抽奖机会为零");
        }
    });
```

# 结合prize.js抽奖组件使用：

引用地址:[prize.js](../../common/prize.js)
- red_packet.js组件和prize.js抽奖组件结合原理：

- prize.js组件请求抽奖数据———数据返回格式已确定—-以数据层组件prize设计结构为基础进行UI层组件的结合——通过一进页面执行check_status查询中奖机会———对应check_status任务的success成功回调判断是否有机会有机会则——绑定UI组件——-times字段传刚查询到的机会
  
- 关键点开始！！！！—-点击开奖按钮—执行prize组件open方法开奖—-同时将click_fn的对象参数传给全局变量click_fn_obj—-组件内提前定义了click_fn的对象参数的end方法，等到开奖任务run_lottery的success数据回来后执行click_fn_obj.end(data)—-即执行red_packet组件内已定义好的end方法，达到通过回调传参的功能。

```javascript
        var click_fn_obj,
            lottery_data = {
            no: '2017hzsr',
            task_list: [{
                task_id: 'check_status',
                url: 'https://a6.srv.xx.cn/lottery/index.php?method=check',
                auto: true
            }],
            open: {
                open_id: 'run_lottery',
                url: 'https://a6.srv.xx.cn/lottery/index.php?method=lottery'
            },
            success: function (data) {
                switch (data.task_id){
                    case "check_status":
                        (function(){
                            if(data.DATA.lottery_times === 0){
                                console.log("抽奖机会检查为零");
                            }else{
                                console.log("有抽奖机会");
                                fengluzhe.red_packet({
                                    red_packet_dom: lottery_box,
                                    btn_dom: open_dom,
                                    times: data.DATA.lottery_times,
                                    animation_str: 'lottery_box 1.5s step-start 1',
                                    click_fn: function(obj){
                                        console.log("点击先执行开奖动画");
                                        click_fn_obj = obj;
                                        prize.open();
                                    },
                                    end_fn: function(obj){
                                        console.log("动画结束回调");
                                        console.log(obj);
                                    },
                                    zero_fn: function(){
                                        console.log("抽奖机会为零");
                                    }
                                });
                            }
                        })();
                        break;
                    case "run_lottery":
                        //open方法执行后，回调数据给UI层
                        click_fn_obj.end(data);
                        break;
                }
            },
            error: function (data) {
                switch (data.task_id){
                    case "check_status":
                        console.log("网络错误");
                        break;
                    case "run_lottery":
                        click_fn_obj.end(data);
                        break;
                }
            }
        };
        setTimeout(function () {
            if (fengluzhe.prize.init(lottery_data) === false) {
                console.error('初始化时失败');
            }
        }, 500);
```
![image](../images/yes.jpg)
