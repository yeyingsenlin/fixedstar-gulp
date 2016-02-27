/**
 * Created by 夜影 on 2015/5/17.
 */
var async = require('async'),
    gulp = require('gulp');

var tool = {};


tool.isObject = function (arg) {
    return typeof arg === 'object' && arg !== null;
};

tool.merge = function(origin, add) {
    if (!add || !tool.isObject(add)) return origin;

    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
        var key = keys[i];
        var o = origin[key];
        var v = add[key];
        if( tool.isObject(o) && tool.isObject(v) ) {
            var fn = arguments.callee;
            v = fn(o, v);
        }
        origin[key] = v;
    }
    return origin;
};


tool.asyncTask = function (ary, cb) {
    var fn = function (task) {
        return function (callback) {
            /*gulp.start(task, function () {
             setTimeout(callback, 1);
             });*/
            gulp.start(task, callback);
        };
    };
    var cbAry = [];
    for(var i=0; i<ary.length; i++) {
        cbAry.push(fn(ary[i]));
    }
    return function () {
        async.waterfall(cbAry, function (err) {
            if( cb ) return cb(err);
        });
    };
};

tool.formatDate = function (date, fmt) {
    if (!date) return null;
    if (!(date instanceof Date)) date = new Date(date);
    if (isNaN(date.getYear())) return null;
    fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
    var o = {
        'M+': date.getMonth() + 1,
        '[dD]+': date.getDate(),
        '[hH]+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        '[qQ]+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    };
    if (/(y+)/i.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
        var d = '' + o[k];
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? d : (('00' + d).substr(d.length)));
        }
    }
    return fmt;
};

if(typeof module=="object") module.exports = tool;

