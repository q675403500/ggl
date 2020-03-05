var baseNode = require("baseNode")
var entityFactory = require("entityFactory")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
        var iHeight = cc.winSize.height;
        this.node_top.y = iHeight/2
        this.node_bottom.y = -iHeight/2
        this.addEvent()
        this.initColor()
    },

    initColor(){
        // this.top_bg.color = webData.color
    },

    addEvent(){
        this.btn_close.quickBt(() => {
            this.dead()
        }); 

        this.btn_wait.quickBt(() => {
            this.dead()
        }); 
    },

    init(entity){
        this.node.parent = GM.hallUI.node_main
        this.idx = entity.idx
        this.info = entity.info
        this.initData()
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(`openlucky`);
        animState.wrapMode = cc.WrapMode.Normal;
    },


    dead(){
        GM.gameCtrl.breathe_began()
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(`openlucky`);
        animState.wrapMode = cc.WrapMode.Reverse;
        anim.on('finished', function () {
            anim.off('finished');
            GM.hallUI.node_block.active = false
            entityMgr.enenyItem03_1Pool.put(this.node)
        }.bind(this), this);
    },

    initData(){
       this.lbl_select_1.setLabel(GM.gameCtrl.select_1)
       this.lbl_select_2.setLabel(GM.gameCtrl.select_2)
       this.lbl_select_3.setLabel(GM.gameCtrl.select_3)
       this.lbl_select_4.setLabel(GM.gameCtrl.select_4)
       this.lbl_select_5.setLabel(GM.gameCtrl.select_5)
       this.lbl_select_6.setLabel(GM.gameCtrl.select_6)
    },

});
