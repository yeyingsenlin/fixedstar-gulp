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
	return function (name, cfg, root, web) {

		var isGlobal = !!root;

		var path = {
			root: root || './',
			web: web || './build/web/',
		};

		var config = fsGulp.tool.merge({}, cfg);
		fsGulp.tool.merge(config, {
			// 这里root给ejs用，有root要按真实发布的路径结构，没有root说明是在场景内部生成
			root: isGlobal ? '../assets/' : '../../../../build/assets/',
			name: name,
			auther: '夜影森林',
			homepage: 'http://www.aisocool.com/',
			description: 'aisocool'
		});

		var perfix = config.name + '-context-';

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
				path.root + '../../view_modules/pages/**/*',
				path.root + '../../views/pages/**/*.ejs'
			],
			tasks: [perfix + 'ejs', perfix + 'html', perfix + 'livereload']
		});

		fsGulp.createTask(perfix + 'watch-css', 'watch', {
			src: [
				path.root + 'views/styles/**/*',
				path.root + '../../view_modules/styles/**/*',
				path.root + '../../views/styles/**/*'
			],
			tasks: [perfix + 'sass', perfix + 'css', perfix + 'livereload']
		});

		fsGulp.createTask(perfix + 'watch-js', 'watch', {
			src: [
				'!' + path.root + '{gulpfile,gulp}.js',
				path.root + '*',
				path.root + 'datas/**/*',
				path.root + 'roles/**/*',
				path.root + 'views/scripts/**/*',
				path.root + '../../view_modules/scripts/**/*',
				path.root + '../../views/scripts/**/*',
				path.root + '../../datas/**/*',
				path.root + '../../roles/**/*'
			],
			tasks: [perfix + 'js', perfix + 'html', perfix + 'livereload']
		});

		fsGulp.createTask(perfix + 'watch-assets', 'watch', {
			src: path.root + 'views/assets/**/*',
			tasks: [perfix + 'copy']
		});

		//----------------------------------------------------

		var taskAry = ['sass', 'js', 'css', 'copy', 'ejs', 'html'];
		var wtaskAry = ['watch-html', 'watch-css', 'watch-js', 'watch-assets'];

		taskAry.map(function (value, index, array) {
			return array[index] = perfix + value;
		});
		wtaskAry.map(function (value, index, array) {
			return array[index] = perfix + value;
		});


		fsGulp.concatTask(config.name, ['env-d', perfix + 'clean'].concat(taskAry));

		fsGulp.concatTask(config.name + '-p', ['env-p', perfix + 'clean'].concat(taskAry));

		fsGulp.concatTask(config.name + '-w', ['env-d', perfix + 'clean'].concat(taskAry, wtaskAry));

		fsGulp.concatTask(config.name + '-pw', ['env-p', perfix + 'clean'].concat(taskAry, wtaskAry));

		// isGlobal use
		return taskAry;

	};
}

module.exports = gulpContext;