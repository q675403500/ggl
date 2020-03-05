/* eslint-disable */
// Create By ChangWei on 2018/10/11
// 定义一个全局变量 作为我开发游戏的常用管理
window.GM = {}
GM.hasLoadImg = {};
GM.hasLoadSound = {};
GM.hasLoadCsv = {};
GM.hasEffect = {};
GM.hasLoadJson = {};
GM.hasLoadPrefab = {}
GM.hasTouchDown = false;
GM.screenMode = "Horizontal"//"Vertical" //
GM.designSize = 1280*720//720*1280

cc.Node.prototype.to = function(father, zorder, tag) {
    zorder = zorder || 0;
    if (tag != null) {
        father.addChild(this, zorder, tag);
    } else {
        father.addChild(this, zorder);
    }
    return this;
};
// 快捷设置位置
cc.Node.prototype.p = function(xOrCcp, py) {
    var x = xOrCcp;
    if (y == null) {
        y = xOrCcp.y;
        x = xOrCcp.x;
    };
    this.setPosition(x, y);
    return this;
};
//快速设置在父亲结点的百分比位置, 如果没有父亲则使用设计分辨率
cc.Node.prototype.pp = function(pxOrCcp, py) {
    var px = pxOrCcp;
    if (px == null) {
        px = 0.5;
        py = 0.5;
    } else if (py == null) {
        py = pxOrCcp.y;
        px = pxOrCcp.x;
    }
    var winSize = cc.director.getWinSize();
    var pw = winSize.width, ph = winSize.height;
    if (this.getParent() != null) {
        var size = this.getParent().getContentSize();
        pw = size.width;
        ph = size.height;
    }

    this.setPosition(pw*px, ph*py);
    return this;
};
// 取消点击绑定
cc.Node.prototype.unbindTouch = function() {
    this.off(cc.Node.EventType.TOUCH_START);
    this.off(cc.Node.EventType.TOUCH_MOVE);
    this.off(cc.Node.EventType.TOUCH_END);
    this.off(cc.Node.EventType.TOUCH_CANCEL);

    this.off(cc.Node.EventType.MOUSE_ENTER);
    this.off(cc.Node.EventType.MOUSE_LEAVE);
    return this;
};

GM.pAdd = function (v1, v2) {
    return cc.v2(v1.x + v2.x, v1.y + v2.y);
};

GM.pSub = function (v1, v2) {
    return cc.v2(v1.x - v2.x, v1.y - v2.y);
};

cc.Node.prototype.bindTouchLocate = function(pxOrCcp, py) {
    this.on(cc.Node.EventType.TOUCH_START, function(event) {
        this.lBeganPos_ = this.getPosition();
        this.lBeganPoint_ = cc.v2(event.touch._point.x, event.touch._point.y); //  event.touch._point;
    }, this);

    this.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
        this.setPosition(GM.pAdd(this.lBeganPos_, GM.pSub(event.touch._point, this.lBeganPoint_)));
    }, this);

    this.on(cc.Node.EventType.TOUCH_END, function(event) {
        var pw = cc.winSize.width, ph = cc.winSize.height;
        if (this.getParent() != null) {
            var size = this.getParent().getContentSize();
            pw = size.width;
            ph = size.height;
        }
        console.log("Node Location: ", this.x, this.y, "Percentage:", this.x/pw, this.y/ph);
    }, this);

    // this._touchListener.swallowTouches = false;
    return this;
};

