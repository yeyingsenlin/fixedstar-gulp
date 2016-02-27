/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    tool = require('./tool.js');

module.exports = function (config, name, opt) {

    var src = opt.src;
    var tasks = opt.tasks;

    gulp.task(name, function() {
        gulp.watch(src, tool.asyncTask(tasks));

    });


};