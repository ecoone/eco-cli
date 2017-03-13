#eco-cli自动化工作流工具
eco-cli是一个基于ecojs的自动化工作流工具，方便快速创建ecojs普通创建项目和egame游戏项目，可以对对资源进行上线环境处理，比如eco模块打包，样式压缩,js压缩，图片压缩等。是一个非常轻量友好的自动化工作流。

##windows环境安装
1. 为gulp-ruby-sass安装ruby环境，网络下载即可 
2. 在ruby中获取sass模块 gem install sass
3. 安装node环境
4. npm仓库指向国内`npm config set registry https://registry.npm.taobao.org`
4. 在cdn event静态资源根录运行`npm install`加载所需模块
5. 在全局按照gulp以便命令行使用gulp `npm install gulp -g`

##mac环境安装
   
1. 为gulp-ruby-sass安装ruby环境，brew install ruby 
2. 在ruby中获取sass模块 gem install sass
3. 安装node环境 
4. npm仓库指向国内`npm config set registry https://registry.npm.taobao.org`
5. 在cdn event静态资源根录运行`sudo npm install`加载所需模块
6. 在全局按照gulp以便命令行使用gulp `sudo npm install gulp -g`

##自动化工具的使用
 
###template目录说明
temple目录是用来做项目脚手架的，src目录是开发目录，dist是build构建出来的目录,要是添加其他类型的资源，比如说audios那么就在src目录里面创建即可，引用也是引用这个目录的，没有处理所以暂时不需要放入dist
###项目创建
创建项目和项目中的单个页面，创建egame游戏需要在后面添加--g
 eg1.创建项目test
 `gulp init -p test`
 eg2.在项目test中添加myPage页面
 `gulp init -p test -n myPage`
 
 
###监听项目
监听主要是监听样式scss和精灵表,并会启动web服务器打开index.html页面，**在发生变化的时候自动同步到浏览器**
 
 eg. 监听项目test的样式scss和精灵表
 `gulp watch -p test`
 
###构建项目
将src中的源文件构建到dist目录，包括图片压缩，样式压缩，eco模块打包和js压缩，**静默打包**
 eg.构建项目p
 `gulp build -p test`
 
 
###html压缩
对html压缩前，请将开发引入的路径注释，打开生产环境引入的路径
eg1.压缩test项目中的html
`gulp chtml  -p test `
eg2.压缩test项目中的html，并打开浏览器
`gulp chtml  -p test --s `
eg2.压缩test项目中的myPage页面
`gulp chtml  -p test -n myPage`

###启动web服务器
用于给页面提供web服务器环境，如果有--s那么**静默启动服务器**，--n服务器打开的默认主页，不传就是index.html,如果不传--d打开src目录页面，注意项目根目录在event目录，你可以通过路径直接访问，自动的服务器端口好是3000
eg.打开test项目中的myPage页面，如果不传-n默认打开index页面,如果不传--d打开src目录页面
` gulp server -p test -n myPage -d `
###单独小工具
####css压缩
eg. `gulp ccss -s  common/css/base/reset.css` 支持文件
####js压缩
eg. `gulp cscript -s common/eco/config/ecoConfig.js` 支持文件
####js合并
eg. `gulp ccscript -s common/eco/lib/ecojs/eco.js,common/eco/config/ecoConfig.js,common/eco/systems/mob/mob.js -d common/eco/systems/mob/eco.mob.package.js` 支持文件
###chrome调试工具
请看项目附件

##common/eco目录说明
1. ---components UI组件
2. ---config     组件资源配置文件
3. ---demos      组件使用的demo
4. ---lib        类库，框架，比如ecojs、jQuery、zepto、angular
5. ---systems    系统级别的js，比如说mob系统公有的js
6. ---plugins    不包含UI的组件

 
##自动化工具v0.0.2升级说明
###升级方法
1. 更新代码库
2. 运行 `npm install browser-sync  --save-dev`
3. 运行`npm install phantomjs --save-dev`

 
###优化点
1. 监听功能增强，在修改样式和html的时候，浏览器自动同步更新
2. 构建功能优化，采用虚拟浏览器静默打包，只需要观察控制台日志就知道自己是否打包，完成，当然构建完成后想打开浏览器可以加 --o参数
3. 启动服务器优化，不在使用express，可静默启动
4. 其他性能优化和bug修改