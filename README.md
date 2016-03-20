# fixedstar-gulp

这是一个让新手简单上手 gulp 打包的轻量封装。

## gulp.js
```javascript
"use strict";

var fsGulp = require('fixedstar-gulp');
var autoprefixer = require('gulp-autoprefixer');


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

```

## gulpfile.js
```javascript
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

```

```javascript
{
  "dependencies": {},
  "devDependencies": {
    "async": "^0.9.0",
    "browserify-shim": "^3.8.12",
    "fixedstar-gulp": "0.0.9",
    "gulp": "^3.8.11",
    "gulp-autoprefixer": "^2.2.0",
    "gulp-browserify": "^0.5.1",
    "gulp-cache": "^0.2.9",
    "gulp-changed": "^1.2.1",
    "gulp-clean": "^0.3.1",
    "gulp-compass": "^2.0.4",
    "gulp-concat": "^2.5.2",
    "gulp-ejs": "^1.1.0",
    "gulp-header": "^1.2.2",
    "gulp-if": "^1.2.5",
    "gulp-imagemin": "^2.2.1",
    "gulp-inject": "^1.2.0",
    "gulp-jshint": "^1.10.0",
    "gulp-livereload": "^3.8.0",
    "gulp-minify-css": "^1.1.1",
    "gulp-minify-html": "^1.0.2",
    "gulp-notify": "^2.2.0",
    "gulp-react": "^3.1.0",
    "gulp-rename": "^1.2.2",
    "gulp-rev": "^3.0.1",
    "gulp-sass": "^2.0.1",
    "gulp-sourcemaps": "^1.5.2",
    "gulp-uglify": "^1.2.0",
    "gulp-util": "^3.0.4",
    "jasmine-core": "^2.4.1",
    "jsdom": "^8.0.4",
    "karma": "^0.13.21",
    "karma-chrome-launcher": "^0.2.2",
    "karma-jasmine": "^0.3.7",
    "react": "^0.13.3",
    "react-addons-test-utils": "^0.14.7",
    "react-dom": "^0.14.7",
    "react-router": "^0.13.3",
    "reactify": "^1.1.1"
  }
}

```