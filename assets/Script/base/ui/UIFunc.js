/* eslint-disable */
window.uiFunc = {
    //当前打开的窗口列表
    uiList: [],
    //缓存中的窗口列表
    cacheUIList: [],
    //正在打开的窗口
    openingUI:{},
};

/**
 * 打开界面
 * @param {String} uiPath ui预制体的相对路径如:"hall/uiHall",注:路径必需在resource/ui目录下
 * @param {Function} callBack 加载成功回调 
 * @param {object} arg 脚本参数 
 */
uiFunc.openUI = function(uiPath, callBack,arg,noWaitting,bWin) {
    if(this.openingUI[uiPath])
    {
        cc.error("窗口正在打开中:"+uiPath);
        return
    }
    this.openingUI[uiPath] = true;
    var initFame = function(frame)
    {
        var panel = frame.getComponent("baseNode");
        if (callBack) {
            callBack(panel);
        }
        if (panel)
        {
            panel.show(arg);
        }
        this.openingUI[uiPath] = null;
    }.bind(this)

    var findtemp = this.findUI(uiPath)
    if (findtemp)
    {
        cc.error("窗口重复创建,直接显示上一个窗口:"+uiPath);
        findtemp.active = true;
        initFame(findtemp);
        return
    }
    // 缓存--
    for (var i = 0; i < uiFunc.cacheUIList.length; i++) {
        var temp = uiFunc.cacheUIList[i];
        if (temp && temp.pathName === uiPath) {
            temp.active = true;
            let layerName = "LayerNode"
            if(temp.getComponent("baseNode").isDlg){
                layerName = "LayerDlg"
            }
            let parent = cc.find(layerName,cc.Canvas.instance.node)
            temp.parent = parent;
            uiFunc.uiList.push(temp)
            uiFunc.cacheUIList.splice(i, 1);

            initFame(temp);
            return;
        }
    }

    // 非缓存--
    // let waitPath = "uiLoading/uiWaitting"
    // if(uiPath != waitPath && !noWaitting)
    // {
    //     this.openUI(waitPath)
    // }
    cc.loader.loadRes('ui/' + uiPath, (err, prefab)=> {
        // if(uiPath != waitPath && !noWaitting)
        // {
        //     this.closeUI(waitPath)
        // }
        if (err) {
            this.openingUI[uiPath] = null;
            cc.error(err.message || err);
            return;
        }
        var temp = cc.instantiate(prefab);
        temp.bWin = bWin
        let layerName = "LayerNode"
        if(temp.getComponent("baseNode") && temp.getComponent("baseNode").isDlg){
            layerName = "LayerDlg"
        }
        temp.pathName = uiPath;
        let parent = cc.find(layerName,cc.Canvas.instance.node)
        temp.parent = parent;
        uiFunc.uiList.push(temp)
        initFame(temp);
    });
};

uiFunc.openWaiting = function(){
    let self = this
    if(!this.waiting){
        this.openUI("uiLoading/uiWaitting", (uiScript) => {
            self.waiting = uiScript
          }, null, true);
        this.waiting = true
    }else{
        this.waiting.node.active = true
    }
},

uiFunc.closeWaiting = function(){
    if(this.waiting){
        this.waiting.node.active = false
    }
},

/**
 * 关闭界面
 * 
 * @param {String,object} uiPath ui预制体的相对路径,也可以传入窗口句柄,如:uiFunc.closeUI(this);
 * @param {Function} callBack 成功回调 
 * @param {Bool} clear 清除界面,默认不清除界面 
 */
uiFunc.closeUI = function(uiPath, callBack,clear) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && (temp.pathName === uiPath || (typeof (uiPath) == "object" && temp === uiPath.node))) {
            temp.active = false;
            if (clear)
            {
                temp.destroy();
            }
            else
            {
                var panel = temp.getComponent("baseNode");
                if(panel && panel.hide)
                {
                    panel.hide();
                }
                temp.removeFromParent(false);
                uiFunc.cacheUIList.push(temp);
            }
            uiFunc.uiList.splice(i, 1);

            if (callBack) {
                callBack();
            }

           

            return;
        }
    }
    console.log("uiFunc.closeUI fail not found ui "+uiPath)
}


uiFunc.closeAllDlg = function () {
    for (let index = uiFunc.uiList.length - 1; index >= 0; index--) {
        var temp = uiFunc.uiList[index];
        if (temp && !temp.bWin) {
            temp.active = false;
            var panel = temp.getComponent("baseNode");
            if(panel && panel.hide)
            {
                panel.hide();
            }
            temp.removeFromParent(false);
            uiFunc.cacheUIList.push(temp);
            uiFunc.uiList.splice(index, 1);
        }
    }
}

/**
 * 查找界面
 * 
 * @param {String,Object} uiPath ui预制体的相对路径
 * @param {Bool} uiScript 是否返回预制体(否则返回Node)
 * @returns {cc.Node,baseNode}  窗口句柄,uiScript
 */

uiFunc.findUI = function(uiPath,uiScript) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && temp.pathName === uiPath) {
            if (typeof(uiScript) !== "undefined")
            {
                return temp.getComponent("baseNode");
            }
            return temp;
        }
    }
};


uiFunc.isUIShown = function(uiPath) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && temp.pathName === uiPath) {
            
            return temp.active;
        }
    }
};

/**
 * 用于调用前清理一下，防止重复创建窗口
 * @param path
 */
uiFunc.clearUI = function (uiPath) {
    if(this.findUI(uiPath))
    {
        this.closeUI(uiPath);
    }
};


uiFunc.exitGame = function () {
    if(cc.sys.platform === cc.sys.WECHAT_GAME)
    {
        wx.exitMiniProgram()
    }
};