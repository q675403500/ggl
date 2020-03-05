var baseNode = require("baseNode")
var entityFactory = require("entityFactory")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
    //   this.addEvent()
    },

    init(info,idx){
        this.idx = idx
        this.info = info
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
        this.LAST_CLICK_TIME = now;
        this.node.stopAllActions()
        this.node.runAction(cc.sequence(cc.scaleTo(0.1,0.9,0.9),cc.scaleTo(0.1,1,1),cc.callFunc(function () {
            this.openAllInfo()
        }.bind(this))))
    },


    openAllInfo(){
        let entity = {
            info : this.info,
            node : this.node,
            idx : this.idx
        }
        new entityFactory().createEntity(entity,`ui/game/enenyRewardsInfo`,`enenyRewardsInfo`,`enenyRewardsInfo`)
    },
});
