cc.Class({
    extends: baseData,
    name: "shareData",
  
    properties: {
      bCanShare: true,             //  是否可以分享
      bCanVideo: true,            //  是否可以看视频
      iCurShareTime: undefined,    //  当前分享的时间
      shareCD: 3,                  //  分享的CD时间
      iFreeNum: 1,                //  既无法【看视频】又不能【分享】，则点按钮后，前n次奖励直接给，后n次无法再领取。N需要支持实时可调整。
      iFirstTodayShare: 0,
      bTriggerVideo: false,       // 是否触发看视频
      shareSucPer: 75,             // 分享成功机率(没有回调情况下的概率)
      shareCallback: null,         // 分享回调
      shareFailback: null,         // 分享失败回调
      bCanSharePer: 100,            // 分享的概率，剩余就是看视频的概率
      isCancel: false,            // 是否取消分享
      pxgkschannel: null
    },
  
    ctor () {
      if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        wx.onShow((res) => {
          setTimeout(() => {
            let callback = this.get("shareCallback");
            let failback = this.get("shareFailback");
  
            if (callback && typeof (callback) == "function") {
              if (this.isCancel) {
                this.isCancel = false
                if (failback) {
                  failback()
                } else {
                //   util.showAlert('分享失败');
                }
                this.set("shareCallback", null)
                this.set("shareFailback", null)
                return
              }
              var iCurTime = (new Date()).getTime();
              if (iCurTime - this.iCurShareTime >= this.shareCD * 1000) {
                // 分享没有回调信息时,时间超过分享CD时间默认是分享成功
                // if (this.isShareSuc()) {
                callback({ shareTickets: ["1"] })
                // } else if (failback) {
                // failback()
                // } else {
                // util.showAlert("分享失败，请重新分享");
                // }
              } else {
                // 分享失败
                if (failback) {
                  failback()
                } else {
                //   util.showAlert("分享失败，请重新分享");
                }
              }
              // this.set('iFirstTodayShare', 1);
            }
            this.set("shareCallback", null)
            this.set("shareFailback", null)
          }, 500)
        });
        wx.onHide((dt) => {
       
        });
      }
    },

  
  shareOrLookAd() {
    if(wxData.isExamine()){
      return 0//白给
    }
    // if(!this.bCanShare && !this.bCanVideo){
    //   return 0//白给
    // }
    if(this.bCanVideo){
      return 2
    }
    if(this.bCanShare){
      return 1
    }
    return 0//白给
  },
  
  videoToWx(_callback,_failback,videoType){
    this.watchVide(videoType,_callback,_failback,()=>{
      if(this.bCanShare){
          console.log("视频加载失败,调用分享")
          this.shareToWx(_callback,_failback)
      }else{
          _callback && _callback();
          console.log("视频加载失败")
      }
    })
  },
  
    shareToWx (shareType, _callback, _failback) {
      if (!cc.sys.platform === cc.sys.WECHAT_GAME) {
        _callback && _callback();
        return;
      }
    //   if (wxData.isExamine()) {
    //     _callback && _callback();
    //     return;
    //   }
      this.isCancel = false;
      if (!this.bCanShare) {
        _callback && _callback();
        return;
      }
      if (!shareType) {
        shareType = 1
      }
      this.iCurShareTime = (new Date()).getTime();
      // gameData.plus('iShareCount',gameData.get('iShareCount')+1);
      wxUtil.shareToWx({
        title: "来玩数独",
        success: (res) => {
          if (!this.isCancel) {
            console.log("分享成功");
            _callback();
          }
        },
        fail: () => {
          console.log("分享失败，请重新分享");
          if (_failback) {
            _failback();
          } else {
            util.showAlert("分享失败，请重新分享")
          }
        },
        cancel: (res) => {
          console.log("用户取消了分享");
          this.isCancel = true;
          this.set("shareFailback", _failback)
        }
      }, shareType)
    },

     /**
     *  是否在看视频cd冷却时间内
     */
    getIsLockWatchVideo(){
      return new Date().getTime() - this.watchVideoTime < this.getVideoCDTime();
  },

  //观看视频冷却时间(毫秒)
  getVideoCDTime(){
      return 10 * 1000;
  },

  watchVide (videoType,_callback,_sharecallback,bShare,_failback) {
      // if (wxData.isExamine()) {
      //     _callback && _callback();
      //     return;
      // }
      if(this.getIsLockWatchVideo()){ //在看广告cd时间内
          if (!bShare) {
              util.showAlert("不能频繁看视频，请" +  Math.ceil((this.getVideoCDTime()  - ((new Date()).getTime() - this.get("watchVideoTime"))) /1000) +"秒后重试");
              return;
          } else {
              _sharecallback && _sharecallback()
              return;
          }
      }
      if (this.bCanVideo) {
          wxUtil.fhowAD(videoType,()=>{
              _callback && _callback();
              
              this.set("watchVideoTime", (new Date()).getTime());
          },_sharecallback, _failback);
      } else {
          _sharecallback && _sharecallback();
      }
  },

  
    // 分享成功
    isShareSuc () {
      let _random = (min, max) => {
        return Math.round(Math.random() * (max - min)) + min;
      }
      let per = _random(1, 100);
      return per <= this.get("shareSucPer");
    },
  
   
  
  });