// 快速绑定点击函数 touchSilence-是否静默点击 Shield-是否有点击cdTime
cc.Node.prototype.quickBt = function(fn, touchSilence, Shield, music) {
    this.unbindTouch();
    
    this.lastClickTime = 0; // 上次点击时间
    this.clickCdTime = 300  // 毫秒
    this.canTouch = true;
    this.iHasTouchBegan = false;

    this.on(cc.Node.EventType.TOUCH_START, function(event) {
        // console.log("TOUCH_START");
        if (this.canTouch == false){
            return;
        }
        // if (GM.hasTouchDown == true) {
        //     return;
        // }

        this.iHasTouchBegan = true;
        // GM.hasTouchDown = true;

        this.BeganScale_ = this.getScale();
        this.BeganOpacity_ = this.opacity;
        if (!touchSilence) {
            this.setScale(this.BeganScale_*0.9);
            this.opacity = this.BeganOpacity_*0.9;
        };
    }, this);

    this.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
        if (this.canTouch == false) {
            return;
        }
        if (this.iHasTouchBegan == false) {
            return;
        }

        // GM.hasTouchDown = false;
        this.iHasTouchBegan = false;

        if (!touchSilence) {
            this.setScale(this.BeganScale_);
            this.opacity = this.BeganOpacity_;
        };
    }, this);

    this.on(cc.Node.EventType.TOUCH_END, function(event) {
        if (this.canTouch == false) {
            return;
        }
        if (this.iHasTouchBegan == false) {
            return;
        }

        // GM.hasTouchDown = false;
        this.iHasTouchBegan = false;

        if (!touchSilence) {
            this.setScale(this.BeganScale_);
            this.opacity = this.BeganOpacity_;
            if(audioData.get("_SettingAudio") == "open"){
                var fullPath = "audio/common/sound_button";
                if(music){
                    fullPath = "audio/cy/choseChar";
                }
                if (GM.hasLoadSound[fullPath] == null) {
                    cc.loader.loadRes(fullPath, cc.AudioClip, function (err, clip) {
                        cc.audioEngine.playEffect(clip, false);
                        GM.hasLoadSound[fullPath] = clip;
                    });
                } else {
                    cc.audioEngine.playEffect(GM.hasLoadSound[fullPath], false);
                }
            }
          
        
        };
        if (!Shield) {
            var now = (new Date()).getTime();
            if (now - this.lastClickTime < this.clickCdTime) {
                console.log("---屏蔽过快点击---");
                return;
            };
            this.lastClickTime = now;
        };
        fn && fn(event);
        // console.log("TOUCH_END");
    }, this);

    this.autoClick = function () {
        fn();
    }

    return this;
};

cc.Node.prototype.onClick = function(func,target,isNotScale,noSound){

    let button=this.getComponent(cc.Button);
    if(!button){
        button=this.addComponent(cc.Button);
        button.transition = cc.Button.Transition.SCALE;
    }
    
    if(isNotScale){
        button.transition = cc.Button.Transition.NONE;
    }else{
        button.zoomScale = 0.9
    }
    
    const CD_TIME = 20;
    let LAST_CLICK_TIME = 0;
    let closure = function(){
        let fullPath = "audio/common/sound_button";
        if(audioData.isStop()){
            if (GM.hasLoadSound[fullPath] == null) {
                cc.loader.loadRes(fullPath, cc.AudioClip, function (err, clip) {
                    cc.audioEngine.playEffect(clip, false);
                    GM.hasLoadSound[fullPath] = clip;
                });
            } else {
                    cc.audioEngine.playEffect(GM.hasLoadSound[fullPath], false);
            }
        }
        let now = new Date().getTime();
        if(now - LAST_CLICK_TIME < CD_TIME )
        {
            console.log("---屏蔽过快点击---");
            return;
        }
        
        LAST_CLICK_TIME = now;
        func.call(target);
    };
    this.off("click");
    this.on("click",closure,target);

    this.autoClick = function () {
        func.call(target);
    }
};

cc.Node.prototype.onTask = function(func,target,isNotScale,noSound){

    let button=this.getComponent(cc.Button);
    if(!button){
        button=this.addComponent(cc.Button);
        button.transition = cc.Button.Transition.SCALE;
    }
    
    if(isNotScale){
        button.transition = cc.Button.Transition.NONE;
    }else{
        button.zoomScale = 1
    }
    
    const CD_TIME = 20;
    let LAST_CLICK_TIME = 0;
    let closure = function(){
        if(cultivateMgr.culType != 2){
            return
        }

      
        let fullPath = "audio/common/Common_Panel_Dialog_Pop_Sound";
        if(audioData.isStop()){
            if (GM.hasLoadSound[fullPath] == null) {
                cc.loader.loadRes(fullPath, cc.AudioClip, function (err, clip) {
                    cc.audioEngine.playEffect(clip, false);
                    GM.hasLoadSound[fullPath] = clip;
                });
            } else {
                    cc.audioEngine.playEffect(GM.hasLoadSound[fullPath], false);
            }
        }
        let now = new Date().getTime();
        if(now - LAST_CLICK_TIME < CD_TIME )
        {
            console.log("---屏蔽过快点击---");
            return;
        }
        
        LAST_CLICK_TIME = now;
        func.call(target);
    };
    this.off("click");
    this.on("click",closure,target);

    this.autoClick = function () {
        func.call(target);
    }
};

