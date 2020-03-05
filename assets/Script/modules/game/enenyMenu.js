var baseNode = require("baseNode")
var entityFactory = require("entityFactory")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
        var iHeight = cc.winSize.height;
        // this.node_top.y = iHeight/2
        this.node_main.y = 135 - (1555 - iHeight)/2
        this.initColor()
        this.addEvent()
    },

    initColor(){
        this.sp_top.color = webData.color
    },

    addEvent(){
        this.btn_back.quickBt(() => {
            // audioData.playSoundByPath("audio/common/sound_dc_continue")
            this.dead()
        }); 

        this.btn_mask.onStart(() => {
            this.dead()
        }); 

        this.btn_settings.onStart(() => {
            this.open_settings()
            this.dead()
        }); 

        this.btn_leaderBoard.onStart(() => {
            this.open_LeaderBoard()
            this.dead()
        }); 

        this.btn_edit.onStart(() => {
            this.open_edit()
            this.dead()
        }); 

        this.btn_rewards.onStart(() => {
            this.open_Rewards()
            this.dead()
        }); 

        this.btn_cash.onStart(() => {
            this.open_cash()
            this.dead()
        }); 
    },

    init(entity){
        this.node.parent = GM.hallUI.node_main
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(`openMenu`);
        animState.wrapMode = cc.WrapMode.Reverse;
        this.node.stopAllActions()
        this.node.runAction(cc.sequence(cc.moveTo(0.3,0,0),cc.delayTime(0.2),cc.callFunc(function () {
  
        }.bind(this))))
    },


    dead(){

        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(`openMenu`);
        animState.wrapMode = cc.WrapMode.Normal;
        anim.on('finished', function () {
            anim.off('finished');
            entityMgr.enenyMenuPool.put(this.node)
        }.bind(this), this);
    },

    open_settings(){
        new entityFactory().createEntity(null,`ui/game/enenySettings`,`enenySettings`,`enenySettings`)
    },

    open_LeaderBoard(){
        // new entityFactory().createEntity(null,`ui/game/enenyLeaderBoard`,`enenyLeaderBoard`,`enenyLeaderBoard`)
        uiFunc.openUI("uiHall/uiLeaderBoard", null, null, true);
    },

    open_edit(){
        uiFunc.openUI("uiHall/uiEdit", null, null, true);
    },

    open_Rewards(){
        uiFunc.openUI("uiHall/uiRewards", null, null, true);
    },

    open_cash(){
        uiFunc.openUI("uiHall/uiCash", null, null, true);
    },
});
