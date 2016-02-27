# fixedstar-gulp

这是一个让新手简单上手 gulp 打包的轻量封装。
```javascript
var fsGulp = require('fixedstar-gulp');

var path = {
    app:'app', // app壳项目根路径
    client:'client' // web客服端项目根路径
};

path.build = path.client + '/build'; // 编译资源根目录
path.app_build = path.app + '/web'; // 编译版本生成根目录


var app = {
    name:'aisocool',
    auther:'夜影森林',
    homepage:'http://www.aisocool.com/',
    description:'aisocool'
};

// 创建需要的各类型任务

fsGulp.createTask('clean-build', 'clean', {
    src: [
        path.app_build,
        path.build + '/rev'
    ]
});

fsGulp.createTask('clean-css', 'clean', {
    src: [
        path.build + '/assets/css'
    ]
});


fsGulp.createTask('ejs', 'ejs', {
    src: [
        path.client + '/src/pages/**/*.ejs',
        '!' + path.client + '/src/pages/templates/*.ejs'
    ],
    build: path.app_build,
    config: app
});

fsGulp.createTask('jsx', 'jsx', {
    src: [
        // CDRV frame
        path.client + '/packages/frame/*.js',
        path.client + '/packages/frame/**/*.js',
        path.client + '/packages/module/**/*.js',
        // UI React
        path.client + '/src/scripts/first.jsx',
        path.client + '/src/scripts/common/**/*.{js,jsx}',
        path.client + '/src/scripts/expand/error.js',
        path.client + '/src/scripts/expand/connect-config.js',
        path.client + '/src/scripts/expand/connect-test.js',
        path.client + '/src/scripts/expand/connect.js',
        path.client + '/src/scripts/expand/**/*.{js,jsx}',
        path.client + '/src/scripts/data/sys.js',
        path.client + '/src/scripts/data/**/*.{js,jsx}',
        path.client + '/src/scripts/component/**/*.{js,jsx}',
        path.client + '/src/scripts/layout/**/*.{js,jsx}',
        path.client + '/src/scripts/module/**/*.{js,jsx}',
        '!' + path.client + '/src/scripts/test/test.jsx',
        '!' + path.client + '/src/scripts/test/*.{js,jsx}',
        path.client + '/src/scripts/**/*.{js,jsx}',
        path.client + '/src/scripts/last.jsx',
        path.client + '/src/scripts/route/**/*.jsx'
    ],
    build: path.app_build + '/js',
    name: 'm.js',
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
    src: path.app_build + '/*.html',
    build: path.app_build,
    inject: {
        src:[
            path.app_build + '/js/m*.js',
            path.app_build + '/css/m*.css'
        ]
    }
});


fsGulp.createTask('sass', 'sass', {
    src: path.client + '/src/styles/*.scss',
    css: path.build + '/assets/css',
    sass: path.client + '/src/styles'
});

fsGulp.createTask('css', 'css', {
    src: path.build + '/assets/css/**/*.css',
    build: path.app_build + '/css',
    name: 'm.css'
});

fsGulp.createTask('copy-img', 'copy', {
    src: [
        path.build + '/assets/img/**/*'
    ],
    build: path.app_build + '/img'
});

fsGulp.createTask('copy-include', 'copy', {
    src: [
        path.build + '/assets/include/**/*'
    ],
    build: path.app_build + '/include'
});

fsGulp.createTask('copy-file', 'copy', {
    src: [
        path.build + '/assets/file/**/*'
    ],
    build: path.app_build + '/file'
});

fsGulp.createTask('livereload', 'livereload', {
    src: './'
});

fsGulp.createTask('watch-html', 'watch', {
    src: path.client + '/src/pages/**/*.ejs',
    tasks:['ejs', 'html']
});

fsGulp.createTask('watch-css', 'watch', {
    src: path.client + '/src/style/**/*',
    tasks:['sass', 'css']
});

fsGulp.createTask('watch-js', 'watch', {
    src: [
        // CDRV frame
        path.client + '/packages/**/*.js',
        // UI React
        path.client + '/src/scripts/**/*.jsx'
    ],
    tasks:['jsx']
});

// 连接组合任务

var taskAry = [
    'sass', 'css',
    'jsx',
    'copy-img', 'copy-include', 'copy-file',
    'ejs', 'html',
    'livereload', 'watch-html', 'watch-css', 'watch-js'
];

fsGulp.concatTask('all', ['env-d', 'clean-build', 'clean-css'].concat(taskAry));

fsGulp.concatTask('all-p', ['env-p', 'clean-build', 'clean-css'].concat(taskAry));

fsGulp.concatTask('default', ['env-d'].concat(taskAry));

fsGulp.concatTask('p', ['env-p'].concat(taskAry));
```

直接执行任务
```shell
$ gulp clean-build
```
执行连接组合任务
```shell
$ gulp
```
```shell
$ gulp p
```
```shell
$ gulp all
```
```shell
$ gulp all-p
```