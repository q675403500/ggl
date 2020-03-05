cc.Class({

    properties: {
        _hideList: {
            default: {},
        },

        _enabled:false,
    },

    //是否启用隐藏
    setEnable(flag)
    {
        this._enabled = flag;
    },

    isEnabled()
    {
        return this._enabled;
    },

    //添加隐藏项
    addHide(strPerfeb,strUI)
    {
        this._hideList[strPerfeb] = this._hideList[strPerfeb] || {};
        this._hideList[strPerfeb][strUI] = true;
    },

    getHideConfig(key)
    {
        return this._hideList
    },
});
