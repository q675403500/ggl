var baseData = require("baseData")

cc.Class({
  extends: baseData,
  name: "loginData",
  properties: {
    //登录回包
    userID: undefined,
    userName: undefined,  // 微信登录时，值为微信用户openid
    nickName: undefined,
    headWeb: undefined,
    NewUser: false,
    
  },

  ctor () {
    // this._hasInitServer = true;
  },

  initSaveData (key) {
    this.setSaveKey(key);
    this.initGameData();
    
    // this.autoReadSave("planeList");
    this.autoReadSave("userID");
    this.autoReadSave("nickName");
    this.autoReadSave("headWeb");
  },

  //如果数据不存在，给默认值
  initGameData () {
    // this.undefinedOrSet("planeList", {})
  },


});