cc.Node.prototype.onStart = function(func,target,isNotScale,noSound){

    // let button=this.getComponent(cc.Button);
    // if(!button){
    //     button=this.addComponent(cc.Button);
    //     button.transition = cc.Button.Transition.SCALE;
    // }
    
    // if(isNotScale){
    //     button.transition = cc.Button.Transition.NONE;
    // }else{
    //     button.zoomScale = 0.9
    // }
    
    const CD_TIME = 20;
    let LAST_CLICK_TIME = 0;
    let closure = function(){
        // let fullPath = "audio/common/Common_Panel_Dialog_Pop_Sound";
        // if(!noSound){
        //     if (GM.hasLoadSound[fullPath] == null) {
        //         cc.loader.loadRes(fullPath, cc.AudioClip, function (err, clip) {
        //             cc.audioEngine.playEffect(clip, false);
        //             GM.hasLoadSound[fullPath] = clip;
        //         });
        //     } else {
        //             cc.audioEngine.playEffect(GM.hasLoadSound[fullPath], false);
        //     }
        // }
        let now = new Date().getTime();
        if(now - LAST_CLICK_TIME < CD_TIME )
        {
            console.log("---屏蔽过快点击---");
            return;
        }
        
        LAST_CLICK_TIME = now;
        func.call(target);
    };
    this.off(cc.Node.EventType.TOUCH_START);
    this.on(cc.Node.EventType.TOUCH_START,closure,target);

    this.autoClick = function () {
        func.call(target);
    }
    return this;
};
/**
 * 加载远程服务器的图片
 * @param url 图片地址
 * @param type 图片后缀
 */
cc.Node.prototype.loadUrlImage = function(url,type){
    if (!url)
    {
        return;
    }
    // 没有合理的后缀，自动加上
    // if (!type && util.getSuffixName(url) != 'png' && util.getSuffixName(url) != 'jpg') {
    //     url = url + '.png'
    // }
    var fullName = type?url+type:url;
    if (GM.hasLoadImg[fullName]) {
        this.getComponent(cc.Sprite).spriteFrame = GM.hasLoadImg[fullName];
    } else {
        let address=type?{url: url, type: type}:url;
        cc.loader.load(address, (err, texture) => {
            if (err) console.error(err);
            let sprite = this.getComponent(cc.Sprite);
            if(sprite && texture) {
                var spriteFrame = new cc.SpriteFrame(texture);
                sprite.spriteFrame = spriteFrame;
                GM.hasLoadImg[fullName] = spriteFrame;
            }
        });
    }
    
};
/**
 * 设置节点上label组件的文本
 * @param str
 */
cc.Node.prototype.setLabel=function(str, maxTextWidth){
    this._lwLabel= this._lwLabel || this.getComponent(cc.Label);
    if (this._lwLabel) {
        if (str != null) {
            this._lwLabel.string = str;
            if (maxTextWidth) {
                const curWidth = this._lwLabel.width
                if (curWidth > maxTextWidth) {
                    const maxLen = str.length * maxTextWidth / curWidth
                    this._lwLabel.string = str.substr(0, maxLen) + "..."
                }
            }
        }
    }
};

