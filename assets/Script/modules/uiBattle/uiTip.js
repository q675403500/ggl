var baseDlg = require("baseDlg");
cc.Class({
    extends: baseDlg,

    properties: {
    
    },

    start () {

    },

    init(str,time){
        let content = this.lbl_tip.getComponent(cc.Label);
       content.string = str;
       let self=this;
       content.unscheduleAllCallbacks();
       content.scheduleOnce(function () {
           uiFunc.closeUI(self);
       },time)
    }

});
