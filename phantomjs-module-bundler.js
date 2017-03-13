var system = require('system');
var page = require("webpage").create();
var openUrl = system.args[1];
console.log("openUrl:"+system.args[1]);
page.open(openUrl,function(){
   
})
page.onConsoleMessage = function() {
    if(arguments[0].indexOf("@@@")!=-1){
        console.log(arguments[0]);
        phantom.exit()
    }
};