var fsGulp = require('../index');

var app = {
    name:'爱搜酷',
    enName:'Aisocool',
    auther:'夜影森林',
    version:'1.0',
    homepage:'http://www.aisocool.com/',
    description:'爱搜酷'
};

fsGulp.createTask('clean', 'clean', {
    src: ['access/*', 'web/*']
});


fsGulp.createTask('ejs', 'ejs', {
    src: '*.ejs',
    build: 'access',
    config: app
});


// 直接按commonjs方式生成
fsGulp.createTask('bjs', 'browserify', {
    src: 'browserify/*.js',
    build: 'access',
    name: 'bb.js', // 如果 没有名字将不会合并
    config: app,
    //browserify:{},
    banner: ['/**',
        ' * <%= name %> - <%= description %>',
        ' * @link <%= homepage %>',
        ' * @auther <%= auther %>',
        ' */',
        'window.isDebug = <%= isPorduction %>;',
        ''].join('\n')
});



fsGulp.createTask('jsx', 'jsx', {
    src: '*.js',
    build: 'web',
    name: 'm.js', // 如果 没有名字将不会合并
    config: app,
    banner: ['/**',
        ' * <%= name %> - <%= description %>',
        ' * @link <%= homepage %>',
        ' * @auther <%= auther %>',
        ' */',
        'window.isDebug = <%= isPorduction %>;',
        ''].join('\n')
});

fsGulp.createTask('html', 'html', {
    src: 'access/*.html',
    build: 'web',
    inject: {
        src:'*.js',
        // 用于替换生成路径
        transform:{
            '.*\/(gulpfile\..*)':'../$1.js',
            '(.*)':'$1?v=' + Date.now()
        }
    }
});


fsGulp.createTask('sass', 'sass', {
    src: './style/*',
    css: './access',
    sass: './style'
});

fsGulp.createTask('css', 'css', {
    src: './access/*.css',
    build: './web',
    name: 'm.css' // 如果 没有名字将不会合并
});

fsGulp.createTask('copy', 'copy', {
    src: '*.ejs',
    build: 'access'
});

fsGulp.createTask('livereload', 'livereload', {
    src: './'
});

fsGulp.createTask('watch', 'watch', {
    src: './style/*',
    tasks:['sass', 'css']
});



fsGulp.concatTask('default', [
    'env-p', 'clean',
    'ejs', 'sass', 'css', 'jsx', 'html',
    'copy', 'livereload', 'watch'
]);


// =====================================
/*
 * 调用说明
 // 本地调试使用，只打包不压缩等
 gulp
 gulp d
 // 发布正式外网运行版本
 gulp p

 */

