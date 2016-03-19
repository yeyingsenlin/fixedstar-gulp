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
    uglify = require('gulp-uglify'),
    react = require('gulp-react'),
    browserify = require('gulp-browserify');



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
        var bOpt = tool.merge({
            debug: isPorduction, // 开发模式将输出 source map
            //insertGlobals : true, // 这里打开后，react模块用不用都会加载进去
            transform: ['reactify'],
            extensions: ['.jsx']// 扩展如 ['.jsx', '.coffee']
            //ignore:[], // 忽略 ['ignore.js']
            //shim: { // 不兼容CommonJS的JavaScript模块（如插件）也能为Browserify所用  https://segmentfault.com/a/1190000002941361#articleHeader15
            //    angular: {
            //        path: '/vendor/angular/angular.js',
            //        exports: 'angular'
            //    },
            //    'angular-route': {
            //        path: '/vendor/angular-route/angular-route.js',
            //        exports: 'ngRoute',
            //        depends: {
            //            angular: 'angular'
            //        }
            //    }
            //}
        }, opt.browserify);
        return gulp.src(src)
            .pipe(iif(!isPorduction, sourcemaps.init()))
            //.pipe(jshint('.jshintrc'))
            //.pipe(jshint())
            //.pipe(jshint.reporter('default'))
            .pipe(browserify(bOpt))
            .pipe(iif(concatName.length>0, concat(concatName.length>0?concatName:'x')))
            .pipe(iif(isPorduction, rename({ suffix: suffix })))
            .pipe(iif(isPorduction, uglify()))
            .pipe(iif(banner.length>0, header(banner, bannerConfig)))
            //.pipe(iif(isPorduction, rev()))
            .pipe(iif(!isPorduction, sourcemaps.write('./')), iif(!isPorduction, {addComment: false}, undefined))
            .pipe(gulp.dest(build));
            //.pipe(iif(isPorduction && !noVer, rev.manifest(name + '.json')))
            //.pipe(iif(isPorduction && revSrc, gulp.dest(revSrc)))
    });

};