cc.Node.prototype.setCountDown=function(time, callback){
    this._lwLabel=this._lwLabel || this.getComponent(cc.Label);
    if(this._lwLabel){
        this._lwLabel.unscheduleAllCallbacks()
        const addZero=function(num){
            return parseInt(num) < 10 ? '0' + num : num
        }
        const func = function() {
            time--
            if (time > 0) {
                const second = time % 60
                const minute = Math.floor(time / 60) %60
                const hour  = Math.floor(time /3600)
                this.string = addZero(hour)+':'+addZero(minute)+':'+addZero(second)
            } else {
                this.unschedule(func)
                callback()
            }
        }
        this._lwLabel.schedule(func, 1, cc.macro.REPEAT_FOREVER, 0);
    }
}
cc.Node.prototype.delayCall = function(func, delayTime, bRepeat) {
    var action = cc.sequence(
        cc.delayTime(delayTime),
        cc.callFunc(func)
    );
    if (bRepeat) {
        if (typeof bRepeat === "number") {
            action = action.repeat(bRepeat);
        } else {
            action = action.repeatForever();
        }
    };
    this.runAction(action);
};

cc.Node.prototype.delayRemove = function(delayTime) {
    var action = cc.sequence(
        cc.delayTime(delayTime),
        cc.removeSelf()
    );
    this.runAction(action);
};

cc.Node.prototype.runAc = function (action) {
    this.stopAllActions();
    cc.director.getActionManager().removeAllActionsFromTarget(this);
    this.runAction(action);
}
/**
 * 参考c#的String.format() ,使用方式 "ac{0}vb{1}b".format("m","n") => acmvbnb
 * @param args
 * @returns {String}
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments && arguments.length && arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

/**
 * 去除左右空格
 */
String.prototype.trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
    
String.prototype.ltrim = function(){
    return this.replace(/(^\s*)/g,"");
}
    
