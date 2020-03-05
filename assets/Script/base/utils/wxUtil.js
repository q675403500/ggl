window.wxUtil = {};
/**
 * 微信转发分享
 * @param obj {title:分享标题,query:分享时带的字段,success:分享成功回调,fail:分享失败回调,imageUrl:转发显示图片的链接,显示图片长宽比是 5:4}
 */
wxUtil.shareToWx = function (obj, shareType) {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    util.showAlert("当前不是微信小游戏环境,无法分享")
    return;
  }
  console.log("触发分享=111111==============");

  // audioData.StopAllSound()
  // let shareInfo = webData.getShareInfo();
  if(Math.random()<0.5){
    obj.title = "比比看,谁更聪明!";//你能在3个错误以内解开这个数独吗？
    obj.imageUrl = "subDomain/guide1_image.png";
    obj.query = "";
  }else{
    obj.title = "你能在3个错误以内解开这个数独吗？";
    obj.imageUrl = "subDomain/guide2_image.png";
    obj.query = "";
  }
  

  let fail = obj.fail
  shareData.set("shareFailback", fail);
  obj.fail = function (res) {
    fail(res)
    console.log("没回调微信转发分享失败");
    shareData.set("shareCallback", null)
    shareData.set("shareFailback", null)
  }

  // obj.cancel = function (res) {
  //     console.log("回调分享取消");
  //     fail(res)
  //     shareData.set("shareCallback",null)
  //     shareData.set("shareFailback", null)
  // }

  let suc = obj.success
  shareData.set("shareCallback", suc)
  obj.success = function (res) {
    console.log("没回调微信转发分享成功");
    shareData.set("shareCallback", null)
    shareData.set("shareFailback", null)
    suc(res)
  }

  wx.showShareMenu({
    withShareTicket: true,
    success: () => {
      console.log("showShareMenu 成功");
      wx.shareAppMessage(obj);
    },
    fail: () => {
      // shareData.set("shareCallback", null)
      // shareData.set("shareFailback", null)
      cc.log("showShareMenu 失败");
    },
    cancel: () => {
      console.log("showShareMenu 取消转发");
      // shareData.set("shareCallback", null)
      // shareData.set("shareFailback", null)
    },
  });
};

/**
 * 初始化右上角转发
 */
wxUtil.initGameShare = function () {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    //初始化右上角分享
    wx.showShareMenu({
      withShareTicket: true
    });
    let shareInfo = wxData.getShareInfo();
    wx.onShareAppMessage(function () {
      return {
        title: shareInfo.title,
        // imageUrl: canvas.toTempFilePathSync({
        //     destWidth: 500,
        //     destHeight: 400
        // }),
        imageUrl: shareInfo.imageUrl,
        query: shareInfo.query,
        success (res) {
          console.log("转发成功!")
        },
        fail (res) {
          console.log("转发失败!")
        }
      }
    })
  }
};

/**
 * 微信登录
 * @param callback 成功返回
 */
wxUtil.loginWx = function (callBack, failcallBack) {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    wx.login({
      success (res) {
        cc.log("[获的用户code]------", res.code);
        // wxData.set("szName", res.openid);
        callBack(res);
      },
      fail () {
        if (failcallBack) {
          failcallBack()
        }
        console.log('登录失败！');
      }
    });
  } else {
    cc.log("当前不是微信小游戏环境,无法分享");
  }
};
/**
 * 获取当前用户信息
 * @param callBack 回调函数，res={userInfo:用户信息
 * 对象，不包含敏感信息,rawData:用于计算签名,signature:用于校验用户信息,encryptedData:完整用户信息,iv:加密算法的初始向量}
 */
wxUtil.getUserInfo = function (callBack, failcallBack) {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    wx.getUserInfo({
      withCredentials: true,
      lang: "zh_CN",
      success: function (res) {
        if (callBack) {
          callBack(res);
        }
      },
      fail: function () {
        cc.log("获取用户信息失败!");
        if (callBack) {
          failcallBack()
        }
      }
    })
  } else {
    cc.log("当前不是微信小游戏环境,无法获取微信信息");
  }
};
/**
 * 获得从分享链接进入时带的参数
 * @returns {*}
 */
wxUtil.getLaunchParam = function () {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    var arg = wx.getLaunchOptionsSync();
    cc.log("小程序启动参数", arg);
    return arg;
  }
  return {};
};
/**
 * 获得用户是否已授权
 * @param key 权限类型,eg:scope.userInfo
 * @param callback 获取成功后的回调函数
 */
