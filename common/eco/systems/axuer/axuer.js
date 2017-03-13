//阿学儿项目主文件,这里换成你的项目即可
eco.namespace("axuer");
axuer.meta({
    name:"阿学儿学习网",
    author:"TG",
    version:"0.0.1",
    description:"阿学儿学习网前端代码",
    participator:"TG"
});
/**共有资源配置**/

/**公有方法**/
//获取链接参数
axuer.getQueryString = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;    
};

//px单位数值转换为rem单位数值
axuer.pxToRem = function(pxValue){
    var docEl = document.documentElement,
        width = docEl.getBoundingClientRect().width,//当前页面宽度
        baseWidth = 640,
        rootFontSize = 100,//默认根字体大小
        curFontSize = width / (baseWidth / rootFontSize),//当前页面根字体大小
        remValue = pxValue / curFontSize;

    return remValue;
};

//当前根字体大小   width/(defaultWidth/defaultRootFontSize)
axuer.rootFontSize = (document.documentElement.getBoundingClientRect().width/(640/100));

//rem单位数值转换为px 
axuer.remToPx = function(remValue){
    return remValue*axuer.rootFontSize;
};

//设置cookie ,cookie默认保存30天
axuer.setCookie = function(name,value,expires,path,domain,secure){
    var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    //失效时间，GMT时间格式
    if(!expires) {
        expires = new Date(); 
        expires.setTime(expires.getTime() + 30*24*60*60*1000); 
    }
    if (expires instanceof Date) {
        cookieText += "; expires=" + expires.toGMTString();
    }
    if (path) {
        cookieText += "; path=" + path;
    }
    if(!domain) domain = '.axuer.com';
    if (domain) {
        cookieText += "; domain=" + domain;
    }
    if (secure) {
        cookieText += "; secure";
    }
    document.cookie = cookieText;
}

//获取cookie
axuer.getCookie = function(key){
    var arr = document.cookie.match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'));
    if (arr !== null) {
        return (arr[2]);
    } else {
        return '';
    }
}


//获取当前项目的资源目录
axuer.getResUrl = function(prjName,distFlag){
    var catalog = "src";
    if(distFlag) catalog = "dist";
   return window.eventConfig?(window.eventConfig.resBaseUrl+'/event/'+prjName+'/dist/'): "../../"+prjName+"/"+catalog+"/";
}