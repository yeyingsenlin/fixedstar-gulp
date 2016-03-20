"use strict";

//var fsGulp = require('fixedstar-gulp');
var fsGulp = require('/Users/leon/work/fixedstar/fixedstar-gulp/index');
var autoprefixer = require('gulp-autoprefixer');
var gulpContext = require('./gulp.js');

// -------------------------------
// 在客户端app发布时注意：
// 1、H5+壳在使用资源包更新时，应用内restart重新开载，但新增加的文件结构没有被加载到；
// 2、强制关闭应用后，再次开启才能成功加载新增的文件；
// 3、问题应该是壳的BUG：在新资源加载进来时，可能是在壳内部有什么资源路径列表，但使用的是老的，没有更新到新文件路径；
// 解决：可以将需要加的代码先打包到已有文件中，如m.min.js中，然后把要加的文件加进去，空的也行占位，后面就可以更新到这个文件了；
// -------------------------------

var web = './app/web/';
var config = {};

var path = {
	web: './app/web/',
	root: './client/contexts/'
};
//----------------------------------------------------

// 收集所有场景的任务
var contextAry = ['app', 'meitu'];
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