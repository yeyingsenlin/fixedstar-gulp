/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    compass = require('gulp-compass'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify');

module.exports = function (config, name, opt) {

    var src = opt.src;
    var css = opt.css;
    var sass = opt.sass;

    gulp.task(name, function() {
        return gulp.src(src)
            .pipe(compass({css: css,sass: sass})).on('error', function(error) {
                console.log(error);
                this.emit('end');
            })
    });

};