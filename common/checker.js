/**
 * @overview checker
 * @author Fenglz
 * @createDate 2017-03-15
 * @lastModifiedDate 2017-03-15
 * @lastModifiedBy Fenglz
 * @version 0.0.1
 */

;(function(){

    var _win = window,
        flz = window.fengluzhe = window.fengluzhe || {},
        sms_flag = true,
        timer;

    if(!flz.network){
        alert('本模块是checker.js模块,请先加载依赖项network.js');
        return ;
    }

    /*出生日期有效性验证*/
    function validate_date(date) {
        if (date instanceof Date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = month < 10 ? '0' + month: month;
            var day = date.getDate();
            day = day < 10 ? '0' + day: day;
            return ''+ year + month + day;
        }
        return '';
    }

    /*获取带汉字的字符串的长度 : charCodeAt方法*/
    function cc_len(str){
        var len=0,
            str_len = str.length,
            i,
            charcode;
        for(i = 0; i<str_len; i++){
            charcode = str.charCodeAt(i);
            if(charcode>=0 && charcode<=128){
                len++;
            }else{
                len+=2;
            }
        }
        return len;
    }

    /*正确手机号点击获取验证码 + 倒计时*/
    function sms_fn(get_sms,sms_url){
        var sms = get_sms.sms_dom,
            sms_verify_span = get_sms.tip_dom,
            sms_btn = get_sms.sms_btn,
            after_fn = get_sms.after_fn;
        sms_btn.onclick = function(){
            if(sms_flag){
                fenglz.network.get(sms_url ,function(data){
                    if(data.REV){
                        if(Object.prototype.toString.call(after_fn) == "[object Function]"){
                            after_fn(data);
                        }

                        /*倒计时效果*/
                        var _time = Boolean(timer);
                        if(_time){
                            return true;
                        }else{
                            if(sms.disabled){
                                sms.removeAttribute("disabled");
                            }
                            var time_num = 60;
                            sms_btn.innerText ="(" + time_num + ")秒再次获取";

                            timer = setInterval(function(){
                                time_num--;
                                sms_btn.innerText ="(" + time_num + ")秒再次获取";
                                if(time_num == 1){
                                    sms_btn.innerText ="重新获取验证码";
                                    sms_flag = true;
                                    clearInterval(timer);
                                    timer = false;
                                }
                            },1000);
                        }
                    }else{
                        sms_verify_span.innerHTML = "<span class='e_tips'>" + decodeURIComponent(data.MSG) +"</span>";
                    }

                } , 'jsonp');
            }
        };
    }

    if(flz.checker){
        return;
    }

    flz.checker = {

        init:function(obj){
            var that = this;
            for (var keys in obj){
                switch (keys)
                {
                    case "email" :
                        (function(){
                            var _obj = obj[keys],
                                _must = _obj.must,
                                _dom = _obj.dom;
                            if(_must == true) {
                                that.results_obj.email = "请填写邮箱";
                            }
                            _dom.onblur = function(){
                                var _value = this.value,
                                    _tip_dom = _obj.tip_dom,
                                    _e_url = _obj.get_url(_value),
                                    after_fn = _obj.fn(_value);
                                that.test_email(_value,_tip_dom,_e_url,after_fn,_must);
                            };
                        })();
                        break;

                    case "nickname" :
                        (function(){
                            var _obj = obj[keys],
                                _must = _obj.must,
                                _dom = _obj.dom;
                            if(_must == true){
                                that.results_obj.nickname = "请填写昵称";
                            }
                            _dom.onblur = function(){
                                var _value = this.value,
                                    _tip_dom = _obj.tip_dom,
                                    n_url = _obj.get_url(_value);
                                that.test_nickname(_value,_tip_dom,n_url,_must);
                            };
                        })();
                        break;

                    case "mobile" :
                        (function(){
                            var _obj = obj[keys],
                                _must = _obj.must,
                                _dom = _obj.dom;
                            if(_must == true) {
                                that.results_obj.mobile = "请填写手机号";
                            }
                            _dom.onblur = function(){
                                var _value = this.value,
                                    _tip_dom = _obj.tip_dom,
                                    p_url = _obj.get_url(_value),
                                    get_sms = _obj.get_sms,
                                    sms_url = _obj.sms_url(_value);
                                that.test_mobile(_value,_tip_dom,get_sms,p_url,sms_url,_must);
                            };
                        })();
                        break;

                    case "password" :
                        (function(){
                            var _obj = obj[keys],
                                _dom = _obj.dom,
                                _must = _obj.must;
                            if(_must == true) {
                                that.results_obj.password = "请填写密码";
                            }
                            _dom.onblur = function(){
                                var _value = this.value,
                                    _tip_dom = _obj.tip_dom;
                                that.test_password(_value,_tip_dom,_must);
                            };
                        })();
                        break;

                    case "re_password" :
                        (function(){
                            var _obj = obj[keys],
                                _must = _obj.must,
                                _dom = _obj.dom;
                            if(_must == true) {
                                that.results_obj.re_password = "请再次填写密码";
                            }
                            _dom.onblur = function(){
                                var _value = this.value,
                                    _tip_dom = _obj.tip_dom,
                                    init_value = _obj.init_dom.value;
                                that.test_password_2(init_value,_value,_tip_dom,_must);
                            };
                        })();
                        break;

                    case "realname" :
                        (function(){
                            var _obj = obj[keys],
                                _dom = _obj.dom,
                                _must = _obj.must;
                            if(_must == true) {
                                that.results_obj.realname = "请填写真实姓名";
                            }
                            _dom.onblur = function(){
                                var _value = this.value,
                                    _tip_dom = _obj.tip_dom;
                                that.test_realname(_value,_tip_dom,_must);
                            };
                        })();
                        break;

                    case "citizen_num" :
                        (function(){
                            var _obj = obj[keys],
                                _dom = _obj.dom,
                                _must = _obj.must;
                            if(_must == true) {
                                that.results_obj.citizen_num = "请填写身份证号";
                            }
                            _dom.onblur = function(){
                                var _value = this.value,
                                    _tip_dom = _obj.tip_dom;
                                that.test_citizen_num(_value,_tip_dom,_must);
                            };
                        })();
                        break;

                    case "protocal" :
                        (function(){
                            var _obj = obj[keys],
                                _dom = _obj.dom,
                                on = _obj.on,
                                off = _obj.off,
                                _must = _obj.must;
                            if(_must == true) {
                                that.test_protocal(_dom, on, off, _must);
                            }
                            _dom.onblur = function(){
                                that.test_protocal(_dom , on , off,_must);
                            };
                        })();
                        break;

                    default:
                        break;
                }
            }
        },

        /*是否为空*/
        test_empty: function(value,tip_dom,tip_msg){
            if(value == ""){
                tip_dom.innerHTML = tip_msg;
                return false;
            }else{
                return true;
            }
        },

        /*手机号*/
        test_mobile : function(_value,_tip_dom,get_sms,p_url,sms_url,_must){
            _tip_dom.innerHTML = "<span class='loading'></span>";

            var _flag = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70)[0-9]{8}$/g.test(_value),
                empty_flag,
                that = this,
                sms_btn = get_sms.sms_btn,
                _tip_msg = "<span class='e_tips'> 手机号不能为空。</span>";
            empty_flag = this.test_empty(_value,_tip_dom,_tip_msg);

            if(!empty_flag){
                if(Object.prototype.toString.call(get_sms.sms_box)=="[object Function]"){
                    sms_tips = "手机号不能为空。";
                    get_sms.sms_box(sms_tips,sms_btn);
                }
                if(_must == true){
                    that.results_obj.mobile = "手机号不能为空";
                }
                return false;
            }else if(!_flag) {
                _tip_dom.innerHTML = "<span class='e_tips'> 请输入11位有效手机号码。</span>";
                if(Object.prototype.toString.call(get_sms.sms_box)=="[object Function]"){
                    sms_tips = "请输入11位有效手机号码。";
                    get_sms.sms_box(sms_tips,sms_btn);
                }
                if(_must == true){
                    that.results_obj.mobile = "请输入11位有效手机号码";
                }
                return false;
            }else if(Object.prototype.toString.call(p_url)!=="[object String]"){
                _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                sms_fn(get_sms,sms_url);
                if(_must == true){
                    that.results_obj.mobile = true;
                }
                return true;
            }else{
                fenglz.network.get(p_url , function(data){
                    if(data.REV){
                        _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                        sms_fn(get_sms,sms_url);
                        if(_must == true){
                            that.results_obj.mobile = true;
                        }
                        return true;
                    }else{
                        _tip_dom.innerHTML = "<span class='e_tips'>"+ decodeURIComponent(data.MSG) +"</span>";
                        if(Object.prototype.toString.call(get_sms.sms_box)=="[object Function]"){
                            sms_tips =  "" + decodeURIComponent(data.MSG);
                            get_sms.sms_box(sms_tips,sms_btn);
                        }
                        if(_must == true){
                            that.results_obj.mobile = "decodeURIComponent(data.MSG)";
                        }
                        return false;
                    }
                } , "jsonp");
            }
        },

        /*邮箱*/
        test_email : function(_value,_tip_dom,_e_url,after_fn,_must){
            var _flag = /^([a-zA-Z0-9_-]\.*)+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)*(\.[a-zA-Z0-9_-]{2,3})$/.test(_value),
                empty_flag,
                that = this,
                _tip_msg = "<span class='e_tips'> 邮箱帐号不能为空。</span>";
            empty_flag = this.test_empty(_value,_tip_dom,_tip_msg);
            if(!empty_flag){
                if(_must == true){
                    that.results_obj.email = "邮箱帐号不能为空";
                }
                return false;
            }else if(!_flag) {
                _tip_dom.innerHTML = "<span class='e_tips'> 请输入有效邮箱。</span>";
                if(_must == true){
                    that.results_obj.email = "请输入有效邮箱";
                }
                return false;
            }else if(Object.prototype.toString.call(_e_url) !== "[object String]"){
                _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                if(Object.prototype.toString.call(_e_url) == "[object Function]"){
                    _e_url();
                }
                if(_must == true){
                    that.results_obj.email = true;
                }
                return true;
            }else{
                fenglz.network.get(_e_url , function(data){
                    if(data.REV){
                        _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'>" + decodeURIComponent(data.MSG)  + "</span>";
                        if(Object.prototype.toString.call(after_fn) == "[object Function]"){
                            after_fn();
                        }
                        if(_must == true){
                            that.results_obj.email = true;
                        }
                        return true;
                    }else{
                        _tip_dom.innerHTML = "<span class='e_tips'>" + decodeURIComponent(data.MSG)  + "</span>";
                        if(_must == true){
                            that.results_obj.email = "decodeURIComponent(data.MSG)";
                        }
                        return false;
                    }
                } , 'jsonp');
            }
        },

        /*昵称*/
        test_nickname : function(_value,_tip_dom,n_url,_must){

            _tip_dom.innerHTML = "<span class='loading'></span>";
            var _flag = /[\u4E00-\u9FA50-9a-zA-Z_]/.test(_value),
                length = cc_len(_value),
                empty_flag,
                that = this,
                _tip_msg = "<span class='e_tips'> 昵称不能为空。</span>";
            empty_flag = this.test_empty(_value,_tip_dom,_tip_msg);
            if(!empty_flag){
                if(_must == true){
                    that.results_obj.nickname = "昵称不能为空";
                }
                return false;
            }else if(!_flag) {
                _tip_dom.innerHTML = "<span class='e_tips'> 字符类型不对。</span>";
                if(_must == true){
                    that.results_obj.nickname = "字符类型不对";
                }
                return false;
            }else if(length<4 || length>19){
                _tip_dom.innerHTML = "<span class='e_tips'> 位数不对。</span>";
                if(_must == true){
                    that.results_obj.nickname = "位数不对";
                }
                return false;
            }else if(Object.prototype.toString.call(n_url)!=="[object String]"){
                _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                if(_must == true){
                    that.results_obj.nickname = true;
                }
                return true;
            }else{
                fenglz.network.get(n_url , function(data){
                    if(data.REV){
                        _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                        if(_must == true){
                            that.results_obj.nickname = true;
                        }
                        return true;
                    }else{
                        _tip_dom.innerHTML = "<span class='e_tips'>"+ decodeURIComponent(data.MSG) +"</span>";
                        if(_must == true){
                            that.results_obj.nickname = decodeURIComponent(data.MSG);
                        }
                        return false;
                    }
                } , "jsonp");
            }
        },

        /*密码*/
        test_password : function(_value,_tip_dom,_must){
            _tip_dom.innerHTML = "<span class='loading'></span>";
            var _flag = /^(?![a-zA-Z]+$)(?!\d+$)(?![^0-9a-zA-Z]+$)/.test(_value),
                _len = _value.split("").length,
                empty_flag,
                that =this,
                _tip_msg = "<span class='e_tips'> 密码不能为空。</span>";
            empty_flag = this.test_empty(_value,_tip_dom,_tip_msg);
            if(!empty_flag){
                if(_must == true){
                    that.results_obj.password = "密码不能为空";
                }
                return false;
            }else if(_len<8 || _len>18){
                _tip_dom.innerHTML = "<span class='e_tips'> 密码字符个数为8-18位</span>";
                if(_must == true){
                    that.results_obj.password = "密码字符个数为8-18位";
                }
                return false;
            }else if(!_flag) {
                _tip_dom.innerHTML = "<span class='e_tips'> 密码不能为纯数字纯字母纯特殊字符</span>";
                if(_must == true){
                    that.results_obj.password = "密码不能为纯数字纯字母纯特殊字符";
                }
                return false;
            }else{
                _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                if(_must == true){
                    that.results_obj.password = true;
                }
                return true;
            }
        },

        /*确认密码*/
        test_password_2 : function(init_value,_value,_tip_dom,_must){
            _tip_dom.innerHTML = "<span class='loading'></span>";
            var empty_flag,
                that = this,
                _tip_msg = "<span class='e_tips'> 确认密码不能为空。</span>";
            empty_flag = this.test_empty(_value,_tip_dom,_tip_msg);
            if(!empty_flag){
                if(_must == true){
                    that.results_obj.re_password = "确认密码不能为空";
                }
                return false;
            }else if(_value !== init_value){
                _tip_dom.innerHTML = "<span class='e_tips'> 两次填写的密码不一致</span>";
                if(_must == true){
                    that.results_obj.re_password = "两次填写的密码不一致";
                }
                return false;
            }else{
                _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                if(_must == true){
                    that.results_obj.re_password = true;
                }
                return true;
            }
        },

        /*身份证号*/
        test_citizen_num : function(_value,_tip_dom,_must){
            _tip_dom.innerHTML = "<span class='loading'></span>";
            var province={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var card_list = _value.split(""),
                sum = 0,
                position,
                valide_test = true,
                date_test = true,
                init_num,
                empty_flag,
                that = this,
                _tip_msg = "<span class='e_tips'> 身份证不能为空。</span>";
            var regExp_test = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/i.test(_value),
                province_code = _value.substr(0,2);

            if(card_list.length == 15){
                var year = "19" + _value.substr(6,2),
                    month = _value.substr(8,2),
                    day = _value.substr(10,2);
            }else{
                year = _value.substr(6,4);
                month = _value.substr(10,2);
                day = _value.substr(12,2);
            }
            var date = year + month + day,
                init_date = new Date(year + '/' + month + '/' + day),
                validated_date =  validate_date(init_date);
            if(date !== validated_date){
                date_test = false;
            }
            if(card_list.length == 18){
                var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1],
                    ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
                for( var i = 0; i < 17; i++){
                    sum += Wi[i] * card_list[i];// 加权求和
                }
                position = sum % 11;
                if(card_list[17] == "x" || card_list[17] == "X"){
                    card_list[17] = 10;
                }
                init_num = parseInt(card_list[17]);
                if(ValideCode[position] !== init_num) {
                    valide_test = false;
                }
            }
            empty_flag = this.test_empty(_value,_tip_dom,_tip_msg);
            if(!empty_flag){
                if(_must == true){
                    that.results_obj.citizen_num = "身份证不能为空";
                }
                return false;
            }else if(card_list.length!=15 && card_list.length!=18 ){
                _tip_dom.innerHTML = "<span class='e_tips'> 身份证号长度不对。</span>";
                if(_must == true){
                    that.results_obj.citizen_num = "身份证号长度不对";
                }
                return false;
            }else if(!regExp_test){
                _tip_dom.innerHTML = "<span class='e_tips'> 身份证号格式不对。</span>";
                if(_must == true){
                    that.results_obj.citizen_num = "身份证号格式不对";
                }
                return false;
            }else if(!province[province_code]){
                _tip_dom.innerHTML = "<span class='e_tips'> 行政区号书写有误。</span>";
                if(_must == true){
                    that.results_obj.citizen_num = "行政区号书写有误";
                }
                return false;
            }else if(!date_test){
                _tip_dom.innerHTML = "<span class='e_tips'> 出生年月日填写错误。</span>";
                if(_must == true){
                    that.results_obj.citizen_num = "出生年月日填写错误";
                }
                return false;
            }else if(!valide_test){
                _tip_dom.innerHTML = "<span class='e_tips'> 校验位出错。</span>";
                if(_must == true){
                    that.results_obj.citizen_num = "校验位出错";
                }
                return false;
            }else{
                _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                if(_must == true){
                    that.results_obj.citizen_num = true;
                }
                return true;
            }

        },

        /*真实姓名*/
        test_realname : function(_value,_tip_dom,_must){
            var _flag = /^[\u4e00-\u9fa5]{2,4}$/.test(_value),
                empty_flag,
                that =this,
                _tip_msg = "<span class='e_tips'> 真实姓名不能为空。</span>";
            empty_flag = this.test_empty(_value,_tip_dom,_tip_msg);
            if(!empty_flag){
                if(_must == true){
                    that.results_obj.realname = "真实姓名不能为空";
                }
                return false;
            }else if(!_flag) {
                _tip_dom.innerHTML = "<span class='e_tips'> 只能输入2-4位汉字。</span>";
                if(_must == true){
                    that.results_obj.realname = "只能输入2-4位汉字";
                }
                return false;
            }else{
                _tip_dom.innerHTML = "<span class='e_tips e_tips_ok'></span>";
                if(_must == true){
                    that.results_obj.realname = true;
                }
                return true;
            }
        },

        /*阅读协议*/
        test_protocal : function(protocal_dom , on , off,_must){
            var that = this;
            if(protocal_dom.checked){
                protocal_dom.value = on;
                if(_must == true){
                    that.results_obj.protocal = true;
                }
                return true;
            }else{
                protocal_dom.value = off;
                if(_must == true){
                    that.results_obj.protocal = "请接受服务条款";
                }
                return false;
            }
        },

        /*必填项验证结果*/
        results_obj : {}

    };



})();



