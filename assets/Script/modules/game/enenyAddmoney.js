var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
    },

    init(eneny){
        var iHeight = cc.winSize.height;
        this.node.y = -iHeight/2

        this.initMoney = 125000
        this.nowMoney = this.initMoney
        this.endMoney = this.initMoney + eneny.money
        this.one_add_value = Math.ceil((this.endMoney - this.initMoney)/30)
        this.node.parent = eneny.parent
        this.isBegin = false
        this.node_main.y = -87.6
        this.lbl_add.opacity = 0
        this.lbl_all.scaleX = 0.5
        this.lbl_all.scaleY = 0.5
        this.lbl_all.setLabel(util.getUsNum(this.initMoney))
        var anim = this.node.getComponent(cc.Animation);
        anim.play(`addMoney`);
        anim.on('finished', function () {
            anim.off('finished');
            entityMgr.enenyAddmoneyPool.put(this.node)
        }.bind(this), this);
        this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function () {
            this.lbl_all.stopAllActions()
            this.lbl_all.runAction(cc.scaleTo(0.25,0.55,0.55))
            this.isBegin = true
        }.bind(this))))
    },  

    update(dt){
        if (dt > 0.2) {//低于5帧不做处理
            return
        }
        if(this.isBegin){
            if(Math.abs(this.endMoney - this.nowMoney)<=this.one_add_value){
                this.isBegin = false
                this.lbl_all.stopAllActions()
                this.lbl_all.runAction(cc.scaleTo(0.25,0.5,0.5))
                this.nowMoney = this.endMoney
                this.lbl_all.setLabel(util.getUsNum(this.nowMoney))
            }else{
                this.nowMoney += this.one_add_value
                this.lbl_all.setLabel(util.getUsNum(this.nowMoney))
            }
        }
    },
});
