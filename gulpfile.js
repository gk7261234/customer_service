/**
 * Created by GK on 2017/9/29.
 */
//添加引用
const gulp = require('gulp');
const  browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const nodemon = require("gulp-nodemon");

//gulp启动任务
gulp.task("node", function () {
  nodemon({
    script: './bin/www',
    ext: 'js marko',
    env: {
      'NODE_ENV': 'development'
    }
  })
});

//gulp 监控文件
gulp.task('server',["node"],function () {
  var file = [
    'views/**/*marko',
    'routes/**/*.js',
    'public/**/*.*'
  ];
  gulp.watch(file).on("change",reload);
})