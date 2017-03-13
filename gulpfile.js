/**
 * 自动化工具脚本 eco-cli v0.0.2
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var sass = require('gulp-ruby-sass');
var minifycss = require('gulp-minify-css');
var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs');
var spritesmith = require('gulp.spritesmith');
var child_process = require("child_process");
var template = require('gulp-template');
//动态刷新浏览器部分
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
//build静默打包部分
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

gulp.task('help', function(p) {
    console.log('gulp init -p  {projectName} [-n {pageName}]  项目初始化,可以用于目录初始化，-n是指定新增页面');
    console.log('gulp watch -p {projectName}  开发环境文件监控,包括样式，图片和精灵图片监听，子任务可单独使用');
    console.log('gulp build  -p {projectName} 生产环境打包js，压缩js,子任务可单独使用');
    console.log('gulp server  -p {projectName} [-n {pageName} -d ] 启动web服务并打开浏览器，有-n打开相应页面否则打开index.html,,如果不传-d打开src目录页面');
    console.log('gulp help    自动化工具参数说明');
});

//项目初始化 end
//eg1. gulp init -p mniya --g //如果有--g那么就是创建egame游戏
//eg2. gulp init -p mniya -n myPage --g//如果有--g那么就是创建egame游戏
gulp.task('init', function() {
    var templatePre = 'template';
    var g = argv.g;
    if(g) templatePre = 'template_egame';
    var files = [templatePre+"/**/*"];
    var projectName = argv.p;
    var pageName = argv.n;
    if (pageName != undefined) {
        files = [templatePre+'/src/index.html', templatePre+'/src/js/index.js', templatePre+'/src/scss/index.scss',templatePre+'/src/index.php']
    } else {
        pageName = 'index';
    }

    //如果对应的文件存在那么就什么也不做，防止对原来修改文件的破坏
    if(fs.existsSync('./'+projectName+"/src/"+pageName+".html")) return;

    gulp.src(files)
        .pipe(template({
            projectName: projectName,
            pageName: pageName
        }))
        .pipe(rename(function(path) {
            if (pageName == 'index') return;
            path.basename = pageName;
            //针对单独生成页面的处理
            if (path.extname == '.html'||path.extname == '.php') path.dirname = '/src';
            if (path.extname == '.js') path.dirname = '/src/js';
            if (path.extname == '.scss') path.dirname = '/src/scss';
        }))
        .pipe(gulp.dest('./' + projectName));
});

//开发环境文件监控 
//eg. gulp watch -p mniya
gulp.task('watch', function() {

    //监听样式
    gulp.start('wscss');

    //监听精灵图片，默认在images创建sprite目录，监听生成的样式和图片在images目录，你也可以添加sprite[1~4]文件夹创建更多精灵
    gulp.start('wsprite');

    //启动web服务
    gulp.start('server');
});

/******** watch任务的子任务 *********/
//监听样式编译压缩任务 
//eg. gulp wscss -p mniya
gulp.task('wscss', function() {
    var projectName = argv.p;
    //先编译压缩一遍
    compileSass(projectName, projectName + '/src/scss/*.scss');
    //监听压缩
    gulp.watch(projectName + '/src/scss/*.scss', function(event) {
        var type = event.type;
        var pathScss = event.path;
        var scssName = path.basename(pathScss);
        if (type == 'deleted') {
            fs.exists(projectName + '/src/css/' + scssName.replace('.scss', '.css'), function(exists) {
                // 已存在
                if (exists) {
                    fs.unlink(projectName + '/src/css/' + scssName.replace('.scss', '.css'));
                }
            });
            return;
        }
        compileSass(projectName, projectName + '/src/scss/' + scssName);
    });
});

function compileSass(projectName, path) {
         sass(path)
        .pipe(gulp.dest(projectName + '/src/css')).pipe(reload({stream: true}));
}

