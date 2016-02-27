/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    notify = require('gulp-notify');


module.exports = function (config, name, opt) {

    gulp.task(name, function() {
        return gulp.src(opt.src)
            .pipe(gulp.dest(opt.build))
    });
};
