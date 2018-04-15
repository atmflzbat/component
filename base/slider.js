/**
* @overview slider
* @author Fenglz
* @createDate 2017-01-05
* @lastModifiedDate 2017-01-13
* @lastModifiedBy Fenglz
* @version 0.2
*/

;(function(){

    var _win = window,
        flz = window.fengluzhe = window.fengluzhe ||{},
        timer;

    if(flz.slider){
        return;
    }

    function change_style(num,tab,con){
        var j,
            len = tab.length,
            init_pic = len-num-1;
        for(j=0; j<len; j++){
            con[j].className = "un_opaque";
            tab[j].className = "";
        }
        con[init_pic].className = "opaque";
        tab[num].className = "selected";
    }

    flz.slider = {
        init:function(obj){
            var _this = this,
                i,
                tab_list = obj.tab_list,
                con_list = obj.con_list,
                len = tab_list.length,
                flag = obj.flag;
                _this.index = obj.auto_position;
            this.tab = (function change_tab(){
                for(i=0; i<len; i++){
                    (function(j){
                        tab_list[j].onclick = function(){
                            clearInterval(_this.timer);
                            change_style(j,tab_list,con_list);
                        };
                    })(i);
                }
            })();
            this.auto = function(){
                if(flag){
                    _this.timer = setInterval(function(){
                        change_style(_this.index,tab_list,con_list);
                        _this.index++;
                        if(_this.index === len){
                            _this.index = 0;
                        }
                    },2000);
                }
            };
            this.auto();
            this.substitute = obj.substitute;
            this.substitute();
        }
    };

})();