//监听sprite工具 
//eg. gulp wsprite -p mniya
gulp.task('wsprite', function() {
    var projectName = argv.p;
    //先压缩一遍
    spriteGernate(projectName, projectName + '/src/images/sprite/*.{png,jpg,gif}', "");
    spriteGernate(projectName, projectName + '/src/images/sprite1/*.{png,jpg,gif}', 1);
    spriteGernate(projectName, projectName + '/src/images/sprite2/*.{png,jpg,gif}', 2);
    spriteGernate(projectName, projectName + '/src/images/sprite3/*.{png,jpg,gif}', 3);
    spriteGernate(projectName, projectName + '/src/images/sprite4/*.{png,jpg,gif}', 4);

    gulp.watch(projectName+'/src/images/sprite/*', function(event) {
        spriteGernate(projectName, projectName + '/src/images/sprite/*.{png,jpg,gif}', "");
    });
    gulp.watch(projectName + '/src/images/sprite1/*', function(event) {
        spriteGernate(projectName, projectName + '/src/images/sprite1/*.{png,jpg,gif}', 1);
    });
    gulp.watch(projectName + '/src/images/sprite2/*', function(event) {
        spriteGernate(projectName, projectName + '/src/images/sprite2/*.{png,jpg,gif}', 2);
    });
    gulp.watch(projectName + '/src/images/sprite3/*', function(event) {
        spriteGernate(projectName, projectName + '/src/images/sprite3/*.{png,jpg,gif}', 3);
    });
    gulp.watch(projectName + '/src/images/sprite4/*', function(event) {
        spriteGernate(projectName, projectName + '/src/images/sprite4/*.{png,jpg,gif}', 4);
    });
});
function spriteGernate(projectName, path, i) {
    var spriteData = gulp.src(path).pipe(spritesmith({
        imgName: 'sprite' + i + '.png',
        cssName: 'sprite' + i + '.css',
        padding:10
    }));
    return spriteData.pipe(gulp.dest(projectName + '/src/images/'));
}


//用来标识构建任务进行的数目
var buildNum = 0;
var buildMax = 5;
function buildEndProcess(taskDes){
   console.log(taskDes+"完成");
   if(++buildNum==buildMax) console.log("构建结束");
}

//真实环境打包
//eg. gulp build -p mniya --o 是否打开页面
gulp.task('build', function() {
    buildNum = 0;
    //build启动静默模式
    if(!argv.o){ argv.s = true;}
    //图片压缩
    gulp.start('cpimage');

    //拷贝指定的文件夹，这里特指videos[视频]，audios[音频]
    gulp.start('cpfolders');
    
    //css压缩
    gulp.start('cpcss');

   //压缩js
    gulp.start('cpjs');

    //打包eco模块
    gulp.start('pkmodule');
});

/******** build任务的子任务 *********/
//图片压缩任务 
//eg. gulp cpimage -p mniya
gulp.task('cpimage', function() {
    var projectName = argv.p;
    //先压缩一遍
    gulp.src(projectName + '/src/images/**/*.{png,jpg,gif}')
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest(projectName + '/dist/images'));
    buildEndProcess("图片压缩");
});

//文件夹拷贝
//eg. gulp cpfolders -p mniya
gulp.task('cpfolders', function() {
    var projectName = argv.p;
    //复制videos文件夹
    var videosFolderExists = fs.existsSync(projectName + '/src/videos');
    if(videosFolderExists){
        gulp.src(projectName + '/src/videos/*')
            .pipe(gulp.dest(projectName + '/dist/videos'));
    }

    //复制audios文件夹
    var audiosFolderExists = fs.existsSync(projectName + '/src/audios');
    if(audiosFolderExists){
        gulp.src(projectName + '/src/audios/*')
            .pipe(gulp.dest(projectName + '/dist/audios'));
    }
    buildEndProcess("音频视频拷贝");
});