wxUtil.getUserAuthInfo = function (key, callback) {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    wx.getSetting({
      success (res) {
        callback(res.authSetting[key]);
      },
      fail () {
        cc.log("获取用户授权信息失败");
      }
    })
  } else {
    cc.log("当前不是微信小游戏环境,无法分享");
  }
};

let adunitids = {
  "1": "adunit-40b7b06336c802f1", //第二次机会
  "2": "adunit-1f11b7d3a27353b8", //提示答案
}

/**
 * 显示广告
 * @param {Int}index 视频id (adunitids)
 * @param {Functoin}callback 成功回调
 * @param {Functoin}failcallback 视频加载失败回调(主动关掉,不会调用)
 */
wxUtil.fhowAD = function (index, callback, failcallback, _failback) {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    let id = adunitids[index]
    if (!id) {
      cc.error("not adunitid index = ", index)
      return
    }
    if (this._openingAD) {
      return
    }
    if (!wx.createRewardedVideoAd) {
      return
    }
    // cc.game.resume();
    this._openingAD = Date.now();
    this._adcallback = callback
    this._failcallback = failcallback
    let rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: id })
    uiFunc.openWaiting()
    rewardedVideoAd.show()
      .then(() => {
        uiFunc.closeWaiting()
        console.log("【激励视频拉起成功】...")
        // cc.game.pause();
        audioData.StopAllSound()
      })
      .catch(err => {
        console.log(err.errMsg, "【激励视频拉起失败】...")
        rewardedVideoAd.load()
          .then(() => {
            console.log("【激励视频重新拉起视频】...")
            rewardedVideoAd.show()
              .then(() => {
                console.log("【激励视频重新拉起视频成功】...")
                // cc.game.pause();
                audioData.StopAllSound()
              })
              .catch(() => {
                console.log("【激励视频再次拉起视频错误】");
                // this._failcallback && this._failcallback();
              })
          })
          .catch(() => {
            console.log("【激励视频再次加载视频错误】");
            // this._failcallback && this._failcallback();
          })
      })
    //后面的回调只要调用一次就行了
    if (this._hasCreatedAd) {
      return
    }

    this._hasCreatedAd = true
    rewardedVideoAd.onLoad(() => {
      uiFunc.closeWaiting()
      console.log("【激励视频广告加载成功】...")
      if (this._openingAD) {

      }
    })

    rewardedVideoAd.onError(err => {
      shareData.bCanVideo = false;
      uiFunc.closeWaiting()
      console.log("【激励视频广告加载失败】...", err)
      this._openingAD = false;
      audioData.ResumeAllSound()
      // cc.game.resume();
      this._failcallback && this._failcallback()
    })

    rewardedVideoAd.onClose(res => {
      uiFunc.closeWaiting()
      console.log("【激励视频广告关闭】...")
      audioData.ResumeAllSound()
      // cc.game.resume();
      // 用户点击了【关闭广告】按钮并且打开时间超过5秒
      // 小于 2.1.0 的基础库版本，res 是一个 undefined
      if ((res && res.isEnded || res === undefined) && this._openingAD && Date.now() - this._openingAD > 5000) {
        this._adcallback && this._adcallback()
      }
      else {
        console.log("【激励视频广告提前关闭】...", Date.now() - this._openingAD)
        // 播放中途退出，不下发游戏奖励
        // util.showAlert("领取失败，请您重试", 1.0);
        if (_failback) {
          _failback()
        }
      }
      this._openingAD = false;
    })

    return
  } else {
    if (wxData._isDev) {
      callback && callback()
    } else {
      failcallback();
    }
  }
};



