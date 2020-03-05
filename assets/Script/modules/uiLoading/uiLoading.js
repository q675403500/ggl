// 加载资源的过渡界面
var baseNode = require("baseNode")
cc.Class({
  extends: baseNode,

  properties: {

  },

  start () {
    this.node.zIndex = 9999;
    // wxUtil.setKeepScreenOn();
    // var bIsIphoneX = util.isIphoneX();
    // var iHeight = util.getDisHeight();
    // if (bIsIphoneX) {
    //   this.node_up.y = this.node_up.y + iHeight
    //   this.node_down.y = this.node_down.y - iHeight
    // }
    this.initColor()
  },

  initColor(){
    this.node_bg.color = webData.color
  },

  init (paths, callback) {
    GM.uiLoading = this
    this.downloadResources(paths, callback, 0)

    this.layout_hall.active = true

    this.callback = callback

    // this.preBar = this.pre_bar.getComponent(cc.Sprite)
    // this.realProgress = 0
    // this.speed = 0.004
    // this.preBar.fillRange = 0
    this.node_down.runAction(cc.fadeIn(2))
  },

  // update (dt) {
  //   if (dt > 0.2 || this.close || !this.preBar) {//低于5帧不做处理
  //     return
  //   }
  //   let nowProgress = this.preBar.fillRange
  //   let _pro = nowProgress + this.speed
  //   if (_pro < this.realProgress) {
  //     this.preBar.fillRange = _pro
  //     // this.txt_load.getComponent(cc.Label).string = `正在加载：${Math.floor(_pro * 100)}%`
  //   } else {
  //     this.preBar.fillRange = this.realProgress
  //     // this.txt_load.getComponent(cc.Label).string = `正在加载：${Math.floor(_pro * 100)}%`
  //   }
  //   if (this.preBar.fillRange >= 1) {
  //   //   if (webData._initLogin) {
  //       this.close = true
  //       this.callback && this.callback()

  //       this.node.runAction(cc.sequence(cc.delayTime(1),cc.fadeOut(1), cc.callFunc(function () {
  //         uiFunc.closeUI(this, null, true);
  //       }.bind(this))))
  //   //   }
  //   }
  // },
  dead(){
    this.node.runAction(cc.sequence(cc.delayTime(1),cc.fadeOut(1), cc.callFunc(function () {
      uiFunc.closeUI(this, null, true);
    }.bind(this))))
  },


  downloadResources (paths, callback, _index) {
    let index = _index || 0;
    var jindu = 0;
    cc.loader.loadResDir(paths[index], function (completedCount, totalCount, item) {
      // if (totalCount > 0) {
      //   if (paths && paths.length) {
      //     let progress = Math.floor((1 / paths.length * (completedCount / totalCount) + (index * (1 / paths.length))) * 100)
      //     if (progress > jindu) {
      //       this.speed = (progress / 100 - this.preBar.fillRange) / 100
      //       jindu = progress;
      //       this.realProgress = progress / 100
      //     }
      //   }
      // }
    }.bind(this), function (err, resource, urls) {
      if (paths && paths.length) {
        index++;
        if (index < paths.length) {
          this.downloadResources(paths, callback, index)
          return
        }
        // this.realProgress = 1
        console.log("资源加载完成")
        this.callback && this.callback()
      }
    }.bind(this))
  },
});
