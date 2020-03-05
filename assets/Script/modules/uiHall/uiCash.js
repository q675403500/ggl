var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,
    properties: {
    },
    
    start () {
        var iHeight = cc.winSize.height;
        this.node_main.y = -(1555 - iHeight)/2
        // this.node_scrollview.y = 340 - (1555 - iHeight)
        this.addEvents();
        this.init()
    },

    init(){
        this.node.parent = GM.hallUI.node_Top
        GM.hallUI.node_main.stopAllActions()
        GM.hallUI.node_main.runAction(cc.sequence(cc.moveTo(0.5,-200,0),cc.callFunc(function () {
            
        }.bind(this))))
        this.node.runAction(cc.sequence(cc.moveTo(0.5,0,0),cc.callFunc(function () {
            
        }.bind(this))))
    },
  
    addEvents: function () {
        this.btn_got.quickBt(function () {
            GM.hallUI.node_main.stopAllActions()
            GM.hallUI.node_main.runAction(cc.sequence(cc.moveTo(0.5,0,0),cc.callFunc(function () {
                
            }.bind(this))))
            this.node.stopAllActions()
            this.node.runAction(cc.sequence(cc.moveTo(0.5,720,0),cc.callFunc(function () {
                // entityMgr.enenyLeaderBoardPool.put(this.node)
                uiFunc.closeUI(this, null, true);
            }.bind(this))))
            
        }.bind(this));
    },

  });
  