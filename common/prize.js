/**
 * Created by fenglz on 2017/4/24.
 * @author fenglz
 * @description 抽奖活动任务管理组件
 */
;(function (fenglz, undefined) {
    'use strict';
    var network = fenglz.network, //网络请求模块
        layer = fenglz.layer, //弹层模块
        cookie = fenglz.cookie, //弹层模块
        loading,//加载动画
        isload = 0,//判断是否该打开或关闭加载动画标志
        load_content,//动画的内容
        map = {//集合(用于储存活动的伪数组)
            length: 0
        };

    if(!network||!cookie){
        throw new Error("看见该错误说明未引用fenglz.network或者fenglz.cookie");
    }

    /**
     * 集合的添加方法
     * @param key 键
     * @param value 值
     * @returns {boolean} 是否添加成功
     */
    map.add = function (key, value) {
        if (typeof key === 'string' && key !== 'length' && !map[key]) {
            this[key] = value;
            this.length += 1;
            return true;
        }
        return false;
    };

    /**
     * 打开加载动画的方法
     */
    function open_loading() {
        if (load_content && !isload++) {
            loading = layer.loading(load_content);
        }
    }

    /**
     * 关闭加载动画的方法
     */
    function close_loading() {
        if (load_content && --isload === 0) {
            loading.close();
        }
    }

    /**
     * 发请求的操作封装（请求数据的通用方法）
     * @param no 活动id
     * @param ajax_data ajax数据
     * @param fn 回调方法
     * @private
     */
    function _ajax(no, ajax_data, fn) {
        open_loading();
        setTimeout(function () {
            network.ajax({
                url: ajax_data.url,
                type: 'GET',
                data: {
                    'activity_id': no,
                    'u_ltime': cookie('u_ltime'),
                    'u_pass': cookie('u_pass'),
                    'User_Id': cookie('User_Id'),
                    'User_Nick': cookie('User_Nick'),
                    'upass2': cookie('upass2'),
                    'UserNick2': cookie('UserNick2')
                },
                contentType: 'application/json',
                dataType: 'jsonp',
                success: fn,
                error: function (e) {
                    throw new Error(e);
                }
            });
        }, 100);
    }

    /**
     * 暴露的init统一入口
     * @param data 数据
     * @param name 活动key值（用于保存活动）
     * @returns {boolean}
     */
    function prize_init(data, name) {
        name = name || '0';
        var pri = new prize();
        if (pri._check_data(data) && map.add(name, pri)) {
            pri.before();
            return true;
        }
        return false;
    }

    /**
     * 暴露的open方法的入口
     * @param name 区别活动的活动名
     */
    function open_init(name) {
        name = name || '0';
        if (map[name]) {
            map[name].open();
        }
    }


    /**
     * 暴露的before方法的入口
     * @param data 任务数据
     * @param name 任务所属活动名
     * @returns {boolean}
     */
    function before_init(data, name) {
        var pr,//活动对象
            task = false,//任务对象
            save = 'yes';//是否需要保存
        name = name || '0';
        if (map[name]) {
            pr = map[name];
            if (typeof data === 'object') {
                task = data;
                save = 'yes';
            } else if (pr.task[data]) {
                task = pr.task[data];
                save = 'no';
            }
            if (task) {
                pr.before(task, save);//执行的任务
                return true;
            }
        }
        return false;
    }

    /**
     * 活动对象
     */
    function prize() {
        this.task = {};//任务列表对象
    }

    prize.prototype = {
        constructor: prize,

        /**
         * 执行任务的方法（不传参内部调用）
         * @param before_data 任务数据
         * @param isinside 是否是内部调用
         */
        before: function (before_data, isinside) {
            var _self = this;
            before_data = before_data || '0';
            isinside = isinside || 'yes';
            // 内部自动调用
            if (before_data === '0') {
                //初始化数据
                var tasklist = (this.prize_data.task_list instanceof Array) ? this.prize_data.task_list : [];
                tasklist.forEach(function (item) {
                    _self.task[item.task_id] = item;
                });
                for (var key in this.task) {
                    if (this.task[key].auto) {
                        this.before(this.task[key], 'no');//该任务还未执行过（第二个参数为false不需要保存任务）
                    }
                }
            } else {
                if (this._check_task(before_data)) {
                    if (isinside === 'yes') {//外部调用需线存储task
                        this.task[before_data.task_id] = before_data;//保存到task中
                    }//不需要存储到task队列中
                    _ajax(this.no, before_data, function (data) {
                        /**
                         * 判断是不是获取奖品列表的任务如果是的话需要保存获取的奖品列表到
                         * prize对象中的goods_list属性里
                         */
                        if (before_data.is_goods === true) {
                            _self.goods_list = data.DATA.goods_list;//获取奖品列表
                        }
                        _self._common_return(data, before_data.task_id);
                    });
                }
            }
        },

        /**
         * 开奖方法
         */
        open: function () {
            var _self = this;
            _ajax(this.no, this.open_task, function (data) {//执行抽奖操作
                _self._common_return(data, _self.open_task.open_id);
            });
        },

        /**
         * 校验请求数据（task/before方法）
         * @param req_data 任务数据
         * @returns {boolean} 是否通过校验
         * @private
         */
        _check_task: function (req_data) {
            if (!req_data || !req_data.url || !req_data.task_id) {//对任务的必填基础数据进行校验
                //不可逆错误直接throw
                throw new Error("校验任务失败。未传入基础数据(task_url,task_id,auto必填");
            }
            return true;
        },

        /**
         * 初始化时候的数据校验和基础数据的赋值
         * @param prize_data 传入的配置数据对象
         * @returns {boolean} 返回true标识初始校验成功
         * @private
         */
        _check_data: function (prize_data) {
            if (!prize_data) {//校验是否传入基础数据
                throw new Error("未传入基础数据");
            } else if (typeof prize_data.success !== 'function' || typeof prize_data.error !== 'function') {
                throw new Error("未传入成功，错误回调方法");
            } else if (!prize_data.open || !prize_data.open.open_id || !prize_data.open.url) {
                throw new Error("未传入开奖任务");
            } else if (!prize_data.no) {
                throw new Error("未传入活动id");
            } else {
                this.prize_data = prize_data;//初始化数据的对象
                this.no = prize_data.no;//活动id
                this.open_task = prize_data.open;//开奖任务对象
                this.success = prize_data.success;  //成功回调
                this.error = prize_data.error;//失败回调
                if (prize_data.load && !layer) {
                    throw new Error("使用load需在prize之前引入fenglz.layer");
                } else {
                    //初始化奖品列表
                    load_content = prize_data.load || '';
                }
                return true;
            }
        },

        /**
         * 通用的任务结果返回方法
         * @param data ajax后请求得到的参数
         * @param task_id  任务ID号
         * @private
         */
        _common_return: function (data, task_id) {//通用的错误成功处理方法
            data.task_id = task_id;
            close_loading();
            if (data.REV) {
                this.success(data);
            } else {
                this.error(data);
            }
        }
    }

    /**
     * 将prize挂载到fenglz上
     * @type {{init: Window.fenglz.prize.init, before: Window.fenglz.prize.before, open: Window.fenglz.prize.open}}
     */
    fenglz.prize = {
        init: function (data, name) {
            return prize_init(data, name);//暴露出去的init方法用于初始化和存储一个抽奖模块
        },
        before: function (data, name) {
            return before_init(data, name);//暴露出去的before方法用于执行任务
        },
        open: function (name) {
            open_init(name);//暴露出去的open方法用于开奖
        }
    }
})(window.fenglz);