"use strict";

//var fsGulp = require('./index');

function gulpContext(fsGulp) {

	/**
	 * 函数名
	 *
	 * @param name:string             需要生成的场景模块名称
	 * @param root:string             发布后的根目录路径，主要用于加载模块外的共用文件
	 *
	 */
	function createContextTask(name, cfg, root, web) {

		var path = {
			root: root || './',
			web: web || './build/web/'
		};

		var config = fsGulp.tool.merge({
			name: name,
			auther: '夜影森林',
			homepage: 'http://www.aisocool.com/',
			description: 'aisocool'
		}, cfg);

		var perfix = name + '-context-';

		//----------------------------------------------------

		fsGulp.createTask(perfix + 'clean', 'clean', {
			src: [
				path.root + 'build'
			]
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
				src: [
					path.web + 'js/*.js',
					path.web + 'css/*.css'
				]
			}
		});

		//----------------------------------------------------

		fsGulp.createTask(perfix + 'sass', 'sass', {
			src: path.root + 'views/styles/screen.scss',
			css: path.root + 'build/css',
			sass: path.root + 'views/styles'
		});

		fsGulp.createTask(perfix + 'css', 'css', {
			src: path.root + 'build/css/*.css',
			build: path.web + 'css',
			name: 'm.css'
		});

		//----------------------------------------------------

		fsGulp.createTask(perfix + 'copy', 'copy', {
			src: [
				path.root + 'views/assets/**/*'
			],
			build: path.web + 'assets'
		});

		//----------------------------------------------------


		fsGulp.createTask(perfix + 'livereload', 'livereload', {
			src: './'
		});

		//----------------------------------------------------

		fsGulp.createTask(perfix + 'watch-html', 'watch', {
			src: [
				path.root + 'views/pages/**/*.ejs',
				path.root + '../../vcrd_modules/views/pages/**/*',
				path.root + '../../views/pages/**/*.ejs'
			],
			tasks: [perfix + 'ejs', perfix + 'html', perfix + 'livereload']
		});

		fsGulp.createTask(perfix + 'watch-css', 'watch', {
			src: [
				path.root + 'views/styles/**/*',
				path.root + '../../vcrd_modules/views/styles/**/*',
				path.root + '../../views/styles/**/*'
			],
			tasks: [perfix + 'sass', perfix + 'css', perfix + 'livereload']
		});

		fsGulp.createTask(perfix + 'watch-js', 'watch', {
			src: [
				'!' + path.root + '{gulpfile,gulp}.js',
				path.root + '*',
				path.root + '{contexts,datas,roles}/**/*',
				path.root + 'views/scripts/**/*',
				path.root + '../../vcrd_modules/{contexts,datas,roles}/**/*',
				path.root + '../../vcrd_modules/views/scripts/**/*',
				path.root + '../../{contexts,datas,roles}/**/*',
				path.root + '../../views/scripts/**/*',
				'!' + path.root + '../../{gulpfile,gulp}.js'
			],
			tasks: [perfix + 'js', perfix + 'html', perfix + 'livereload']
		});

		fsGulp.createTask(perfix + 'watch-assets', 'watch', {
			src: path.root + 'views/assets/**/*',
			tasks: [perfix + 'copy']
		});

		//----------------------------------------------------

		var taskAry = ['sass', 'js', 'css', 'copy', 'ejs', 'html'];
		var watchTaskAry = ['watch-html', 'watch-css', 'watch-js', 'watch-assets'];

		taskAry.map(function (value, index, array) {
			return array[index] = perfix + value;
		});
		watchTaskAry.map(function (value, index, array) {
			return array[index] = perfix + value;
		});


		fsGulp.concatTask(name, ['env-d', perfix + 'clean'].concat(taskAry));

		fsGulp.concatTask(name + '-p', ['env-p', perfix + 'clean'].concat(taskAry));

		fsGulp.concatTask(name + '-w', ['env-d', perfix + 'clean'].concat(taskAry, watchTaskAry));

		fsGulp.concatTask(name + '-pw', ['env-p', perfix + 'clean'].concat(taskAry, watchTaskAry));

		return {
			taskAry:taskAry,
			watchTaskAry:watchTaskAry
		};

	}

	// 收集所有场景的任务
	function createContextTasks(contexts, cfg, root, web) {
		if( !Array.isArray(contexts) ) return createContextTask(contexts, cfg, root, web);
		var name, ret, taskAry=[], watchTaskAry=[];
		for (var i = 0; i < contexts.length; i++ ) {
			name = contexts[i];
			ret = createContextTask(name, cfg, root + name + '/', web + name + '/');
			taskAry = taskAry.concat(ret.taskAry);
			watchTaskAry = watchTaskAry.concat(ret.watchTaskAry);
		}
		return {
			taskAry:taskAry,
			watchTaskAry:watchTaskAry
		};
	}

	return createContextTasks;
}

module.exports = gulpContext;