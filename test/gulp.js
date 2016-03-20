"use strict";

//var fsGulp = require('fixedstar-gulp');
var fsGulp = require('/Users/leon/work/fixedstar/fixedstar-gulp/index');
var autoprefixer = require('gulp-autoprefixer');

/**
 * 函数名
 *
 * @param name:string             需要生成的场景模块名称
 * @param root:string             发布后的根目录路径，主要用于加载模块外的共用文件
 *
 */
module.exports = function (name, cfg, root, web) {

	var isGlobal = !!root;

	var path = {
		root: root || './',
		web: web || './bulid/web/',
	};

	var config = fsGulp.tool.merge({}, cfg);
	fsGulp.tool.merge(config, {
		// 这里root给ejs用，有root要按真实发布的路径结构，没有root说明是在场景内部生成
		root: isGlobal ? '../..' : '../../../../build/assets',
		name: name,
		auther:'夜影森林',
		homepage:'http://www.aisocool.com/',
		description:'aisocool'
	});

	var perfix = config.name + '-context-';

	//----------------------------------------------------

	fsGulp.createTask(perfix + 'clean', 'clean', {
		src: path.root + 'build'
	});

	//----------------------------------------------------

	fsGulp.createTask(perfix + 'js', 'browserify', {
		src: [
			'!' + path.root + '{gulpfile,gulp}.js',
			path.root + '*.{js,jsx}',
		],
		build: path.web + 'js',
		//name: '',
		config: config,
		banner: ['/**',
			' * <%= name %> - <%= description %>',
			' * @link <%= homepage %>',
			' * @auther <%= auther %>',
			' */',
			'window.isDebug = <%= !isPorduction %>;',
			''].join('\n')
	});

	//----------------------------------------------------

	fsGulp.createTask(perfix + 'ejs', 'ejs', {
		src: [
			path.root + 'views/pages/*.ejs',
		],
		build: path.web,
		config: config
	});

	fsGulp.createTask(perfix + 'html', 'html', {
		src: path.web + '*.html',
		build: path.web,
		inject: {
			src:[
				path.web + 'js/*.js',
				path.web + 'css/*.css'
			]
		}
	});

	//----------------------------------------------------

	fsGulp.createTask(perfix + 'sass', 'sass', {
	    src: path.root + 'views/styles/*.scss',
	    css: path.root + 'build/css',
	    sass: path.root + 'views/styles'
	});

	fsGulp.createTask(perfix + 'css', 'css', {
	    src: path.root + 'build/css/*.css',
	    build: path.web + 'css',
	    //name: 'm.css'
	});

	//----------------------------------------------------

	fsGulp.createTask(perfix + 'copy', 'copy', {
	    src: [
		    path.root + 'views/resources/**/*'
	    ],
	    build: path.web + 'resources'
	});

	//----------------------------------------------------


	fsGulp.createTask(perfix + 'livereload-html', 'livereload', {
		src: [
			path.web + '*.html'
		]
	});

	fsGulp.createTask(perfix + 'watch-livereload-html', 'watch', {
		src: [
			path.web + '*.html'
		],
		tasks:[perfix + 'livereload-html']
	});

	fsGulp.createTask(perfix + 'livereload-css', 'livereload', {
		src: [
			path.web + 'css/*.css'
		]
	});

	fsGulp.createTask(perfix + 'watch-livereload-css', 'watch', {
		src: [
			path.web + 'css/*.css'
		],
		tasks:[perfix + 'livereload-css']
	});

	fsGulp.createTask(perfix + 'livereload-js', 'livereload', {
		src: [
			path.web + 'js/*.js'
		]
	});

	fsGulp.createTask(perfix + 'watch-livereload-js', 'watch', {
		src: [
			path.web + 'js/*.js'
		],
		tasks:[perfix + 'livereload-js']
	});

	//----------------------------------------------------

	fsGulp.createTask(perfix + 'watch-html', 'watch', {
	    src: path.root + 'views/pages/*.ejs',
	    tasks:[perfix + 'ejs', perfix + 'html']
	});

	fsGulp.createTask(perfix + 'watch-css', 'watch', {
	    src: path.root + 'views/styles/*',
	    tasks:[perfix + 'sass', perfix + 'css']
	});

	fsGulp.createTask(perfix + 'watch-js', 'watch', {
	    src: [
		    '!' + path.root + '{gulpfile,gulp}.js',
		    path.root + '*.{js,jsx}',
		    path.root + 'views/scripts/*.{js,jsx}',
	    ],
	    tasks:[perfix + 'js', perfix + 'html']
	});

	fsGulp.createTask(perfix + 'watch-resources', 'watch', {
	    src: path.root + 'views/resources/**/*',
	    tasks:[perfix + 'copy']
	});

	//----------------------------------------------------

	var taskAry = ['js', 'sass', 'css', 'copy', 'ejs', 'html'];
	var wtaskAry = ['watch-html', 'watch-css', 'watch-js', 'watch-resources',
		'watch-livereload-html', 'watch-livereload-css', 'watch-livereload-js'];

	taskAry.map(function (value, index, array) {return array[index] = perfix + value;});
	wtaskAry.map(function (value, index, array) {return array[index] = perfix + value;});



	fsGulp.concatTask(config.name, ['env-d', perfix + 'clean'].concat(taskAry));

	fsGulp.concatTask(config.name + '-p', ['env-p', perfix + 'clean'].concat(taskAry));

	fsGulp.concatTask(config.name + '-w', ['env-d', perfix + 'clean'].concat(taskAry, wtaskAry));

	fsGulp.concatTask(config.name + '-pw', ['env-p', perfix + 'clean'].concat(taskAry, wtaskAry));

	// isGlobal use
	return taskAry;

};
