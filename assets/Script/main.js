//游戏入口函数,为主场景main Canvas加载的脚本,尽量简洁

cc.Class({
    extends: cc.Component,
    properties: {
  
    },
    onLoad () {
      
      //保持屏幕常亮
    //   wxUtil.setLowMachine()//检测低端机
    cc.game.setFrameRate(60)
    //   cc.game.setFrameRate(wxUtil.frameRate)
    //   wxUtil.setKeepScreenOn()
    //   audioData.loadCSV()
      // gameData.init();
    //   cultivateMgr.init();
    },
  
  
  
    start () {
      let paths = [
        "ui/uiHall",
        "img/uiHall",
        // "img/uiBattle",
        "ui/game",
        "img/game",
      ];
      uiFunc.openUI("uiLoading/uiLoading", (uiScript) => {
        uiScript.init(paths, () => {
          uiFunc.openUI("uiHall/uiHall", null, null, true, true);
        });
      }, null, true);
      webData.init()
    }
  
  });
  