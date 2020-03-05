var baseNode = require("baseNode")
const List = require('List');
cc.Class({
    extends: baseNode,
    properties: {
        list:List,
    },
    
    start () {
        var iHeight = cc.winSize.height;
        this.node_top.y = iHeight/2
        this.node_bottom.y = - iHeight/2
        this.node_main.y = -(1555 - iHeight)/2
        this.node_scrollview.height = iHeight - 545
        // this.node_scrollview.y = 340 - (1555 - iHeight)
        this.initColor()
        this.addEvents();
        this.init()
    },

    initData(){
        this.item_data = [
            {
                type : 2,
                id: 1,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
        ]
    },

    init(){
        this.initData()
        this.list.calcCustomSize(this.item_data.length);
        this.list.numItems = this.item_data.length;
        this.node.parent = GM.hallUI.node_Top
        GM.hallUI.node_main.stopAllActions()
        GM.hallUI.node_main.runAction(cc.sequence(cc.moveTo(0.5,-200,0),cc.callFunc(function () {
            
        }.bind(this))))
        this.node.runAction(cc.sequence(cc.moveTo(0.5,0,0),cc.callFunc(function () {
            
        }.bind(this))))
    },

    
    initColor(){
        this.top_bg.color = webData.color
        this.bottom_bg.color = webData.color
    },
  
    addEvents: function () {
        this.btn_back.quickBt(function () {
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
  