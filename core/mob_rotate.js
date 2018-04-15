/**
 * Created by fenglz on 2017/4/23.
 */
(function() {
    'use strict';
    var _win = window,
        flz = _win.fengluzhe = _win.fengluzhe || {};

    if (flz.mob_rotate) {
        return;
    }
    var horizontal = false;
    function _h_or_w() {
        if (_win.orientation) {
            var orientation = _win.orientation;
            switch (orientation) {
                case 90:
                    horizontal = true;
                    break;
                case -90:
                    horizontal = true;
                    break;
                default:
                    horizontal = false;
                    break;
            }
        } else {
            horizontal = (_win.innerWidth > _win.innerHeight) ? true : false;
        }
    };
    flz.mob_rotate = {
        init: function(obj) {
            _h_or_w();
            obj.fn(horizontal);
            _win.addEventListener("orientationchange" in _win ? "orientationchange" : "resize", function() {
                _h_or_w();
                obj.fn(horizontal);
            });
        }
    };

})();
