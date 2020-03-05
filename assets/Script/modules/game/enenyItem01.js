var baseNode = require("baseNode")
var entityFactory = require("entityFactory")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
        this.LAST_CLICK_TIME = 0;
        this.CD_TIME = 20;
    },

    init(info,idx){
        this.idx = idx
        this.info = info
        this.initData()

        // util.display(this.sp_icon,`img/game/${info.id}/icon`)
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onClick.bind(this));
    },

    onClick(){
        let now = new Date().getTime();
        if(now - this.LAST_CLICK_TIME < this.CD_TIME )
        {
            console.log("---屏蔽过快点击---");
            return;
        }
        GM.hallUI.node_block.active = true
        this.LAST_CLICK_TIME = now;
        this.node.stopAllActions()
        GM.gameCtrl.all_stop_action()
        this.node.runAction(cc.sequence(cc.scaleTo(0.1,0.9,0.9),cc.scaleTo(0.1,1,1),cc.callFunc(function () {
            this.openAllInfo()
        }.bind(this))))
    },

    initData(){
        if(this.info.type == 1){
            this.type_1.active = true
            this.type_2.active = false
            this.node.height = 400
            util.display(this.item_bg,`img/game/${this.info.id}/bg`)
            util.display(this.sp_icon,`img/game/${this.info.id}/icon`)
        }else if(this.info.type == 2){
            this.type_1.active = false
            this.type_2.active = true
            this.node.height = 520
        }
    },

    open_scratch(){
        let entity = {
            info : this.info,
            node : this.node,
            idx : this.idx
        }
        new entityFactory().createEntity(entity,`ui/game/enenyItem02`,`enenyItem02`,`enenyItem02`)
    },

    openAllInfo(){
        if(this.info.type == 1){
            if(GM.gameCtrl.open_scratch_num >= 3 && cc.sys.os === cc.sys.OS_ANDROID){
                let entity = {
                    info : this.info,
                    node : this.node,
                    idx : this.idx
                }
                GM.gameCtrl.set_scratch_info(entity)
                util.showRewardedVideo("scratch")
            }else{
                this.open_scratch()
            }
        }else if(this.info.type == 2){
            if(GM.gameCtrl.already_select_lucky){
                let entity = {
                    info : this.info,
                    node : this.node,
                    idx : this.idx
                }
                new entityFactory().createEntity(entity,`ui/game/enenyItem03_1`,`enenyItem03_1`,`enenyItem03_1`)
                return
            }
            let entity = {
                info : this.info,
                node : this.node,
                idx : this.idx
            }
            new entityFactory().createEntity(entity,`ui/game/enenyItem03`,`enenyItem03`,`enenyItem03`)
        }
    },
 
    stop_breathe(){
        this.node_main.stopAllActions()
        this.node_main.runAction(cc.scaleTo(0.3,1,1))
    },

    play_breathe(){
        this.node_main.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5,0.9,0.9),cc.scaleTo(0.3,1,1)).easing(cc.easeQuadraticActionInOut())))
    },
});