wxUtil.createUserInfoButton = function (btn, callback) {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    return;
  }
  // let rect = new cc.Rect(280, -387, 100, 100)

  let btnSize = cc.size(btn.width, btn.height);
  let frameSize = cc.view.getFrameSize();
  let winSize = cc.director.getWinSize();

  let oldPos = btn.getPosition();
  // console.log("================2222222222222222==================",oldPos,btn.x,btn.y);
  oldPos = btn.parent.convertToWorldSpace(oldPos);
  oldPos = cc.Canvas.instance.node.convertToNodeSpace(oldPos);
  // console.log("================11111111111111==================",oldPos);
  //适配不同机型来创建微信授权按钮
  // let left = (winSize.height*0.5-btnSize.width*0.5)/winSize.width*frameSize.width;
  // let top = (winSize.height*0.5 - btnSize.height*0.5)/winSize.height*frameSize.height; //(oldPos.y-btnSize.height*0.5)/winSize.height*frameSize.height;
  // let width = btnSize.width/winSize.width*frameSize.width;
  // let height = btnSize.height/winSize.height*frameSize.height;
  let left = (oldPos.x - btnSize.width * 0.5) / winSize.width * frameSize.width;
  let top = (winSize.height - oldPos.y - btnSize.height * 0.5) / winSize.height * frameSize.height;
  let width = btnSize.width / winSize.width * frameSize.width;
  let height = btnSize.height / winSize.height * frameSize.height;
  // console.log("================11111111111111==================", left, top, width, height);
  var style = {
    left: left,
    top: top,
    width: width,
    height: height,
    // lineHeight: 40,
    // backgroundColor: '#ff0000',
    // color: '#ffffff',
    // textAlign: 'center',
    // fontSize: 16,
    // borderRadius: 4
  }

  if (!wx.createUserInfoButton) {
    return
  }

  let createUserInfoButton = wx.createUserInfoButton({
    type: 'text',
    text: "",
    //text: '获取用户信息',
    style: style
  });

  //{nickName: "暗影飘零", gender: 1, language: "zh_CN", city: "Fuzhou", province: "Fujian", …}
  var onCreateUserInfoButtonTap = function (res) {
    console.log("onCreateUserInfoButtonTap:" + JSON.stringify(res));
    if (res.errMsg !== "getUserInfo:ok") {
      util.showAlert("授权失败!", 1);
      return;
    } else {
      if (callback) {
        callback(res)
      }

      createUserInfoButton.hide();
      createUserInfoButton.destroy();
    }
  }.bind(this);

  createUserInfoButton.onTap(onCreateUserInfoButtonTap);
  createUserInfoButton.show();


  return createUserInfoButton;
};

wxUtil.getUserStorageDataSync = function (key) {
  cc.log("===========key : ", key);
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    if (typeof key === "string" && key.length > 0) {
      var fullKey = "Storage" + key;
      return wx.getStorageSync(fullKey);
    }
  }

  return null;
};

wxUtil.saveUserStorageDataSync = function (value, key) {
  cc.log("===========value, key : ", value, " ---- ", key);
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    if (typeof key === "string" && key.length > 0) {
      var fullKey = "Storage" + key;
      wx.setStorageSync && wx.setStorageSync(fullKey, value);
      return true;
    }
  }

  return false;
};

//offerId todo
wxUtil.pay = function (value, key) {
  // 游戏币
  wx.requestMidasPayment({
    mode: 'game',
    offerId: '',
    buyQuantity: 10,
    zoneId: 1,
    success () {
      // 支付成功
      cc.log("支付成功")
    },
    fail ({ errMsg, errCode }) {
      // 支付失败
      cc.log(errMsg, errCode)
    }
  })
};
wxUtil.startOtherGame = function (strAppID, path, callback) {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    console.log('当前不是微信小程序环境!')
    //callback(true)
    return
  }
  if (!wx.navigateToMiniProgram) {
    return
  }
  wx.navigateToMiniProgram({
    appId: strAppID,
    path: path,
    extraData: {},
    envVersion: 'release',

    success (res) {
      console.log(res, "[打开成功]")
      if (callback) {
        callback(true)
      }
    },
    fail (res) {
      console.log(res, "[打开失败]")
      if (callback) {
        callback(false)
      }
    },
  })
};



// 微信投诉按钮
var wxFeedbackBtn
wxUtil.createFeedbackButton = function (bImg, bLeft, bTop, bWidth, bHeight) {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    console.log('当前不是微信小程序环境!')
    return
  }
  if (wxFeedbackBtn) {
    wxFeedbackBtn.show()
  }
  const button = wx.createFeedbackButton({
    type: 'image',
    image: bImg,
    style: {
      left: bLeft,
      top: bTop,
      width: bWidth,
      height: bHeight,
    }
  })
  wxFeedbackBtn = button
}
wxUtil.feedbackButtonShow = function () {
  if (wxFeedbackBtn) {
    wxFeedbackBtn.show()
  }
}
wxUtil.feedbackButtonHide = function () {
  if (wxFeedbackBtn) {
    wxFeedbackBtn.hide()
  }
}


