/** 音频路径 */
const AUDIO_PATH = "audio/";
var Zones = cc.Enum({
    Main: 1,
    // Loading: 2,
    Instance: 2, //挑战
    // Roller: 4,
    Maoxian:3 //冒险
});

var csvData = require("csvData")

cc.Class({
    extends: csvData,
    name: "audioData",
    properties: {
        _fileName: {
            override: true,
            default: "video",//.csv文件名
        },

        _clipBuffer: {
            type: Map,
            default: null
        },

        _playEffetTime: 0,

        _InInstanceZones: Zones.Main,               //在场景中，1、主界面，2、征战，3、loading界面，4、转盘中

        _SettingAudio: "open",                      //设置界面音乐开关     open开close关
        _SettingVibrate: "open",                    //设置界面震动开关
        _SettingTimeout: "open",                    //设置屏幕超时开关
        _SettingHighlightAreas: "open",             //设置区域提示开关
        _SettingHighlightDuplicates:"open",         //设置高亮数字开关
        _StopAllSound: false,
    },

    ctor() {
        this._cdMap = {}
        this._clipBuffer = new Map();
    },

    //----------设置界面按钮------------//
    // SettingMusic(isOpen) {
    //     this.set("_SettingMusic",isOpen)
    //     if (isOpen == "open") {
    //         this.playBGM()
    //     } else {
    //         this.stopBGM();
    //     }
    // },

    SettingVibratet(isOpen) {
        this.set("_SettingVibrate",isOpen)
    },

    SettingAudio(isOpen) {
        this.set("_SettingAudio",isOpen)
    },

    SettingTimeout(isOpen) {
        this.set("_SettingTimeout",isOpen)
        this.playTimeout()
    },

    SettingHighlightAreas(isOpen) {
        this.set("_SettingHighlightAreas",isOpen)
    },

    SettingHighlightDuplicates(isOpen) {
        this.set("_SettingHighlightDuplicates",isOpen)
    },

    //----------场景切换---------------//
    //切换到匹配场景中
    SwitchToInstanceZones() {
        this._InInstanceZones = Zones.Instance
        cc.audioEngine.stopAllEffects();
        // this.playBGM()
    },
    //切换到冒险场景中
    SwitchToMaoxianZones() {
        this._InInstanceZones = Zones.Maoxian
        cc.audioEngine.stopAllEffects();
        // this.playBGM()
    },
    //切换到主场景
    SwitchToMainZones() {
        this.undefinedOrSet('_SettingAudio','open')
        this.undefinedOrSet('_SettingVibrate','open')
        this.undefinedOrSet('_SettingTimeout','open')
        this.undefinedOrSet('_SettingHighlightAreas','open')
        this.undefinedOrSet('_SettingHighlightDuplicates','open')
        this._InInstanceZones = Zones.Main
        cc.audioEngine.stopAllEffects();
        this.playTimeout()
        // this.playBGM()
    },
    //切换到加载界面
    SwitchToLoadingZones() {
        cc.audioEngine.stopAllEffects();
        this.stopBGM()
    },
    //切换到抽奖界面
    SwitchToLuckyRollerZone() {
        cc.audioEngine.stopAllEffects();
        this.stopBGM()
    },

    // 切换回原来的场景中
    SwitchOriginalZone () {
        if (this._InInstanceZones && this._InInstanceZones == Zones.Main) {
            this.SwitchToMainZones();
        } else if (this._InInstanceZones && this._InInstanceZones == Zones.Instance) {
            this.SwitchToInstanceZones();
        }else if (this._InInstanceZones && this._InInstanceZones == Zones.Maoxian) {
            this.SwitchToMaoxianZones();
        }
    },
    //停止所有声音和音效
    StopAllSound() {
        this._StopAllSound = true
        cc.game.pause()
        this.stopBGM()
    },
    //恢复所有声音和音效
    ResumeAllSound() {
        this._StopAllSound = false
        cc.game.resume()
        this.playBGM()
    },

    //----------震动---------------//
    playVibrate(){
        if (this._SettingVibrate == "close") {
            return
        }
        wxUtil.vibrateShort()
    },
    //----------超时---------------//
    playTimeout(){
        if (this._SettingTimeout == "close") {
            wxUtil.setKeepScreenOff()
            return
        }
        wxUtil.setKeepScreenOn()
    },
  
    playHighlightAreas(){
        return this._SettingHighlightAreas
    },
    
    playHighlightDuplicates(){
        return this._SettingHighlightDuplicates
    },
    //----------播放声音---------------//

    //播放背景音乐 现在只有一个,后期再做多种切换
    playBGM() {
        if (this._SettingAudio == "close") {
            return
        }
        var ibackIndex = 1;
        //只有主界面有音乐
        if(this._InInstanceZones != Zones.Main && this._InInstanceZones != Zones.Instance && this._InInstanceZones != Zones.Maoxian) {
            return
        }
        if(this._InInstanceZones == Zones.Instance) {
            ibackIndex = 16
        }
        if(this._InInstanceZones == Zones.Maoxian){
            ibackIndex = 2
        }
        this.stopBGM()
        // let path = ""

        // cc.loader.loadRes(path, (err, data) => {
        //     if (err) {
        //         cc.error(err.message || err);
        //         return;
        //     }
        //     this._clipBuffer.set(path, data);
        //     let id = cc.audioEngine.playMusic(data, true);
        // });
    },
    stopBGM() {
        cc.audioEngine.stopMusic();
    },
    

    isStop(){
        if (this._StopAllSound) {
            return false
        }
        if (this._SettingAudio == "close") {
            return false
        }
        return true
    },


    /**
     * 游戏播放音效统一接口
     * @param fullPath 路径
     * @param force 如果为true，则忽略cd时间限制强制播放
     * 大招等主要音效不考虑CD限制，应该强制播放
     */
    playSoundByPath(fullPath, force, id) {
        if (!fullPath) {
            return;
        }
        if (this._StopAllSound) {
            return
        }
        if (this._SettingAudio == "close") {
            return;
        }

        let now = Date.now()

        if (!force) {
            // 添加播放公共CD ms    
            if (now - this._playEffetTime < 200) {
                 util.log("播放跳过")
                return
            }
        }
        this._playEffetTime = now
        var clip = this._clipBuffer.get(fullPath);
        if (clip) {
            cc.audioEngine.playEffect(clip, false);
            return;
        }
        cc.loader.loadRes(fullPath, cc.AudioClip, (err, clip) => {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            this._clipBuffer.set(fullPath, clip)
            cc.audioEngine.playEffect(clip, false);
        });
    },

    //------------------------------游戏中的接口------------------------------------   
    // //播放声音举例
    // playEscape() {
    //     if (this._InInstanceZones != Zones.Main) {
    //         return
    //     }
    //     this.playSoundByID(1, true);
    // },
});