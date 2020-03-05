window.baseData = require("baseData")
window.csvData = require("csvData")

//所有数据模块
var dataKeys = [
    "wxData",
    "webData",
    "shareData",
    "loginData",
    "gameData",
    "audioData",
    // "navigateData",
    // "BattleMgr",
    // "cultivateMgr",
    // "friendData",
    // "luckyRollerData",
    // "guideData",
]

for (let k in dataKeys) {
    try {
        var dataModuleName = dataKeys[k];
        console.log("=====所有数据模块=======",dataModuleName);
        var className = require(dataModuleName);
        window[dataModuleName] = window[dataModuleName] || new className();
    }
    catch (e) {
        cc.error(e)
    }
}