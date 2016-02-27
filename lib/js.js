/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    tool = require('./tool.js'),
    gutil = require('gulp-util'),
    changed = require('gulp-changed'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    iif = require('gulp-if'),
    rev = require('gulp-rev'),
    sourcemaps = require('gulp-sourcemaps'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');



module.exports = function (config, name, opt) {

    var src = opt.src;
    var build = opt.build;
    var concatName = opt.name || '';
    var banner = opt.banner || '';
    var bannerConfig = opt.config || {};
    bannerConfig = tool.merge(config, bannerConfig);
    var suffix = opt.suffix || '.min';

    gulp.task(name, function() {
        var isPorduction = opt.isPorduction===undefined?config.isPorduction:opt.isPorduction;
        return gulp.src(src)
            .pipe(iif(!isPorduction, sourcemaps.init()))
            //.pipe(jshint('.jshintrc'))
            //.pipe(jshint())
            //.pipe(jshint.reporter('default'))
            .pipe(iif(concatName.length>0, concat(concatName)))
            .pipe(iif(isPorduction, rename({ suffix: suffix})))
            .pipe(iif(isPorduction, uglify()))
            .pipe(iif(banner.length>0, header(banner, bannerConfig)))
            //.pipe(iif(isPorduction, rev()))
            .pipe(iif(!isPorduction, sourcemaps.write('./')), iif(!isPorduction, {addComment: false}, undefined))
            .pipe(gulp.dest(build));
            //.pipe(iif(isPorduction && !noVer, rev.manifest(name + '.json')))
            //.pipe(iif(isPorduction && revSrc, gulp.dest(revSrc)))
    });

};