//样式压缩任务 
//eg. gulp cpcss -p mniya
gulp.task('cpcss', function() {
    var projectName = argv.p;
    //先压缩一遍
    gulp.src(projectName + '/src/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest(projectName + '/dist/css'));
    buildEndProcess("样式压缩");
});

//js压缩任务 
//eg. gulp cpjs -p mniya
gulp.task('cpjs', function() {
    var projectName = argv.p;
    compileJs(projectName,projectName + '/src/js/*.js');
});

function compileJs(projectName, path) {
    // 1. 找到文件
    gulp.src(path)
        // 2. 压缩文件
        .pipe(uglify())
        // 3. 文件重命名
        .pipe(rename({
            suffix: '.min'
        }))
        // 4. 另存压缩后的文件
        .pipe(gulp.dest(projectName + '/dist/js'));
    buildEndProcess("js压缩");
}

//打包eco模块
//eg. gulp pkmodule -p mniya
gulp.task('pkmodule',['server'],function() {
    var projectName = argv.p;
    var pageName = argv.n;
    if (!pageName) pageName = '*'
    //打开需要打包的链接
    var packageNum = 0;
    gulp.src(projectName + '/src/' + pageName + '.html')
            .pipe(rename(function(pathIn) {
                if (!packageNum) {
                    packageNum++;
                } else {
                    buildMax++
                };
                var url = "http://127.0.0.1:3000/" + projectName + "/src/" + pathIn.basename + ".html?pageName=" + pathIn.basename;
                var childArgs = [
                  path.join(__dirname, 'phantomjs-module-bundler.js'),
                  url
                ]
                child_process.execFile(binPath, childArgs, function(err, stdout, stderr) {
                  if(err){
                    console.error("Phantomjs script has error.")
                  }
                  if(stdout.indexOf("@@@")!=-1){
                       var start = stdout.indexOf("@@@");
                       var end = stdout.indexOf("@@!");
                       var settings = stdout.substring(start+3,end);
                       packgeEco(JSON.parse(settings), projectName);
                  }
                })
            }));
});

function packgeEco(config, projectName) {
    var pageName = config.pageName;
    var jss = config.js;
    var csss = config.css;
    if (jss) {
        jss = config.js.split(",");
        for (var i = 0; i < jss.length; i++) {
            jss[i] = jss[i].substring(6, jss[i].length);
        }
        var jssStr = "{" + jss.join(",") + "}";
        if (jss.length <= 1) {
            jssStr = jss.join(",");
        }
        gulp.src(jssStr)
            .pipe(uglify())
            .pipe(concat('package_' + pageName + '.min.js')) //合并后的文件名
            .pipe(gulp.dest(projectName + '/dist/js'));
    }

    if (csss) {
        csss = config.css.split(",");
        for (var i = 0; i < csss.length; i++) {
            csss[i] = csss[i].substring(6, csss[i].length);
        }
        var cssStr = "{" + csss.join(",") + "}";
        if (jss.length <= 1) {
            cssStr = csss.join(",");
        }
        gulp.src(cssStr)
            .pipe(minifycss())
            .pipe(concat('package_' + pageName + '.min.css')) //合并后的文件名
            .pipe(gulp.dest(projectName + '/dist/css'));
    }
    buildEndProcess("eco模块打包");
}


//启动服务器
//eg. gulp server -p mniya -n myPage --d --s 启动服务器，如果有--s那么静默启动服务器，--n服务器打开的默认主页，不传就是index.html,如果不传--d打开src目录页面
gulp.task('server', function() {
    var projectName = argv.p;
    var pageName = argv.n;
    var dist = argv.d;
    var catalog = 'src';
    if(dist) catalog ='dist';
    if (!pageName) pageName = 'index';
    var baseDirPrj= "./"+projectName+"/"+catalog;
    browserSync.init({
        server: {
            baseDir:"./",
             index: baseDirPrj+"/"+pageName+".html"
        },
        open:argv.s?false:true
    });
    gulp.watch(projectName+"/"+catalog+"/**/*.html").on('change', reload);
});


/******** 单独的小任务 *********/
//css压缩
//eg. gulp ccss -s  common/css/base/reset.css 支持文件
gulp.task('ccss', function() {
    var sourceUrl = argv.s;
    // 1. 找到文件
    gulp.src(sourceUrl)
        // 2. 压缩文件
        .pipe(minifycss())
        // 3. 文件重命名
        .pipe(rename({
            suffix: '.min'
        }))
        // 4. 另存压缩后的文件
        .pipe(gulp.dest(path.dirname(sourceUrl)))
});

//js压缩
////eg. gulp cscript -s common/eco/config/ecoConfig.js 支持文件
gulp.task('cscript', function() {
    var sourceUrl = argv.s;
    // 1. 找到文件
    gulp.src(sourceUrl)
        // 2. 压缩文件
        .pipe(uglify())
        // 3. 文件重命名
        .pipe(rename({
            suffix: '.min'
        }))
        // 4. 另存压缩后的文件
        .pipe(gulp.dest(path.dirname(sourceUrl)))
});

//js合并
//eg. gulp ccscript -s common/eco/lib/ecojs/eco.js,common/eco/config/ecoConfig.js,common/eco/systems/mob/mob.js -d common/eco/systems/mob/package_ecoConfigMob.js 支持文件
gulp.task('ccscript', function() {
    var sourceUrl = argv.s;
    var dest = argv.d;
    var dirname = path.dirname(dest);
    var dname = path.basename(dest);
    if (sourceUrl.indexOf(",") != -1) {
        sourceUrl = "{" + sourceUrl + "}";
    }
    gulp.src(sourceUrl)
        .pipe(uglify())
        .pipe(concat(dname))
        .pipe(gulp.dest(dirname));
});


//默认的任务为帮助
gulp.task('default', ['help']);