   egame.use(['zepto','Game','Loader','Texture','Sprite','Text','Sound','Image','Audio'],function($,Game,Loader,Texture,Sprite,Text,Sound){
            //创建一个游戏对象
            var game = new Game(640,1008,document.body,egame.ScaleMode.FIXED_WIDTH);
            var load =  new Loader(game);
            //初始画面
            var loaddingStatus = {
                preload:function(){
                    //加载图像示例
                    // var baseUrl = axuer.getResUrl("egametest");
                    // load.image("birdie", baseUrl+"images/birdie.png");
                },
                create:function(){
                    //设置背景色
                    game.stage.backgroundColor = 0x1099bb;
                    var basicText = new Text('egame');
                    basicText.x = 350;
                    basicText.y = 30;
                    game.stage.addChild(basicText);
                    var credits = new Text('mniya.com\n@mni_Ya',{
                        font: '8px "Press Start 2P"',
                        fill: '#fff',
                        align: 'center'
                    });
                    credits.x = 30;
                    credits.y = 30;

                    game.stage.addChild(credits);
                    
                },
                update:function(){
                }
            };
            //添加状态并在游戏启动后自动启动
            game.state.add("loadding",loaddingStatus,true);
            game.boot();
      });