// // 打开微信小程序的客服会话(带发图版)
// wxUtil.openCustomerService_img = function (callBack) {
//   if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
//     console.log('当前不是微信小程序环境!')
//     return
//   }
//   wx.openCustomerServiceConversation({
//     showMessageCard: true,
//     sendMessageTitle: '我要领体力',
//     sendMessageImg: `${webData.get("hostDownload")}/miniGame/wyccy/img/ling.png`,
//     success: () => {
//       console.log('打开客服会话成功')
//       if (callBack) {
//         callBack(true)
//       }
//     },
//     fail: () => {
//       console.log('打开客服会话失败')
//       if (callBack) {
//         callBack(false)
//       }
//     },
//   })

// }

// 打开微信小程序的客服会话
wxUtil.openCustomerService = function (callBack) {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    console.log('当前不是微信小程序环境!')
    return
  }
  if (!wx.openCustomerServiceConversation) {
    return
  }
  wx.openCustomerServiceConversation({
    success: () => {
      console.log('打开客服会话成功')
      if (callBack) {
        callBack(true)
      }
    },
    fail: () => {
      console.log('打开客服会话失败')
      if (callBack) {
        callBack(false)
      }
    },
  })

}
/**
 * 小程序前台显示回调
 */
wxUtil.onShow = function (callback) {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    console.log('当前不是微信小程序环境!')
    return
  }
  wx.onShow((res) => {
    console.log('进入前台')
    callback(res)
  })
}
/**
 * 判断分享的是群还是个人
 */
wxUtil.isShareToGroup = function (res, callback) {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    console.log('当前不是微信小程序环境!')
    return
  }
  if (!res.shareTickets) {
    callback(false)
  } else {
    wx.getShareInfo({
      shareTicket: res.shareTickets[0],
      success: function (res) {
        callback(true)
      },
      fail: () => {
        callback(false)
      }
    })
  }
}


wxUtil.getSystemInfoSync = function () {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    window.systemInfo = wx.getSystemInfoSync()

    var phoneModel = window.systemInfo.model
    if (phoneModel) {
      if (phoneModel.length >= 8) {
        phoneModel = phoneModel.substr(0, 8)
        if (phoneModel == "iPhone 6") {
          window.bIphone6 = true
        }
      }
    }

    return window.systemInfo
  }
}

//使手机发生较短时间的振动（15 ms）
wxUtil.vibrateShort = function () {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    if (audioData.get("_SettingVibrate") == "close") {
      return
    }
    wx.vibrateShort({
      success: res => {
        console.log('震动成功');
      },
      fail: (err) => {
        console.log('震动失败');
      }
    })
  }
}

//使手机发生较长时间的振动（400 ms)
wxUtil.vibrateLong = function () {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    if (audioData.get("_SettingVibrate") == "close") {
      return
    }
    wx.vibrateLong({
      success: res => {
        console.log('震动成功');
      },
      fail: (err) => {
        console.log('震动失败');
      }
    })
  }
}

//设置屏幕常亮不休眠
wxUtil.setKeepScreenOn = function () {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    return
  }
  wx.setKeepScreenOn({
    keepScreenOn: true,
    success: res => {
      console.log('设置成功');
    },
  })
}

wxUtil.setKeepScreenOff = function () {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    return
  }
  wx.setKeepScreenOn({
    keepScreenOn: false,
    success: res => {
      console.log('设置成功');
    },
  })
}

//检测低端机
wxUtil.setLowMachine = function () {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    wxUtil.frameRate = 60
    return
  }
  if (window.systemInfo.benchmarkLevel < 2) {
    window.systemInfo.benchmarkLevel = 15;
  }
  // 低端机判断
  if (window.systemInfo.benchmarkLevel < 8) {
    wxUtil.frameRate = 30;
  } else {
    wxUtil.frameRate = 60;
  }setBannerAd
}

let bannerAdid = {
  "1": "adunit-2ec88e537fd1498d",     // 结算界面-胜利
  "2": "adunit-866d63dd70772ced",     // 结算界面-失败
}

