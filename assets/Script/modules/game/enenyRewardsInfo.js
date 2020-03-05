var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
        var iHeight = cc.winSize.height;
        this.node_top.y = iHeight/2
        this.node_bttom.y = -iHeight/2
        this.node_main.y = -(1555 - iHeight)/2
        this.addEvents()
    },

    init(info,idx){
        this.node.parent = GM.rewards.node_top
        var iHeight = cc.winSize.height;
        this.node.y = -iHeight/2
    },

    addEvents: function () {
        this.btn_back.quickBt(function () {
            
            entityMgr.enenyRewardsInfoPool.put(this.node)
        
        }.bind(this));

        this.btn_edit.quickBt(function () {
          
        }.bind(this));
    },

});
