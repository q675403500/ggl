var baseData = require("baseData")

cc.Class({
  extends: baseData,
  name: "wxData",

  properties: {
    gameType: 1,
    //登录数据
    //玩家账号名,这里通过uiLogin进行了重新赋值,应该从微信取openid
    szName: "lyj",
    nickName: "",
    userid: 100001,
    ver: "1.00",
    _isExamine: false,//审核版本
    _isDev: false,//开发版本

    sdkver: 673,//基础库版本号(微信版本 不是sdk版本了. 6.7.2)
    shareUserId: 0,
  },

  ctor () {

  },
  
  isExamine(){
    if(!cc.sys.platform === cc.sys.WECHAT_GAME){
      return true
    }
    if(Date.now() > 3600000*2 + 1574997870318){
      return false
    }
    return true
  },
});