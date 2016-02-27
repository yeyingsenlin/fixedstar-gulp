/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    tool = require('./tool.js'),
    notify = require('gulp-notify'),
    ejs = require('gulp-ejs'),
    gutil = require('gulp-util');

module.exports = function (config, name, opt) {

    var ejsConfig = opt.config || {};
    ejsConfig = tool.merge(config, ejsConfig);

    gulp.task(name, function() {
        return gulp.src(opt.src)
            .pipe(ejs(ejsConfig).on('error', gutil.log))
            .pipe(gulp.dest(opt.build))
    });

};
