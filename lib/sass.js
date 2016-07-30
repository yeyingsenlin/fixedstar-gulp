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
    var s = opt.sass;

	if( s ) {
		// compass 方式
		gulp.task(name, function() {
			return gulp.src(src)
				.pipe(compass({css: css,sass: s})).on('error', function(error) {
					console.log(error);
					this.emit('end');
				})
		});
	} else {
		// sass 方式
		gulp.task(name, function () {
			return gulp.src(src)
				.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
				.pipe(gulp.dest(css));
		});
	}

};
