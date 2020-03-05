// 加载资源的过渡界面
var baseNode = require("baseNode")
cc.Class({
  extends: baseNode,

  properties: {

  },

  start () {
    let LayerGuide = cc.find("LayerGuide",cc.Canvas.instance.node)
    this.node.parent = LayerGuide
  },
});
