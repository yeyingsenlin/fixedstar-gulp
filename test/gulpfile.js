"use strict";

var fsGulp = require('fixedstar-gulp');
var autoprefixer = require('gulp-autoprefixer');
var gulpContext = require('./gulp.js');

var web = './app/web/';
var config = {};

var path = {
	web: './app/web/',
	root: './client/contexts/'
};
//----------------------------------------------------

// 收集所有场景的任务
var contextAry = ['app', 'user'];
(function (cfg, path, contexts) {

	var root, web, name;
	for (var i = 0; i < contexts.length; i++ ) {
		name = contexts[i];
		root = path.root + name + '/';
		web = path.web + name + '/';
		contexts[i] = gulpContext(name, cfg, root, web);
	}

}(config, path, contextAry));
// 将得到的所有的任务合并到数组
var contextTaskAry = [];
contextAry.map(function (value){
	contextTaskAry = contextTaskAry.concat(value);
});

//----------------------------------------------------

fsGulp.createTask('clean', 'clean', {
	src: [
		path.web
	]
});

//----------------------------------------------------

fsGulp.createTask('copy', 'copy', {
	src: [
		'./client/build/assets*/**/*'
	],
	build: path.web
});

//----------------------------------------------------

var taskAry = [];

fsGulp.concatTask('default', ['env-d', 'clean', 'copy'].concat(taskAry, contextTaskAry));

fsGulp.concatTask('p', ['env-p', 'clean', 'copy'].concat(taskAry, contextTaskAry));