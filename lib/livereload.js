/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    livereload = require('gulp-livereload');

module.exports = function (config, name, opt) {

    var src = opt.src;

    gulp.task(name, function() {
        //livereload.listen();
        return gulp.src(src, {read: false})
            .pipe(livereload())
    });

};