var bannerlist = []
wxUtil.setBannerAd = function (index, node, isbottom) {
  if(wxData.isExamine()){
    return
  }
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    let id = bannerAdid[index]
    if (!id) {
      console.log("广告id不存在", id)
      return
    }
    if (!wx.getSystemInfoSync || !wx.createBannerAd) {
      console.log("不存在该方法");
      return
    }
    var createBanner = function (id, isbottom) {
      let winSize = wx.getSystemInfoSync();
      var wxban = wx.createBannerAd({
        adUnitId: id,
        style: {
            left: 0,
            top: winSize.screenHeight / 2 - 370,
            width: winSize.windowWidth - 20,
        }
      })
      // this.bannerad.hide()
      wxban.onLoad(() => {
        console.log('广告加载成功')
      })
      wxban.onError(() => {
        console.log('广告错误')
      })

      wxban.onResize(res => {
        if (isbottom) {
          wxban.style.top = wxban.style.top = winSize.windowHeight - wxban.style.realHeight
        }
        else {
          wxban.style.top = (1280 - 320) * winSize.screenWidth / 720 + (winSize.screenHeight - winSize.screenWidth * 1280 / 720) / 2;//winSize.windowHeight / 4 * 3;
        }
        wxban.style.left = winSize.screenWidth / 2 - wxban.style.realWidth / 2;
        // var isbottomNow = true;
        // if (bannerlist[index] && bannerlist[index].careNode) {
        //     if (bannerlist[index].careNode.isbottom == false) {
        //         isbottomNow = false;
        //     }
        // }
        // if (isbottomNow) {
        //     if (serControl_data.adPass) {
        //         wxban.style.top = winSize.windowHeight - wxban.style.realHeight;
        //     } else {
        //         wxban.style.top = winSize.windowHeight - wxban.style.realHeight - 3*640/winSize.screenHeight;
        //     }
        //     wxban.style.left = winSize.screenWidth / 2 - wxban.style.realWidth / 2;
        // } else {
        //     wxUtil.resetAdPos(index, node)
        // }
      })
      return wxban
    }
    if (!node) {
      let ids = bannerAdid[index]
      bannerlist[index] = createBanner(ids, isbottom)
      return
    }
    node = node.node || node
    node.bannerid = index
    wxUtil._bannernode = node
    var time = 10

    var fn = function () {
      var newban = createBanner(id, isbottom)
      if (wxUtil._bannernode.active) {
        console.log("替换新banner显示")
        newban.show()
      }
      if (null != bannerlist[node.bannerid]) {
        bannerlist[node.bannerid].destroy()
        bannerlist[index] = newban
      }
    }.bind(this)

    node.off("destory")
    node.off("active")
    node.on("destory", () => {
      if (null != bannerlist[node.bannerid]) {
        console.log('广告隐藏')
        bannerlist[node.bannerid].hide()
      }
    })

    node.on("active", active => {
      if (!active && null != bannerlist[node.bannerid]) {
        console.log('广告隐藏active')
        var oldban = bannerlist[node.bannerid]
        oldban.hide()
        oldban.destroy()
        let id = bannerAdid[node.bannerid]
        var newban = createBanner(id, isbottom)
        bannerlist[node.bannerid] = newban
      }
    })


    if (null != bannerlist[node.bannerid]) {
      console.log('打开界面广告隐藏')
      bannerlist[node.bannerid].hide()
    }

    if (bannerlist[index]) {
      console.log('打开界面广告显示')
      bannerlist[index].show()
      return
    }
    bannerlist[index] = createBanner(id, isbottom)
    bannerlist[index].show()
  }
}

/**
 * 微信向子域床底小弟
 * @param type 类型字段
 * @param value 传递的值
 */
wxUtil.postMessage = function (type, value) {
  if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
    return;
  }
  wx.postMessage({
    type: type,
    value: value
  })
}


wxUtil.initMat = function () {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    var options = wx.getLaunchOptionsSync();
    // mat.App.init({
    //     "appID": "500664882", //这里的数字只用于演示，实际使用的appID请询问运营或策划
    //     "eventID": "500664884",// 高级功能-自定义事件统计ID，配置开通后在初始化处填写
    //     "lauchOpts": options, //渠道分析,需在onLaunch方法传入options,如onLaunch:function(options){...}
    //     // "statPullDownFresh": true, // 使用分析-下拉刷新次数/人数，必须先开通自定义事件，并配置了合法的eventID
    //     "statShareApp": true, // 使用分析-分享次数/人数，必须先开通自定义事件，并配置了合法的eventID
    //     // "statReachBottom": true // 使用分析-页面触底次数/人数，必须先开通自定义事件，并配置了合法的eventID
    // })
    console.log("初始化数据===initMat", mat);

    mat.App.init({
      "appID": "500689322",
      "eventID": "500689323",
      "lauchOpts": options,
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true,
      "autoReport": true,
      "statParam": true,
      "ignoreParams": [],
    });
    // mat.Page.init();
  }
}


// 存储问题
wxUtil.setStorageSync = function (key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    wxUtil.setStorageSync(key, value);
  }
}
