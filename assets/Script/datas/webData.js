var _host = "https://innerrzkpgame.lwfjmj.com"
let _getPublicData = "https://rzkptr.lwfjmj.com/Default/GetPublicData"
var _setGameClick = "https://rzkptr.lwfjmj.com/Default/TryGameClick"
var gameHost = "rzkpgame"
var baseData = require("baseData")

cc.Class({
    extends: baseData,
    name: "webData",
  
    properties: {
      gameKey: "KuVTQ2nFWf7MDe3SGp1YIF2Pxvdo0l0R",
      login: _host + "/Handler/WXFYHandler.ashx", //玩家信息接口（初始化，下发用户基本信息，小兵列表，道具列表，英雄列表，好友助力列表，斗将塔列表，任务完成情况列表，成就完成度列表）
      hostDownload: "https://innerdzdownload.lwfjmj.com/miniGame/rzkp/1004/", // 分享图片下载链接
      _sendLog: "https://rzkptr.lwfjmj.com/ClientExption/index",//发送log给服务器
      sendMsg: _host + "/default.aspx",
      _sendDataTypes: {
        default: {},
      },//发送的数据类型.服务器要求int之前用的是string
      _lastSaveTime: 1 //服务器最新存档时间
    },


    //初始化信息
    init () {
      this.color = cc.color(64,181,249)
      gameData.initLastSaveData()
    },
});