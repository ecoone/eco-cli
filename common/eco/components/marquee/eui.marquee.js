/**
 * 功能说明：跑马灯组件支持横跑和树跑
 * @author:  TG (QQ:445176468)
 * @example
 *  ui结构
  <div class="eui-scroll-viewport">
      被滚动的双视图容器
       <div class="eui-scroll-wrapper">
            <ul class="eui-scroll">
                <li class="eui-scroll-item"><a href="http://www.baidu.com">哈哈哈哈哈哈哈</a></li>
                <li class="eui-scroll-item"><a href="http://www.baidu.com">哈哈哈哈哈哈哈1</a></li>
                <li class="eui-scroll-item"><a href="http://www.baidu.com">哈哈哈哈哈哈哈2</a></li>
                <li class="eui-scroll-item"><a href="http://www.baidu.com">哈哈哈哈哈哈哈3</a></li>
                <li class="eui-scroll-item"><a href="http://www.baidu.com">哈哈哈哈哈哈哈4</a></li>
            </ul>        
        </div>
    </div> 
  css书写，垂直的，水平的自己做转换即可
  .eui-scroll-viewport {
    width: 3.60rem;
    height: 0.4rem;
    position: absolute;
    bottom: 0.21rem;
    margin-left: 1.50rem;
    overflow: hidden;
    .eui-scroll-wrapper{
      .eui-scroll{
        font-size: 0.22rem;
        color: #000;
        li {
          line-height: 0.4rem;
          height: 0.4rem;
          text-align: center;
          width: 3.60rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
 */
eco.define("marquee", ['zepto'], function($) {
    function marquee(viewportEl,transition,direction){
        var euiScrollWrapperEl = viewportEl.find('.eui-scroll-wrapper'),
            euiScrollEl = euiScrollWrapperEl.find('.eui-scroll'),
            scrollItemEl = euiScrollEl.find('.eui-scroll-item'),
            scrollItemLength = euiScrollEl.find('.eui-scroll-item').length;
        //只有一条就不要跑马灯了
        if(scrollItemLength<=1) return;
        euiScrollWrapperEl.append(euiScrollEl.clone());
        transition = transition?transition:'all 1s ease 0.9s';
        var itemHeight,itemWidth,itemDom,index = 0, stopFlag = false,testStopFlag=false;
        itemEl = euiScrollEl.find('.eui-scroll-item').eq(0);
        if(direction=="v"){
        	itemHeight = itemEl[0].offsetHeight+parseInt(itemEl.css("margin-top"))+parseInt(itemEl.css("margin-bottom"));
        }else{
        	itemWidth = itemEl[0].offsetWidth+parseInt(itemEl.css("margin-left"))+parseInt(itemEl.css("margin-right"));
          var nowEuiScrollEl = euiScrollWrapperEl.find('.eui-scroll');
          euiScrollWrapperEl.find('.eui-scroll-item').css("float","left");
          nowEuiScrollEl.css("float","left");
          nowEuiScrollEl.css("width",scrollItemLength*itemWidth);
          euiScrollWrapperEl.css("width",2*scrollItemLength*itemWidth);
        }	
        //跑马灯核心函数
        function marqueeCore() {
            if(stopFlag) {
                testStopFlag = true;
                return;
            }
            if(index>=scrollItemLength){
               index = 0;
               //清空transition
               euiScrollWrapperEl.css('-webkit-transition','none');
               if(direction=="v"){
	               euiScrollWrapperEl.css('-webkit-transform','translateY(-'+0+'px)');
	               euiScrollWrapperEl.css('transform','translateY(-'+0+'px)');
               }else{
	               euiScrollWrapperEl.css('-webkit-transform','translateX(-'+0+'px)');
	               euiScrollWrapperEl.css('transform','translateX(-'+0+'px)');               	
               }
               setTimeout(function(){
                 marqueeCore();
               },50);
            }else{
               index++;
               if(index==1) euiScrollWrapperEl.css('-webkit-transition',transition);
			    if(direction=="v"){
	               euiScrollWrapperEl.css('-webkit-transform','translateY(-'+index*itemHeight+'px)');
	               euiScrollWrapperEl.css('transform','translateY(-'+index*itemHeight+'px)');  
               }else{
	               euiScrollWrapperEl.css('-webkit-transform','translateX(-'+index*itemWidth+'px)');
	               euiScrollWrapperEl.css('transform','translateX(-'+index*itemWidth+'px)');  
               }
            }
        }
        marqueeCore();
        euiScrollWrapperEl.on('webkitTransitionEnd  transitionEnd',marqueeCore);
        euiScrollWrapperEl.bind('touchstart',function(){
            stopFlag = true;
        }); 
        euiScrollWrapperEl.bind('touchend',function(){
            stopFlag = false;
            if(testStopFlag) {
                marqueeCore();
                testStopFlag = false;
            }
        });             
        euiScrollWrapperEl.bind('mouseover',function(){
            stopFlag = true;
        }); 
        euiScrollWrapperEl.bind('mouseout',function(){
            stopFlag = false;
            if(testStopFlag) {
                marqueeCore();
                testStopFlag = false;
            }
        });  
    };
	var marqueeModule = {
		//vertical 垂直跑马灯
		v:function(viewportEl,transition){
			marquee(viewportEl,transition,"v");
		},
		//horizontal 水平跑马灯
		h:function(viewportEl,transition){
			marquee(viewportEl,transition,"h");
		}
	}
	return marqueeModule;
});