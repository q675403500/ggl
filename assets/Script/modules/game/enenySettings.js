var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,
    properties: {
    },
    
    start () {
        var iHeight = cc.winSize.height;
        this.node_top.y = iHeight/2
     
        this.node_main.y = -(1555 - iHeight)/2
        this.initColor()
        this.addEvents();
        this.initButonUI();
    },

    init(entity){
        this.node.parent = GM.hallUI.node_Top
        GM.hallUI.node_main.stopAllActions()
        GM.hallUI.node_main.runAction(cc.sequence(cc.moveTo(0.5,-200,0),cc.callFunc(function () {
            
        }.bind(this))))
        this.node.runAction(cc.sequence(cc.moveTo(0.5,0,0),cc.callFunc(function () {
            
        }.bind(this))))
    },

    
    initColor(){
        this.top_bg.color = webData.color
    },
  
    addEvents: function () {
        this.btn_back.quickBt(function () {
            GM.hallUI.node_main.stopAllActions()
            GM.hallUI.node_main.runAction(cc.sequence(cc.moveTo(0.5,0,0),cc.callFunc(function () {
                
            }.bind(this))))
            this.node.stopAllActions()
            this.node.runAction(cc.sequence(cc.moveTo(0.5,720,0),cc.callFunc(function () {
                entityMgr.enenySettingsPool.put(this.node)
            }.bind(this))))
            
        }.bind(this));

  


        this.btn_vibrate.onStart(function () {
            this.switchHandle("vibrate")
        }.bind(this));

        this.btn_settings.onStart(function () {
           
        }.bind(this));

        this.btn_FAQ.onStart(function () {
           
        }.bind(this));

        this.btn_support.onStart(function () {
           
        }.bind(this));

        this.btn_f.quickBt(function () {
           
        }.bind(this));
        
        this.btn_t.quickBt(function () {
           
        }.bind(this));

        this.btn_i.quickBt(function () {
           
        }.bind(this));

        this.btn_Terme.quickBt(function () {
           
        }.bind(this));

        this.btn_Privacy.quickBt(function () {
           
        }.bind(this));
    },

    initButonUI(){
        this.vibrateStatus = audioData.get("_SettingVibrate") == "open" ? true : false;
        //初始化开关状态显示
        this.switchShow(this.vibrateStatus, this.btn_vibrate);
    },

     // 开关显示
    switchShow (status, node) {
        let anim = node.getComponent(cc.Animation)
        if (status) {
            var animState = anim.play("button")
            animState.wrapMode = cc.WrapMode.Normal;
        } else {
            var animState = anim.play("button")
            animState.wrapMode = cc.WrapMode.Reverse;
        }
    },

    // 开关操作
    switchHandle (event) {
        audioData.playVibrate()
        switch (event) {
        case 'audio':
            if (this.audioStatus) {
            // 关闭背景音乐处理
                this.audioStatus = false;
                audioData.SettingAudio("close")
            } else {
            // 开启背景音乐处理
                this.audioStatus = true;
                audioData.SettingAudio("open")
            }
            this.switchShow(this.audioStatus, this.btn_audio);
            break;
        case 'vibrate':
            if (this.vibrateStatus) {
            // 关闭音效处理
                this.vibrateStatus = false;
                audioData.SettingVibratet("close")
            } else {
            // 开启音效处理
                this.vibrateStatus = true;
                audioData.SettingVibratet("open")
            }
            this.switchShow(this.vibrateStatus, this.btn_vibrate);
            break;
        case 'timeout':
            if (this.timeoutStatus) {
                this.timeoutStatus = false; // 关闭震动处理
                audioData.SettingTimeout("close")
            } else {
                this.timeoutStatus = true;// 开启震动处理
                audioData.SettingTimeout("open")
            }
            this.switchShow(this.timeoutStatus, this.btn_timeout);
            break;
        case 'highlightAreas':
            if (this.highlightAreasStatus) {
                this.highlightAreasStatus = false; // 关闭震动处理
                audioData.SettingHighlightAreas("close")
            } else {
                this.highlightAreasStatus = true;// 开启震动处理
                audioData.SettingHighlightAreas("open")
            }
            this.switchShow(this.highlightAreasStatus, this.btn_highlightAreas);
            break;
        case 'highlightDuplicates':
            if (this.highlightDuplicatesStatus) {
                this.highlightDuplicatesStatus = false; // 关闭震动处理
                audioData.SettingHighlightDuplicates("close")
            } else {
                this.highlightDuplicatesStatus = true;// 开启震动处理
                audioData.SettingHighlightDuplicates("open")
            }
            this.switchShow(this.highlightDuplicatesStatus, this.btn_highlightDuplicates);
            break;
        }
    },
  });
  