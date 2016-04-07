/**
 * Created by 夜影 on 2015/5/17.
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    tool = require('./lib/tool.js'),
    env = require('./lib/env.js'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    tasks = {
        ejs:require('./lib/ejs.js'),
        html:require('./lib/html.js'),
        sass:require('./lib/sass.js'),
        css:require('./lib/css.js'),
        browserify:require('./lib/browserify.js'),
        js:require('./lib/js.js'),
        jsx:require('./lib/jsx.js'),
        jsduck:require('./lib/jsduck.js'),
        copy:require('./lib/copy.js'),
        clean:require('./lib/clean.js'),
        watch:require('./lib/watch.js'),
        livereload:require('./lib/livereload.js') // 自动刷新页面的
    };

// 内置任务：使用 gulp-livereload 侦听 watch ，让页面内容自动刷新
gulp.task('listen_watch', function () {
    livereload.listen();
});

// 内置任务：在完成时通知
gulp.task('complete_notify', function() {
    return gulp.src('./', {read: false})
        .pipe(notify({ message: tool.formatDate(Date.now()) + ' gulp task complete.' }))
});

// 默认设置生成模式
var config = {
    isPorduction:false
};
// 初始化生成模式任务
env(config);

// 已注册任务名称，防止重名
var regTasks = {
    'env-d':'env-d',
    'env-p':'env-p',
    'complete_notify':'complete_notify',
    'listen_watch':'listen_watch'
};

var fsGulp = {
    tool:tool,
    /**
     * 创建任务
     *
     * @param name:string             任务名称
     * @param type:string             生成类型
     * @param opt:object             参数
     *
     */
    createTask : function (name, type, opt) {
        if( regTasks[name] ) {
            console.error(name, '任务已存在！');
            return ;
        }
        var task = tasks[type];
        if( !task ) {
            console.error(type, '任务类型不存在！');
            return ;
        }
        task(config, name, opt);
        regTasks[name] = type;
    },
    /**
     * 连接任务
     *
     * @param name:string             任务名称
     * @param ary:array             任务队列
     *
     */
    concatTask : function (name, ary) {
        regTasks[name] = 1;
        var isWatch = false;
        var isLivereload = false;
        var isNotify = false;
        for (var i = 0; i < ary.length; i++) {
            var type = regTasks[ary[i]];
            if( type=='watch' ) {
                if( !isNotify ) {
                    isNotify = true;
                    i==0 ? ary.unshift('complete_notify') : ary.splice(i-1, 0, 'complete_notify');
                    i++;
                }
                isWatch = true;
            } else if( type=='livereload' ) {
                isLivereload = true;
            }
        }
        if( isWatch ) ary.unshift('listen_watch');
        var allTask = tool.asyncTask(ary);
        gulp.task(name, allTask);
    }
};


module.exports = fsGulp;