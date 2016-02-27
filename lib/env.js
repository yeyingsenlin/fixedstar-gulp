/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    gutil = require('gulp-util');

module.exports = function (config) {

    var env = function (isPorduction) {
        return function () {
            gutil.env.type = isPorduction?'production':'development';
            config.isPorduction = isPorduction;
            console.info(
                '\n********************************\n',
                'gulp start : ', gutil.env.type,
                '\n********************************\n'
            );
            gulp.src('./', {read: false})
                .pipe(notify({ message:'gulp start : [ ' + gutil.env.type + ']' }))
        };
    };
    gulp.task('env-p', env(true));
    gulp.task('env-d', env(false));

};