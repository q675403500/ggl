var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
    
    },

    init(entity){
        this.type = entity.type
        var scale = cc.winSize.height/600;
        if(this.type == 2){
            scale = cc.winSize.height/480;
        }
        
        this.node.scaleX = scale
        this.node.scaleY = scale
        this.node.parent = GM.hallUI.node_main
        var anim = this.node.getComponent(cc.Animation);
        if(this.type == 1){
            anim.play(`scratchWinTokens`);
        }else if (this.type == 2){
            anim.play(`scratchWinCash`);
            util.vibrationEffect(3000)
        }
    
        anim.on('finished', function () {
            anim.off('finished');
            entity.jsParent.dead(true)
            entityMgr.enenyAnimScratchWinPool.put(this.node)
        }.bind(this), this);
    },
 
});