String.prototype.rtrim = function(){
    return this.replace(/(\s*$)/g,"");
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

/**
 * 通用数字显示
 * @param {Number} num 数字 
 * @param {Number} decimal 小数点位数 
 * 
 */

// 展示规则：数值最多显示四位数为前提，不足四位则在对应单位内保留一位小数（多余的舍去）

// 正确展示如下：
// 1111.99（显示1111）     111.59（显示111.5）    33556（显示33.5k）   
// 11161.54（显示11.1K）
Number.prototype.toBitString = function()
{
    let units = ["K","M","B","T","a","b","c","d","e","f","g","h","i","j","k","l","m","n"];
    //单位长度，根据单位长度计算出单位
    let numLen = 0;
    let numStr = this;
    if (!numStr) {
        return ""
    }
    while(numStr>9999)
    {
        numStr = numStr/1000;
        numLen ++;
    }

    numStr = numStr.toString();
    let findDot = numStr.indexOf(".")

    let length = 0 
    if(findDot == -1){
        length = numStr.length
    }else if(findDot >= 1 && findDot<= 3){
        length = 5
    }else if(findDot >= 4){
        length = 4
    }
    numStr = numStr.substr(0,length)

    //根据文本长度计算出后面补充的0的字符串
    let findDotAgain = numStr.indexOf(".")
    let strLength = numStr.length
    let zeroNumber = 0
    if(findDotAgain == -1){
        zeroNumber = 4 - strLength
    }else{
        zeroNumber = 5 - strLength
    }
    let getZeroStr = function(number){
        if(number==0){
            return ""
        }else if(number==1){
            return "0"
        }else if(number==2){
            return "00"
        }else if(number==3){
            return "000"
        }else if(number==4){
            return "0000"
        }
    }
    let zeroStr = getZeroStr(zeroNumber)
    if(findDotAgain == -1 && zeroNumber > 0){
        zeroStr = "." + zeroStr
    }

    //加上后面补充的0和单位
    if (numLen>0)
    {
        let bit = units[numLen-1]
        if(!bit)
        {
            cc.error("数字超过最大长度")
            bit = "?"
        }
        numStr += zeroStr
        numStr += bit;
    }

    return numStr;
}

/**
 * 游戏顶部数字显示
 * 特殊要求：显示指定位数小数
 * @param {Number} decimal 小数点位数 
 * 
 */
Number.prototype.toFixedString = function(decimal)
{
    let units = ["K","M","B","T","a","b","c","d","e","f","g","h","i","j","k","l","m","n"];
    let deci = decimal || 0
    let numLen = 0;
    let numStr = this;
    while(numStr>9999)
    {
        numStr = numStr/1000;
        numLen ++;
    }

    numStr = numStr.toString();
    
    if(numLen>0){
        numStr = Number(numStr).toFixed(deci)
    }else{
        numStr = Number(numStr).toFixed(0)
    }

    if (numLen>0)
    {
        let bit = units[numLen-1]
        if(!bit)
        {
            cc.error("数字超过最大长度")
            bit = "?"
        }
        numStr += bit;
    }

    return numStr;
}

/***********************Node*************************/
//禁用多点触摸

cc.Node.maxTouchNum = 1;
cc.Node.touchNum = 0;
var __dispatchEvent__ = cc.Node.prototype.dispatchEvent;
cc.Node.prototype.dispatchEvent = function (event) {
    if(this._canMultiTouch)
    {
        return __dispatchEvent__.call(this, event);
    }
    switch (event.type) {
        case cc.Node.EventType.TOUCH_START:
            if (cc.Node.touchNum < cc.Node.maxTouchNum) {
                cc.Node.touchNum++;
                this._canTouch = true;
                __dispatchEvent__.call(this, event);
            }
            break;
        case cc.Node.EventType.TOUCH_MOVE:
            if (!this._canTouch && cc.Node.touchNum < cc.Node.maxTouchNum) {
                this._canTouch = true;
                cc.Node.touchNum++;
            }

            if (this._canTouch) {
                __dispatchEvent__.call(this, event);
            }

            break;
        case cc.Node.EventType.TOUCH_END:
            if (this._canTouch) {
                this._canTouch = false;
                cc.Node.touchNum--;
                __dispatchEvent__.call(this, event);
            }
            break;
        case cc.Node.EventType.TOUCH_CANCEL:
            if (this._canTouch) {
                this._canTouch = false;
                cc.Node.touchNum--;
                __dispatchEvent__.call(this, event);
            }
            break;
        default:
            __dispatchEvent__.call(this, event);
    }
};

//多点触摸屏蔽时,如果被点的界面被销毁或隐藏会导致界面不能点击的问题
var onPostActivated = cc.Node.prototype._onPostActivated;
cc.Node.prototype._onPostActivated = function (active) {
    if(!active && this._canTouch){
        this._canTouch = false;
        cc.Node.touchNum--;
    }
    onPostActivated.call(this,active);
    this.emit("active",active)
};

var onPreDestroy = cc.Node.prototype._onPreDestroy;
cc.Node.prototype._onPreDestroy = function () {
    if(this._canTouch){
        this._canTouch = false;
        cc.Node.touchNum--;
    }

    this.emit("destory")
    onPreDestroy.call(this);
};
/***********************Node*************************/

//重写getChildByName 避免循环
var CHILD_ADDED = "child-added";
var CHILD_REMOVED = "child-removed";

var getChildByName = cc.Node.prototype.getChildByName;
cc.Node.prototype.getChildByName=function(name){
    if(!this._childByName)
    {    
        this._childByName = {}

        var locChildren = this._children;
        var len = 0 
        if (locChildren && locChildren.length) {
            len = locChildren.length
        }
        for (var i = 0; i < len; i++) 
        {
            var childName = locChildren[i]._name
            if(childName)
            {
                this._childByName[childName] = locChildren[i]
            }
        }

        this.on(CHILD_ADDED,child=>{
            if(child && child._name)
            {
                this._childByName[child._name] = child;
            }
        })
    
        this.on(CHILD_REMOVED,child=>{
            if(child && child._name && this._childByName[child._name] == child)
            {
                this._childByName[child._name] = undefined;
            }
        })

    }
    return this._childByName[name]
};

//重命名节点时处理
var setName = cc._BaseNode.prototype.setName;
cc.js.set(cc._BaseNode.prototype, "name", (function(name) {
    if(this._parent && this._parent._childByName)
    {
        var oldName = this._name;
        if(oldName && this._parent._childByName[oldName] === this)
        {
            this._parent._childByName[oldName] = undefined;
        }
        if(name)
        {
            this._parent._childByName[name] = this;
        }
    }
    setName.call(this,name);
}), false,true);


/***********************Node*************************/