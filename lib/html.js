/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    iif = require('gulp-if'),
    ejs = require('gulp-ejs'),
    minifyhtml = require('gulp-minify-html'),
    inject = require('gulp-inject');

module.exports = function (config, name, opt) {

    gulp.task(name, function() {
        var sources, injectOpt;
        if( opt.inject && opt.inject.src ) {
            var transforms, urls;
            if( opt.inject.transform ) {
                transforms = [];
                urls = [];
                var key, item, ary = Object.keys(opt.inject.transform);
                for (var i = 0; i < ary.length; i++) {
                    key = ary[i];
                    item = opt.inject.transform[key];
                    transforms.push(new RegExp(key));
                    urls.push(item);
                }
            }
            sources = gulp.src(opt.inject.src, {read: false});
            injectOpt = {relative: true};
            if( transforms && transforms.length>0 ) {
                injectOpt.transform = function (filepath) {
                    var url = filepath;
                    for (var i = 0; i < transforms.length; i++) {
                        var r = transforms[i];
                        if( r.test(url) ) {
                            url = url.replace(r, urls[i]);
                            //console.log(r, url, filepath);
                        }
                    }
                    return '<script src="' + url + '"></script>';
                    //return inject.transform.apply(inject.transform, arguments);
                };
            }
        }
        var isPorduction = opt.isPorduction===undefined?config.isPorduction:opt.isPorduction;
        var injectRet = sources?inject(sources, injectOpt):notify('no inject!');
        return gulp.src(opt.src)
            .pipe(injectRet)
            .pipe(iif(isPorduction, minifyhtml()))
            .pipe(gulp.dest(opt.build))
    });

};
