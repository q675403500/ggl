var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,

    properties: {
        isDlg:true,
        //弹窗的周围是否显示黑色底
        mask: {
            default: true,        // The default value will be used only when the component attaching
        },

        //点击周围区域关闭
        touchClose: {
            default: true,
        },

        froceTop: {
            default: false,        // The default value will be used only when the component attaching
        },
        //播放放大效果
        playScale: {
            default: true,
        },

        //关闭的时候直接关掉,不是隐藏
        closeClear: {
            default: true,
        }
    },

    onLoad() {
        this._super();

        if (this.mask) {
            cc.loader.loadRes('ui/uiTip/uiBg', (err, prefab)=> {    
                var sp_bg = cc.instantiate(prefab);
                sp_bg.lwMaskName = "uiBg"
                sp_bg.zIndex = -1;
                sp_bg.parent = this.node
                sp_bg.opacity = this.mask ? 155 : 0;
               if (this.touchClose) {
                    sp_bg.quickBt(() => {
                        this.closeSelf();
                    }, true, true)
                }
            });    
        }
        
    },

   

    
    closeSelf() {
        // wxUtil.setBannerAd(1, false)
        uiFunc.closeUI(this, null, this.closeClear);
    },

    //播放窗口从小到大的效果
    playScaleAni() {

         var children = this.node.children;
            
         for (var i = 0; i < children.length; i++) {
             
             if(children[i].lwMaskName != "uiBg" ){
                // children[i].setScale(1)
                 var oriScale = children[i].getScale()
                 
                 var action1 = cc.scaleTo(0.005, 0.5);
                 var action2 = cc.scaleTo(0.13, oriScale+0.05);
                 var action3 = cc.scaleTo(0.13, oriScale);
                 var action4 = cc.scaleTo(0.08, oriScale+0.02);
                 var action5 = cc.scaleTo(0.08, oriScale);
                
                 var seq = undefined
                 seq = cc.sequence(cc.hide(),action1,cc.show(),action2,action3,action4,action5);
                
                 seq.easing(cc.easeOut(1.0))

                 children[i].runAction(seq);
             }
          
         }

    }
});
