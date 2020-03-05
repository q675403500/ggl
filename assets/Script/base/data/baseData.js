//事件通知
//  var this._dataEvent = cc.systemEvent;
var _saveKey = "";
var _startTime = Date.now();
var _saveAllKey = "_saveAllKey"
var _delAllKey = "_delAllKey"
var _clearAllKey = "_clearAllKey"


var _classIndex = 0;

cc.Class({
  properties: {
    _eventHandlers: {//所有的事件句柄保存,以便在隐藏的时候不做响应
      default: {}
    },
    //服务器数据
    _serverData: {
      default: {}
    },
    _dataTime: null,//数据保存到服务器的时间(本地时间)
    _serverTime: undefined,//服务器保存时间
    _hasInitServer: true,//是否读取过服务器(需要设为false,才会从服务器读取)
    _hasChangeData: true,//自动改变的数据是否有改变,没有改变则不上传
    _classIndex: 0,//如果同一个类里面,有多个实例,以这个来区分响应(但是保存本地跟上传服务器这个字段没用)
    _dataEvent: undefined,
    _debugDay: undefined,
    __fireAll: false,//是否set相同的值时,也会触发on
    _importantKey: undefined,//重要数据确保存档这个数据为最新
  },
  ctor () {
    // EventTarget.call(this);
    this._classIndex = _classIndex++
    this._dataEvent = new cc.EventTarget()
  },

  _getDay () {
    return this._debugDay || Math.floor(Date.now() / 24 / 3600 / 1000)//天
  },

  release () {
    this._dataEvent && this._dataEvent.removeAll()
    this._dataEvent = null
    for (let eventKey in this._eventHandlers) {
      if (this._eventHandlers[eventKey]) {
        for (let i in this._eventHandlers[eventKey]) {
          let handler = this._eventHandlers[eventKey][i]
          if (handler) {
            handler.off(eventKey)
          }
        }
        delete this._eventHandlers[eventKey]
      }
    }
  },
  //设置保存的关键字头.一般为用户名
  setSaveKey (key) {
    _saveKey = key;
  },

  //保存所有游戏数据,只要调用一次,所有其他继承于baseData的数据都会保存
  saveAllData () {
    cc.game.emit(_saveAllKey);
  },

  delAllData (saveKey) {
    cc.game.emit(_delAllKey, saveKey);
  },

  clearAllData () {
    cc.game.emit(_clearAllKey);
  },

  /**
   * 设置数据
   * 
   * @param {String} key 数据索引 
   * @param {Any} type 数据类型
   * @param {Any} value 数据值 
   */

  set (key, value, type) {
    value = type ? type(value) : value
    if (!this.__fireAll && this[key] === value && typeof value != "object") {
      return value
    }
    let lastValue = this[key];
    this[key] = value;
    this.onKeyChange(key, value, lastValue)

    return value
  },

  //与set相似,不过这里保存的值第二天就会失效
  setDailyValue (key, value, type) {
    let _day = this._getDay()
    key = _day + key
    return this.set(key, value, type)
  },
  /**
    * 发送监听事件
    * 不考虑值的变化
    * 甚至可以不传值
    * @param {String} key 数据索引 
    * @param {Any} type 数据类型
    * @param {Any} value 数据值 
    */
  send (key, value, type) {
    let valueSend = value || 1
    valueSend = type ? type(valueSend) : valueSend
    let lastValue = undefined
    this[key] = valueSend;
    this.onKeyChange(key, valueSend, lastValue)
  },

  onKeyChange (key, value, lastValue) {
    let eventKey = this.__cid__ + this._classIndex + key

    if (this._eventHandlers[eventKey]) {
      for (let i in this._eventHandlers[eventKey]) {
        let handler = this._eventHandlers[eventKey][i]
        if (handler)//&& handler.activeInHierarchy)
        {
          // if(handler.activeInHierarchy)
          // {
          handler.emit(eventKey, value, lastValue)
          // }
          // else
          // {
          //     if(handler._catchEvents)
          //     {
          //         handler._catchEvents[eventKey] = value
          //     }
          //     else
          //     {
          //         handler._catchEvents = {}
          //         handler._catchEvents[eventKey] = value
          //         //此消息突然不响应了,在extend里面重写了_onHierarchyChanged来响应
          //         handler.on("active",active=>{
          //             if(active)
          //             {
          //                 for(let key in handler._catchEvents)
          //                 {
          //                     handler.emit(key,handler._catchEvents[key],lastValue)
          //                 }

          //                 handler._catchEvents = {}
          //             }
          //         })
          //     }
          // }
        }
      }
    }
    if (this._dataEvent) {
      this._dataEvent.emit(eventKey, value, lastValue);
    }
  },
  //加数值,必须是数字类型
  add (key, value) {
    // if(typeof(this[key]) !== "number" || typeof(value) !== "number")
    // {
    //     cc.error("add  key or value is not a number :"+key , typeof(this[key]),value)
    //     return
    // }
    // this[key] = this[key] + value;
    // //不加此判断,在creator编辑器中会报错
    // if(this._dataEvent)
    // {
    //     this._dataEvent.emit(this.__cid__+key,value);
    // }
    return this.plus(key, value)
  },
  /**
   * 设置数据
   * 
   * @param {Object} values 数据对象
   */
  sets (values) {
    for (let k in values) {
      this.set(k, values[k]);
    }
  },

  /**
    * 结构体设置数据
    * @param {String} key1 数据索引 
    * @param {String} key2 数据索引
    * @param {String} key3 数据索引
    * @returns {Any}  数据值 
    */
  setWithKey (value, key1, key2, key3) {
    if (key3) {
      if (typeof (this[key1]) != undefined && typeof (this[key1][key2]) != undefined && typeof (this[key1][key2][key3]) != undefined) {
        this[key1][key2][key3] = value
        this.set(key1, this[key1])
      } else {
        cc.warn(key1 + '-' + key2 + '-' + key3 + '不存在')
      }
      return
    }
    if (key2) {
      if (typeof (this[key1]) != undefined && typeof (this[key1][key2]) != undefined) {
        this[key1][key2] = value
        this.set(key1, this[key1])
      } else {
        cc.warn(key1 + '-' + key2 + '不存在')
      }
      return
    }
    this.set(key1, value)
  },

  /**
    * 结构体获取数据
    * @param {String} key1 数据索引 
    * @param {String} key2 数据索引，可以为空
    * @param {String} key3 数据索引，可以为空
    * @returns {Any}  数据值 
    */
  getWithKey (key1, key2, key3) {
    if (key3) {
      if (typeof (this[key1]) != undefined && typeof (this[key1][key2]) != undefined) {
        return this[key1][key2][key3]
      } else {
        cc.warn(key1 + '-' + key2 + '不存在')
        return undefined
      }
    }
    if (key2) {
      if (typeof (this[key1]) != undefined) {
        return this[key1][key2]
      } else {
        cc.warn(key1 + '不存在')
        return undefined
      }
    }
    return this[key];
  },

  /**
   * 获取数据
   * 
   * @param {String} key 数据索引 
   * 
   * @returns {Any}  数据值 
   */
  get (key) {
    return this[key];
  },


  getDailyValue (key) {
    let _day = this._getDay()
    key = _day + key
    return this.get(key)
  },
  //浅拷贝
  getCopy (key) {
    let value = this[key];
    if (typeof (value) == "object") {
      return Object.assign(value)
    }

    return value
  },
  /**
   * 获取数据
   * 
   * @param {String} key 数据索引 
   * 
   * @returns {Any}  大数字转为字符串 
   */
  getNumString (key) {
    var num = this[key] - 0
    num = num.toLocaleString();
    num = num.toString().replace(/\$|\,/g, '');
    return num;
  },
  /**
   * 获取所有数据
   * 
   * @param {String} key 数据索引 
   * 
   * @returns {Object}  所有数据(这里直接返回整个对象,未找到只返回properties 的方法) 
   */
  getAll () {
    return this;
  },

  /**
   * 加减数据
   * 
   * @param {String} key 数据索引 
   * @param {int,floot} value 数据值，加减前最好要格式化parseInt,parseFloat确保不是其他类型
   */

  plus (key, value) {
    let oriValue = Number(this.get(key))
    let addValue = Number(value)
    if (!oriValue) {
      oriValue = 0
    }
    if (!addValue) {
      addValue = 0
    }

    let result = oriValue + addValue
    this.set(key, result)
    return result
  },

  //只会响应一次
  once (key, callback, handler) {
    if (typeof (callback) !== "function") {
      return
    }

    if (handler) {
      handler = handler.node || handler
      let eventKey = this.__cid__ + this._classIndex + key

      handler.once(eventKey, callback, handler);

      this._eventHandlers[eventKey] = this._eventHandlers[eventKey] || []
      let hasPushed = false
      for (let id in this._eventHandlers[eventKey]) {
        if (handler == this._eventHandlers[eventKey][id]) {
          hasPushed = true
          break;
        }
      }
      if (!hasPushed) {
        this._eventHandlers[eventKey].push(handler)
      }
    }
    else if (this._dataEvent) {
      this._dataEvent.once(this.__cid__ + this._classIndex + key, callback);
    }
  },
  /**
   * 数据监听
   * 
   * @param {String} key 数据索引 
   * @param {Function}} callback 回调,在首次调用或数据发生改变时会调用(数据不可为undefine) 
   * 
   */
  on (key, callback, handler) {
    if (typeof (callback) !== "function") {
      return
    }

    this.onChange(key, callback, handler)

    var value = this.get(key);
    if (value !== undefined) {
      callback(value);
    }
  },

  //不做初始化,只监听
  onChange (key, callback, handler) {
    if (typeof (callback) !== "function") {
      return
    }
    if (handler) {
      handler = handler.node || handler
      let eventKey = this.__cid__ + this._classIndex + key

      handler.on(eventKey, callback, handler);

      this._eventHandlers[eventKey] = this._eventHandlers[eventKey] || []
      let hasPushed = false
      for (let id in this._eventHandlers[eventKey]) {
        if (handler == this._eventHandlers[eventKey][id]) {
          hasPushed = true
          break;
        }
      }
      if (!hasPushed) {
        this._eventHandlers[eventKey].push(handler)
      }
    }
    else if (this._dataEvent) {
      this._dataEvent.on(this.__cid__ + this._classIndex + key, callback);
    }
  },

  off (key, callback, handler) {
    if (handler) {
      handler = handler.node || handler
      if (callback) {
        handler.off(this.__cid__ + this._classIndex + key, callback, handler);
      }
      else {
        handler.targetOff(this.__cid__ + this._classIndex + key);
      }
    }
    else if (this._dataEvent) {
      this._dataEvent.off(this.__cid__ + this._classIndex + key, callback);
    }
  },

  /**
   * 绑定数据到cc.Label,cc.EditBox上,显示的数值会实时变化
   * 
   * @param {String} key 数据索引 
   * @param {cc.Label}} lable 显示对应值的控件 
   * @param {Int}} iBaseNum 对应值为数字的时候,进行倍率 
   * @param {Int}} iType 1cc.Label,2cc.EditBox,3cc.RichText
   */
  bindLable (key, lable, iBaseNum, iType) {
    if (!cc.isValid(lable)) {
      return
    }
    var nodeLable
    if (iType) {
      if (iType == 1) {
        nodeLable = lable.getComponent(cc.Label)
      } else if (iType == 2) {
        nodeLable = lable.getComponent(cc.EditBox)
      } else if (iType == 3) {
        nodeLable = lable.getComponent(cc.RichText)
      }
    } else {
      nodeLable = lable.getComponent(cc.Label) || lable.getComponent(cc.EditBox) || lable.getComponent(cc.RichText)
    }

    if (!nodeLable) {
      cc.error("bindLable arg2 mush be a cc.Lable")
      return
    }
    this.off(key, lable);
    this.on(key, (text) => {
      if (typeof (text) == "number") {
        iBaseNum = iBaseNum || 1;
        text = text / iBaseNum;
      }
      else if (iBaseNum) {
        cc.error("bindLable value is not a number key = " + key)
      }
      if (!cc.isValid(lable)) {
        return
      }
      nodeLable.string = text;
    }, lable);
  },

  /**
   * 设置数据显示到文本控件上,只显示一次.不做实时刷新
   * 
   * @param {String} key 数据索引 
   * 
   */
  setLableText (key, lable) {
    var nodeLable = lable.getComponent(cc.Label) || lable.getComponent(cc.EditBox)
    if (!nodeLable) {
      cc.error("bindLable arg2 mush be a cc.Lable")
      return
    }
    var text = this.get(key);
    nodeLable.string = text;
  },

  /**
   * 设置数据
   * 值有在值为undefined的时候才会设置
   * @param {Object} values 数据对象
   */
  undefinedOrSet (key, value, type) {
    if (util.isNull(this.get(key))) {
      this.set(key, value, type)
    }
  },

  emptyOrSet (key, value, type) {
    let v = this.get(key)
    if (util.isNull(v) || v == "") {
      this.set(key, value, type)
    }
  },

  save (key) {
    if (!this.__cid__ || this.__cid__ == "") {
      cc.error("必须要有类名才能保存值")
      return
    }

    try {

      var value = this.get(key)
      if (value === null || value === undefined || value === "undefined" || value === "null") {
        cc.sys.localStorage.removeItem(_saveKey + this.__cid__ + key);
      }
      else {
        cc.sys.localStorage.setItem(_saveKey + this.__cid__ + key, JSON.stringify(value));
      }
    }
    catch (e) {
      console.log("保存游戏数据失败")
    }

    return value
  },

  read (key, def) {
    if (!this.__cid__ || this.__cid__ == "") {
      cc.error("必须要有类名才能保存值")
      return
    }
    var value
    // if(cc.sys.platform === cc.sys.WECHAT_GAME)
    // {
    //     value = wxUtil.getUserStorageDataSync(_saveKey+this.__cid__+key);
    // }
    // else
    // {
    value = cc.sys.localStorage.getItem(_saveKey + this.__cid__ + key);
    // }
    if (value !== "" && value !== undefined)//微信读取不存在的数据默认为"",而百度为undefined 
    {
      try {
        value = JSON.parse(value)
        if (value === null || value === undefined) {
          value = def
        }
      }
      catch (e) {
        cc.error(key + " " + value)
        cc.error(e)
      }
    }
    else {
      value = undefined
    }
    return value
  },

  del (key, savekey) {
    cc.sys.localStorage.removeItem((savekey || _saveKey) + this.__cid__ + key);
  },
  /**
      * 自动存取数据,目前只支持String类型,第一次调用的时候会读取配置.后面会自动保存
      * 
      * @param {String} key 数据索引 
      * @param {String} onlyLocal 只保存在本地
      * 
      */
  autoReadSave (key, onlyLocal) {
    this.autoKey = this.autoKey || {}
    this.onlyLocal = this.onlyLocal || {}
    if (onlyLocal) {
      this.onlyLocal[key] = true;
    }

    let isFirst = true;
    // let saveTime = 0
    let value = this.read(key)
    if (value !== undefined) {
      this.set(key, value)
    }
    else {
      isFirst = null;
    }

    if (this.autoKey[key]) {
      return;
    }
    this.autoKey[key] = true;

    this.on(key, function (text) {
      if (isFirst) {
        isFirst = null;
        return;
      }
      // let now = Date.now()
      // //设置存储CD
      // if(now - saveTime < 15000)
      // {
      //     return
      // }
      // saveTime = now
      this.save(key)
      if (this.autoKey[key] && !this.onlyLocal[key] && key != "_dataTime" && key != "_serverTime") {
        this._hasChangeData = true;
      }
    }.bind(this));

    cc.game.on(cc.game.EVENT_HIDE, () => {
      this.save(key)
    });

    cc.game.on(_saveAllKey, () => {
      this.save(key)
    });

    cc.game.on(_delAllKey, (arg) => {
      this.del(key, arg)
    });

    cc.game.on(_clearAllKey, (arg) => {
      this.set(key, undefined)
    });


    if (!this._hasInitServer && !onlyLocal) {
      this._hasInitServer = true
      var datatime = this.autoReadSave("_serverTime")
      this.autoReadSave("_dataTime")
      //只有本地没有数据,或本地数据保存的时间超过12小时才做服务器读取
      if (webData && webData._lastSaveTime) {
        webData.onChange("_lastSaveTime", (lastSaveTime) => {
          if (datatime && lastSaveTime != 2 && lastSaveTime <= datatime) {
            console.log(this.__cid__, "本地有较新数据,不做服务器读取")
          }
          else {
            loginData.on("userID",
              () => {
                setTimeout(() => {
                  this.readServer()
                }, 0.01)
              })
          }

        })

        cc.game.on(cc.game.EVENT_HIDE, () => {
          this.saveToServer()
        });
      }
      else {
        loginData.on("userID",
          () => {
            setTimeout(() => {
              this.readServer()
            }, 0.01)
          })

        cc.game.on(cc.game.EVENT_HIDE, () => {
          this.saveToServer()
        });
        cc.error("webData 需要加上_lastSaveTime,参照通用")
      }

    }

    return value
  },

  autoReadSaveDaily (key, onlyLocal) {
    let _day = this._getDay()
    key = _day + key
    return this.autoReadSave(key, onlyLocal)
  },

  getIsAutoSave (key) {
    return this.autoKey && this.autoKey[key]
  },

  storeValue (key) {
    try {
      let value = this.get(key)
      value = JSON.stringify(value)
      cc.sys.localStorage.setItem(key, value);
    }
    catch (e) {
      console.log("保存游戏数据失败")
    }
  },

  readValue (key) {
    let value = cc.sys.localStorage.getItem(key);
    try {
      value = JSON.parse(value)
    }
    catch (e) {
    }
    return value
  },


  saveToServer () {
    if (_saveKey == "temKey") {
      return
    }
    if (gameData.get("isNewUser") && Date.now() - _startTime < 5000) {
      cc.log("首次登录时间少于5秒分钟,不做保存", Date.now() - _startTime)
      return
    }

    if (!this._hasChangeData) {
      return
    }

    if (this.autoKey && Object.keys(this.autoKey).length > 1) {
      let datas = {}
      for (let key in this.autoKey) {
        let value = this.get(key)
        let onlyLocal = this.onlyLocal && this.onlyLocal[key]
        if (value !== undefined && value !== null && !onlyLocal) {
          datas[key] = value;
        }
      }
      if (webData && webData.saveData) {
        let len = Object.keys(datas).length
        if (len <= 0) {
          return
        }
        if (len == 1 && this.get("_dataTime")) {
          return
        }
        let now = Date.now()
        console.log("上传服务器", this.__cid__)
        this.set("_dataTime", now)
        webData.saveData(this.__cid__, JSON.stringify(datas), (saveTime) => {
          this.set("_serverTime", saveTime)
        })
      }
      else {
        cc.error("上传服务器接口未实现")
      }
    }

    this._hasChangeData = false
  },

  readServer () {
    if (webData && webData.getData) {
      let _dataTime = this.get("_dataTime")
      webData.getData(this.__cid__, (res) => {
        let serverData
        try {
          serverData = res && JSON.parse(res)
        }
        catch (e) {
          cc.error(e)
        }

        if (serverData) {
          if (this._importantKey && serverData[this._importantKey]) {
            if (!this.get(this._importantKey) || Number(serverData[this._importantKey]) > Number(this.get(this._importantKey))) {
              console.log(this.__cid__, "更新为服务器数据1")
              console.log(serverData)

              this.sets(serverData)
              this._hasChangeData = false
              return
            }
            else if (this.get(this._importantKey) && Number(serverData[this._importantKey]) < Number(this.get(this._importantKey))) {
              console.log(this.__cid__, "服务器数据为旧的,不做更新1")
              return
            }
          }

          if (_dataTime >= serverData._dataTime) {
            console.log(this.__cid__, "服务器数据时间为旧的,不做更新2")
            return
          }
          console.log(this.__cid__, "更新为服务器数据2")
          console.log(serverData)

          this.sets(serverData)
          this._hasChangeData = false
        }
      })
    }
    else {
      cc.error("服务器下载接口未实现")
    }
  },

  //设置最要数据,读取服务器存档时,会优先使用此数据较大的存档
  setImportantKey (key) {
    this._importantKey = key
  }
});