/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    iif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css');

module.exports = function (config, name, opt) {

    var src = opt.src;
    var build = opt.build;
    var concatName = opt.name || '';

    gulp.task(name, function() {
        var isPorduction = opt.isPorduction===undefined?config.isPorduction:opt.isPorduction;
        return gulp.src(src)
            .pipe(iif(!isPorduction, sourcemaps.init()))
            .pipe(iif(concatName.length>0, concat(concatName)))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(iif(isPorduction, rename({ suffix: '.min' })))
            .pipe(iif(isPorduction, minifycss()))
            //.pipe(iif(isPorduction, rev()))
            .pipe(iif(!isPorduction, sourcemaps.write('./')), iif(!isPorduction, {addComment: false}, undefined))
            .pipe(gulp.dest(build));
            //.pipe(iif(isPorduction, rev.manifest(name + '.json')))
            //.pipe(iif(isPorduction, gulp.dest(revSrc)))
    });


};