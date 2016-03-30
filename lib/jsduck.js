/**
 * Created by 夜影 on 2015/5/17.
 */

var gulp = require('gulp'),
    tool = require('./tool.js'),
	GJSDuck = require("gulp-jsduck");


module.exports = function (config, name, opt) {

    var src = opt.src;
    var build = opt.build;
	var gjsduck = new GJSDuck(["--out", build]);

	gulp.task(name, function() {
		return gulp.src(src)
			.pipe(gjsduck.doc());
	});
};