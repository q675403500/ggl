var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
        this.initColor()
    },

    initColor(){
        this.node_main.color = webData.color
    },

    init(eneny){
        var iHeight = cc.winSize.height;
        this.node.y = iHeight/2

        this.node.parent = eneny.parent
        this.node_main.y = 50
        var anim = this.node.getComponent(cc.Animation);
        anim.play(`addTop`);
        anim.on('finished', function () {
            anim.off('finished');
            entityMgr.enenyAddTopPool.put(this.node)
        }.bind(this), this);
    },  
});
