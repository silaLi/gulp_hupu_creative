
// 项目配置文件
var config_json = "./config/jiadele.json";
console.log(config_json)
var config = require(config_json);


var path = require("path");
var gulp = require("gulp");
var data = require("gulp-data");

var fm = require('front-matter');
var changed = require('gulp-changed');
var gulpif = require('gulp-if');

var sass = require("gulp-sass");
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var concat = require("gulp-concat");
var filter = require('gulp-filter');

var autoprefixer = require('autoprefixer')
var cssnext = require('cssnext')
var precss = require('precss')
var htmlmin = require('gulp-htmlmin');
var cssminify =require('gulp-minify-css')
var uglify = require('gulp-uglify')
var sftp = require('gulp-sftp');

var $HTML_loader = require('./$html-loader.js')
var $CSS_loader = require('./$css-loader.js')

var processors = [
    autoprefixer({
        browsers: ["IE > 8", "Opera > 11", "Firefox > 14", "safari > 5", "Chrome > 30"]
    }),
    cssnext,
    precss
]

// 构建 html
gulp.task('html-loader', function(){
    if (!config.html_loader) {
        return 'no html'
    }
    return gulp.src(config.html_loader.input)
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: function(text, inline){
                console.log(text, inline)
                return '';
            }
        }))
        .pipe($HTML_loader())
        .pipe(rename(config.html_loader.name))
        .pipe(gulp.dest(config.html_loader.output));
})
// 构建 scss
gulp.task("scss", [], function() {
    if (!config.scss) {
        return 'no scss'
    }
    return gulp.src(config.scss.input)
        // .pipe(changed(config.scss.output))
        // `ngAnnotate` will only get the files that 
        // changed since the last time it was run 
        .pipe(plumber())
        .pipe(sass({
            outputStyle: "compressed" // expanded: 手写css样式, expanded: 一个css选择一行, compressed: 压缩
        }))
        .on('error', sass.logError)
        .pipe(postcss(processors))
        .pipe(cssminify())
        .pipe(rename(function(path) {
            path.basename += '.scss';
            path.extname = ".css"
        }))
        .pipe(gulp.dest(config.scss.cssoutput))
        .pipe($CSS_loader())
        .pipe(concat(config.scss.name))
        .pipe(gulp.dest(config.scss.output))
});
// 发布css html js 到一个js文件中
gulp.task('dest', function(){
    return gulp.src([
            path.resolve(__dirname, 'component/Container_.js'), 
            path.resolve(__dirname, 'component/Container_compoent.js'), // 常用工具集
            path.resolve(__dirname, 'component/Container_html_loader.js'),
            config.dest.input
        ])
        .pipe(plumber())
        // .pipe(uglify())
        .pipe(concat(config.dest.name))
        .pipe(gulp.dest(config.dest.output))
        .pipe(gulpif(config.ftp.open, sftp({
            user: config.ftp.user,
            password: config.ftp.password,
            host: config.ftp.host,
            port: config.ftp.port,
            remotePath: config.ftp.remotePath
        })));
});
gulp.task('run', function(){
    // 构建html
    gulp.watch(config.html_loader.input, ['html-loader'])
    // 构建scss
    gulp.watch(config.scss.input, ['scss'])
    // 构建scss
    gulp.watch(config.dest.input, ['dest'])
})
