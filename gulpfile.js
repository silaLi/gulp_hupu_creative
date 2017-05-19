
// 项目配置文件
var config_json = "./config/fcbayern-miniset-active-list.json";
console.log(config_json)
var config = require(config_json);

var componentConfigDir = config.config;

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var data = require("gulp-data");

var fm = require('front-matter');
var changed = require('gulp-changed');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var logger = require('gulp-logger');
var colors = require( "colors")

var sass = require("gulp-sass");
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var concat = require("gulp-concat");
var filter = require('gulp-filter');
var savefile = require('./gulp-save.js');

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
componentConfigFiles = fs.readdirSync(componentConfigDir);
componentConfigFiles.forEach(function(componentFile){
    if (/\.config\.js$/.test(componentFile)) {
        readComponent(path.resolve(componentConfigDir, componentFile));
    }
})

function readComponent(configFile){
    var config = require(configFile)
    makeGulpTask(path.dirname(configFile), config)
}

function makeGulpTask(pathNameSpace, component){
    var cssTaskName = component.name + '__css';
    var htmlTaskName = component.name + '__html';
    var destTaskName = component.name + '__dest';

    var cssSourcesList = component.css.map(function(cssSources){
        return path.resolve(pathNameSpace, cssSources);
    });
    var htmlSourcesList = component.html.map(function(htmlSources){
        return path.resolve(pathNameSpace, htmlSources);
    });
    var jsSourcesList = component.js.map(function(jsSources){
        return path.resolve(pathNameSpace, jsSources);
    });
    
    var tempFileList = {};

    
    var destSourcesList = [
        path.resolve(__dirname, 'component/Container_.js'), 
        path.resolve(__dirname, 'component/Container_compoent.js'), // 常用工具集
        path.resolve(__dirname, 'component/Container_html_loader.js'),
    ].concat(jsSourcesList);

    gulp.task(cssTaskName, function(){
        console.log('['+getDateTimestampFromate()+'] ' + cssTaskName.green + ' run...')
        runTaskCss(cssSourcesList)
        .on('data', function(file){
            if (tempFileList[file.path] == undefined) {
                destSourcesList.push(file.path)
                tempFileList[file.path] = destSourcesList.length - 1;
            }
            runTaskDest(destSourcesList);
        })
    });
    gulp.task(htmlTaskName, function(){
        console.log('['+getDateTimestampFromate()+'] ' + htmlTaskName.green + ' run...')
        runTaskHtml(htmlSourcesList)
        .on('data', function(file){
            if (tempFileList[file.path] == undefined) {
                destSourcesList.push(file.path)
                tempFileList[file.path] = destSourcesList.length - 1;
            }
            runTaskDest(destSourcesList);
        })
    })

    gulp.task(destTaskName, function(){
        console.log('['+getDateTimestampFromate()+'] ' + destTaskName.green + ' run...')
        runTaskDest(destSourcesList);
    })
    
    // 注册文件监听任务
    gulp.watch(cssSourcesList, [cssTaskName]);
    gulp.watch(htmlSourcesList, [htmlTaskName]);
    gulp.watch(destSourcesList, [destTaskName]);
    
    // 默认启动时自动编译一次
    gulp.start(cssTaskName, htmlTaskName);
    
    // 执行html编译任务
    function runTaskCss(cssSourcesList){
        return gulp.src(cssSourcesList)
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
            .pipe(savefile())
            .pipe($CSS_loader())
            .pipe(rename(function(path) {
                path.basename = 'css_' + path.basename
                path.extname = '.js'
            }))
            .pipe(savefile({baseDir: path.resolve(pathNameSpace, component.tempDir)}))
    }
    //  执行html编译任务
    function runTaskHtml(htmlSourcesList){
        return gulp.src(htmlSourcesList)
            .pipe(htmlmin({
                collapseWhitespace: true
            }))
            .pipe($HTML_loader())
            .pipe(rename(function(path) {
                path.basename = 'html_' + path.basename
                path.extname = '.js'
            }))
            .pipe(savefile({baseDir: path.resolve(pathNameSpace, component.tempDir)}))
    }
    //  执行发布任务
    function runTaskDest(destSourcesList) {
        gulp.src(destSourcesList)
            .pipe(plumber())
            // .pipe(uglify())
            .pipe(concat('__' + component.name + '.js'))
            .pipe(gulp.dest(path.resolve(pathNameSpace, '../start/')))
            .pipe(gulpif(config.ftp.open, sftp({
                user: config.ftp.user,
                password: config.ftp.password,
                host: config.ftp.host,
                port: config.ftp.port,
                remotePath: config.ftp.remotePath
            })));
    }
}


function getDateTimestampFromate(date){
    date = date || new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}
