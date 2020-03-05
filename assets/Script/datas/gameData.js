var baseData = require("baseData");

cc.Class({
  extends: baseData,
  name: "gameData",

  properties: {
    newUser: undefined,
    easyTime: undefined,                
    mediumTime: undefined, 
    hardTime: undefined,
    exportTime: undefined,                   
    level: undefined,
  },

  ctor () {
   
  },

  init(){

  },

  isTemData () {
    return this.readValue("_lastSaveKey") == "temKey"
  },

  //登录上一个账号有数据.用在服务器登录失败
  initLastSaveData () {
    var savekey = this.readValue("_lastSaveKey")
    if (savekey) {
      this.initSaveData(savekey)
      loginData.set('userID', savekey)
      loginData.initSaveData(savekey);
      return true
    }

    this.initSaveData("temKey")
    return false
  },

  //如果数据不存在，给默认值
  initGameData () {
    this.undefinedOrSet("newUser", 0);
    this.undefinedOrSet("easyTime", 0);
    this.undefinedOrSet("mediumTime", 0);
    this.undefinedOrSet("hardTime", 0);
    this.undefinedOrSet("exportTime", 0);
    this.undefinedOrSet("level", 0);
  },

  //设置自动保存这些数据
  initSaveData (key) {

    //上一次登录为游客状态,把游客数据导入到当前账号
    let changeKey = false
    if (key != "temKey" && this.readValue("_lastSaveKey") == "temKey") {
      this.initSaveData("temKey")
      changeKey = true
    }
    this.set("_lastSaveKey", key)
    this.storeValue("_lastSaveKey")
    this.setSaveKey(key);

    this.autoReadSave("newUser");
    this.autoReadSave("easyTime");
    this.autoReadSave("mediumTime");
    this.autoReadSave("hardTime");
    this.autoReadSave("exportTime");
    this.autoReadSave("level");
    this.initGameData();

    //把游客数据保存到当前账号下
    if (changeKey) {
      this.saveAllData()
      this.delAllData("temKey")
    }

  },
});