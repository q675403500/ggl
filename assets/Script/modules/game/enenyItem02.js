var baseNode = require("baseNode")
var entityFactory = require("entityFactory")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
        this.LAST_CLICK_TIME = 0;
        this.CD_TIME = 20;
        this.addEvent()
    },

    addEvent(){
        this.btn_close.quickBt(() => {
            audioData.playSoundByPath("audio/common/sound_dc_continue")
            this.dead()
        }); 
    },

    init(entity){
        GM.gameCtrl.open_scratch_num ++ 
        this.node.parent = GM.hallUI.node_main
        this.posX = 0
        this.idx = entity.idx
        this.posY = entity.node.y + entity.node.parent.y + GM.hallUI.node_main.height/2
        this.node.x = this.posX
        this.node.y = this.posY
        this.info = entity.info
        this.btn_close.active = false
        util.display(this.item_bg,`img/game/${this.info.id}/bg`)
        util.display(this.sp_icon,`img/game/${this.info.id}/icon`)
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(`openItem`);
        animState.wrapMode = cc.WrapMode.Normal;
        this.node.stopAllActions()
        this.node.runAction(cc.sequence(cc.moveTo(0.3,0,0),cc.delayTime(0.2),cc.callFunc(function () {
            this.initData()
        }.bind(this))))
    },


    dead(isWin){
        
        this.btn_close.active = false
        if(this.scratch){
            this.scratch.dead()
            this.scratch = null
        }
        if(isWin){//通过
            GM.gameCtrl.refreshData(this.idx)
            GM.hallUI.node_block.active = false
            entityMgr.enenyItem02Pool.put(this.node)
            return
        }
        GM.gameCtrl.breathe_began()
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(`openItem`);
        animState.wrapMode = cc.WrapMode.Reverse;
        anim.on('finished', function () {
            anim.off('finished');
            GM.hallUI.node_block.active = false
            entityMgr.enenyItem02Pool.put(this.node)
        }.bind(this), this);
        this.node.stopAllActions()
        this.node.runAction(cc.sequence(cc.moveTo(0.3,this.posX,this.posY),cc.callFunc(function () {
            // this.openAllInfo()
        }.bind(this))))
    },

    initData(){
        this.btn_close.active = true
        let entity = {
            info : this.info,
            jsParent : this,
        }
        let self = this
        new entityFactory().createEntity(entity,`ui/game/enenyScratch`,`enenyScratch`,`enenyScratch`,(uiScript) => {
            self.scratch = uiScript
        })
    }
});
