var baseNode = require("baseNode")
var entityFactory = require("entityFactory")

cc.Class({
    extends: baseNode,

    properties: {
    },
    
    start () {
        GM.hallUI = this
        this.addEvent()
        this.initColor()
        var iHeight = cc.winSize.height;
        this.node_top.y = iHeight/2
        this.node_bottom.y = -iHeight/2
        this.node_scrollview.height = iHeight - 200
        this.node_scrollview.y = this.node_scrollview.height/2
        this.page = 1
        this.state_transform()
    },

    addEvent(){
        this.btn_menu.quickBt(() => {
            this.openMenu()
        }); 

        this.btn_video.quickBt(() => {
            // console.log("视频拉起")
            // util.showRewardedVideo()
            util.showRewardedVideo("scratch")
        }); 

        this.btn_invite.quickBt(() => {
            
        }); 
        this.btn_luckyDay.quickBt(() => {
            this.page = 1
            this.state_transform()
        }); 
        this.btn_raffle.quickBt(() => {
            this.page = 2
            this.state_transform()
        }); 
        this.btn_freeTokens.quickBt(() => {
            this.page = 3
            this.state_transform()
        }); 
        this.btn_winners.quickBt(() => {
            this.page = 4
            this.state_transform()
        }); 
    },

    initColor(){
        this.top_bg.color = webData.color
        this.sp_luckDay.color = webData.color
        this.sp_raffle.color = webData.color
        this.sp_freeTokens.color = webData.color
        this.sp_winners.color = webData.color
    },

    openMenu(){
        
        new entityFactory().createEntity(null,`ui/game/enenyMenu`,`enenyMenu`,`enenyMenu`)
    },


    state_transform(){
        this.sp_luckDay.color = (this.page == 1)?webData.color:cc.color(192,192,192)
        this.sp_raffle.color = (this.page == 2)?webData.color:cc.color(192,192,192)
        this.sp_freeTokens.color = (this.page == 3)?webData.color:cc.color(192,192,192)
        this.sp_winners.color = (this.page == 4)?webData.color:cc.color(192,192,192)
        this.node_scroll.stopAllActions()
        if(this.page == 1){
            this.node_scroll.runAction(cc.sequence(cc.moveTo(0.2,0,0), cc.callFunc(function () {
                // this.node_scrollview.active = true
                // this.node_raffle.active = false
                // this.node_freeTokens.active = false
                // this.node_winners.active = false
            }.bind(this))))
        }
        if(this.page == 2){
            this.node_scroll.runAction(cc.sequence(cc.moveTo(0.2,-720,0), cc.callFunc(function () {
                // this.node_scrollview.active = false
                // this.node_raffle.active = true
                // this.node_freeTokens.active = false
                // this.node_winners.active = false
            }.bind(this))))
        }
        if(this.page == 3){
            this.node_scroll.runAction(cc.sequence(cc.moveTo(0.2,-1440,0), cc.callFunc(function () {
                // this.node_scrollview.active = false
                // this.node_raffle.active = false
                // this.node_freeTokens.active = true
                // this.node_winners.active = false
            }.bind(this))))
        }
        if(this.page == 4){
            this.node_scroll.runAction(cc.sequence(cc.moveTo(0.2,-2160,0), cc.callFunc(function () {
                // this.node_scrollview.active = false
                // this.node_raffle.active = false
                // this.node_freeTokens.active = false
                // this.node_winners.active = true
            }.bind(this))))
        }
    },
});
