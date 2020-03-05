// require("extend")
require("wxUtil")
//工具类
var util = {};
util.init = function () {
  let initSingleColor = function () {
    let path = "img2/common/singleColor";
    cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
      GM.hasLoadImg[path] = spriteFrame;
    });
  }
  initSingleColor();
  window.log = console.log.bind(console);
}


//生成随机正整数
util.getRandom = function (n){
	return Math.floor(Math.random()*n+1)
}

util.getUsNum = function (n){
  let value = ""
  while(n > 1){
    let x = n%1000
    n = Math.floor(n/1000)
    if(x<10 && n>=1){
      if(value == ""){
        value = `00${x}`
      }else{
        value = `00${x},${value}`
      }
    }else if(x<100 && n>=1){
      if(value == ""){
        value = `0${x}`
      }else{
        value = `0${x},${value}`
      }
    }else{
      if(value == ""){
        value = `${x}`
      }else{
        value = `${x},${value}`
      }
    }
    
  }
  return value
}


util.log = function () {

  var mstr = "";
  for (var nArguNum in arguments) {
    if (nArguNum == 0) {
      mstr += arguments[nArguNum];
    } else {
      mstr += " ; " + arguments[nArguNum];
    }
  }
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    console.log(mstr)
  } else {
    cc.log(mstr)
  }
};
util.justConsoleLog = function () {

  var mstr = "";
  for (var nArguNum in arguments) {
    if (nArguNum == 0) {
      mstr += arguments[nArguNum];
    } else {
      mstr += "," + arguments[nArguNum];
    }
  }
  mstr += "\n"
  return mstr
};

// 本地测试的时候开启来为True 不要上传到svn
util.isChangweiTest = false
// 屏幕打印函数  一般调试的时候用  往上飘一会  util.mlog("打印")
util.PrintPosDiff = 15;

util.loadSp = function (parent, path, func) {
  if (GM.hasLoadImg[path]) {
    var node = new cc.Node("loadSp");
    //调用新建的node的addComponent函数，会返回一个sprite的对象 
    var sprite = node.addComponent(cc.Sprite);
    //给sprite的spriteFrame属性 赋值  
    sprite.spriteFrame = GM.hasLoadImg[path];
    parent.addChild(node);
    if (func != null)
      func(node);
  } else {
    cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        cc.error(err.message || err);
        return;
      }
      if (!parent) {
        return;
      }
      // cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
      var node = new cc.Node("loadSp");
      //调用新建的node的addComponent函数，会返回一个sprite的对象 
      var sprite = node.addComponent(cc.Sprite);
      //给sprite的spriteFrame属性 赋值  
      sprite.spriteFrame = spriteFrame;
      GM.hasLoadImg[path] = spriteFrame;
      parent.addChild(node);
      if (func != null)
        func(node);
    })
  }
};


util.loadPrefab = function (path, func, bNew) {

  if (GM.hasLoadPrefab[path]) {

    if (func != null) {
      if (bNew) {
        func(cc.instantiate(GM.hasLoadPrefab[path]), true);
      } else {
        func(GM.hasLoadPrefab[path], false);
      }
    }
  } else {
    cc.loader.loadRes(path, cc.Prefab, function (err, prefab) {

      if (err) {
        cc.error(err.message || err);
        return;
      }
      GM.hasLoadPrefab[path] = cc.instantiate(prefab);
      if (func != null) {
        func(GM.hasLoadPrefab[path], true);
      }
    })
  }
};

util.toTime = function (time){
	let s = Math.floor(time % 60)
	let m = Math.floor(time / 60)
	s < 10 ? s = `0${s}`:''
	m < 10 ? m = `0${m}`:''
	return `${m}:${s}`
};

util.loadDragon = function (name, nodeSke, func, armatureName,istrue) {

  var s_ske = nodeSke.getComponent(dragonBones.ArmatureDisplay)

  s_ske.dragonAsset = null
  s_ske.dragonAtlasAsset = null
  this._armatureDisplay = s_ske
  this._armature = this._armatureDisplay.armature()
  s_ske.dragonAsset = cc.loader.getRes("img2/guge/" + name + "/" + name + "_ske", dragonBones.DragonBonesAsset)
  s_ske.armatureName = ""
  s_ske.dragonAtlasAsset = cc.loader.getRes("img2/guge/" + name + "/" + name + "_tex", dragonBones.DragonBonesAtlasAsset)
  if (armatureName) {
    s_ske.armatureName = armatureName
  }
  else {
    s_ske.armatureName = 'armatureName'
  }
  if(!istrue){
    s_ske.playAnimation('run', -1);
  }
 

  cc.loader.setAutoReleaseRecursively(s_ske.dragonAsset, true);
  cc.loader.setAutoReleaseRecursively(s_ske.dragonAtlasAsset, true);

  if (func) {
    func()
  }

};

util.vibrationEffect = function (time) {
  if (cc.sys.os === cc.sys.OS_IOS){
      //调用苹果的方法;
  }
  else if (cc.sys.os === cc.sys.OS_ANDROID) {
      jsb.reflection.callStaticMethod("com/gb/luckycoin/AppActivity", "vibrate", "(I)V", time);
  }
},

util.showRewardedVideo = function (type) {
  if (cc.sys.os === cc.sys.OS_IOS){
      //调用苹果的方法;
  }
  else if (cc.sys.os === cc.sys.OS_ANDROID) {
    // jsb.reflection.callStaticMethod("com/gb/luckycoin/AppActivity", "vibrate", "(I)V", 100);
      jsb.reflection.callStaticMethod("com/gb/luckycoin/AppActivity", "showRewardedVideo","(Ljava/lang/String;)V",type);
  }
},


/*
    (x4,y4)         (x1,y1)
            (x,y)
    (x3,y3)         (x2,y2)
*/

util.checkDirection = function (posFrom, posToo) {
  if (!posFrom || !posToo) {
    return { dir: 0 }
  }
  var moveOffset = {}
  var dis = util.calcTwoPointDistance(posFrom, posToo)
  //必须正确的算出夹角速度

  //正上方
  if (posToo.x == posFrom.x && posToo.y >= posFrom.y) {
    moveOffset.x = 0
    moveOffset.y = 1//*(Math.abs((posToo.y-posFrom.y)/dis))
    moveOffset.dir = 5
    return moveOffset
  }

  //正下方
  if (posToo.x == posFrom.x && posToo.y <= posFrom.y) {
    moveOffset.x = 0
    moveOffset.y = -1//*(Math.abs((posFrom.y-posToo.y)/dis))
    moveOffset.dir = 6
    return moveOffset
  }

  // 正右方
  if (posToo.x >= posFrom.x && posToo.y == posFrom.y) {
    moveOffset.x = 1
    moveOffset.y = 0//*(Math.abs((posFrom.y-posToo.y)/dis))
    moveOffset.dir = 1
    return moveOffset
  }

  // 正左方
  if (posToo.x <= posFrom.x && posToo.y == posFrom.y) {
    moveOffset.x = -1
    moveOffset.y = 0//*(Math.abs((posFrom.y-posToo.y)/dis))
    moveOffset.dir = 4
    return moveOffset
  }

  //第一象限(0-90)
  if (posToo.x > posFrom.x && posToo.y > posFrom.y) {
    moveOffset.x = 1 * (Math.abs((posToo.x - posFrom.x) / dis))
    moveOffset.y = 1 * (Math.abs((posToo.y - posFrom.y) / dis))
    moveOffset.dir = 1

    var hudu = Math.atan2(posToo.y - posFrom.y, posToo.x - posFrom.x)
    var jiaodu = hudu * (180 / Math.PI)
    if (90 - jiaodu < 15) {
      moveOffset.dir = 5
    }
    return moveOffset
  }
  //第二象限(90-180)
  if (posToo.x > posFrom.x && posToo.y < posFrom.y) {
    moveOffset.x = 1 * (Math.abs((posToo.x - posFrom.x) / dis))
    moveOffset.y = -1 * (Math.abs((posFrom.y - posToo.y) / dis))
    moveOffset.dir = 2
    var hudu = Math.atan2(posToo.y - posFrom.y, posToo.x - posFrom.x)
    var jiaodu = hudu * (180 / Math.PI)

    if (90 + jiaodu < 15) {
      moveOffset.dir = 6
    }
    return moveOffset
  }
  //第三象限(180-270)
  if (posToo.x < posFrom.x && posToo.y < posFrom.y) {

    moveOffset.x = -1 * (Math.abs((posFrom.x - posToo.x) / dis))
    moveOffset.y = -1 * (Math.abs((posFrom.y - posToo.y) / dis))
    moveOffset.dir = 3

    var hudu = Math.atan2(posToo.y - posFrom.y, posToo.x - posFrom.x)
    var jiaodu = hudu * (180 / Math.PI)

    if (90 - (180 + jiaodu) < 15) {
      moveOffset.dir = 6
    }
    return moveOffset
  }
  //第四象限(270-360)
  if (posToo.x < posFrom.x && posToo.y >= posFrom.y) {
    moveOffset.x = -1 * (Math.abs((posFrom.x - posToo.x) / dis))
    moveOffset.y = 1 * (Math.abs((posToo.y - posFrom.y) / dis))
    moveOffset.dir = 4
    var hudu = Math.atan2(posToo.y - posFrom.y, posToo.x - posFrom.x)
    var jiaodu = hudu * (180 / Math.PI)

    if (jiaodu - 90 < 15) {
      moveOffset.dir = 5
    }
    return moveOffset
  }
}

// 跟随移动
util.FollowUp = function (pos1, pos2, speed) {
  var deltax = pos1.x - pos2.x
  var deltay = pos1.y - pos2.y
  if (deltax == 0) {
    if (pos1.y >= pos2.y) {
      deltax = 0.0000001
    } else {
      deltax = -0.0000001
    }
  }
  if (deltay == 0) {
    if (pos1.x >= pos2.x) {
      deltay = 0.0000001
    } else {
      deltay = -0.0000001
    }
  }
  var angle = 0
  var π = 3.1415926
  if (deltax > 0 && deltay > 0) {
    angle = Math.atan(Math.abs(deltay / deltax))           // 第一项限
  } else if (deltax < 0 && deltay > 0) {
    angle = π - Math.atan(Math.abs(deltay / deltax))          // 第二项限
  } else if (deltax < 0 && deltay < 0) {
    angle = π + Math.atan(Math.abs(deltay / deltax))          // 第三项限
  } else {
    angle = 2 * π - Math.atan(Math.abs(deltay / deltax))         // 第四项限
  }
  var x = speed * Math.cos(angle)
  var y = speed * Math.sin(angle)
  return { x: x, y: y }
},

  // 找到两个不同节点的相对相差位置  var pos = util.moveToOtherWordPoint(self.btn_email, self.btn_setting)  self.btn_email.setPosition(pos); 就能移动到相同的相对位置了
  util.moveToOtherWordPoint = function (mNode, toNode) {
    var oPos = toNode.getPosition();
    oPos = toNode.getParent().convertToWorldSpace(oPos);
    // ### 两者相差
    var sPos = mNode.getParent().convertToNodeSpace(oPos);
    return sPos;
  };

//两点间距离
util.calcTwoPointDistance = function (nodeFrom, nodeTo) {

  if (!nodeTo || !nodeFrom) {
    util.log("两点间距离参数错误", nodeFrom, nodeTo)
    return 0
  }

  var dx = Math.abs(nodeFrom.x - nodeTo.x);
  var dy = Math.abs(nodeFrom.y - nodeTo.y);
  var dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  return dis
};

//矩形与矩形是否相交
util.calcRectRect = function (pos1, pos2, node1, node2) {
  if(!node1.parent || !node2.parent){
    return false
  }
  var x1 = pos1.x - node1.anchorX * node1.scaleX * node1.width
  var y1 = pos1.y - node1.anchorY * node1.scaleY * node1.height
  var w1 = node1.parent.scaleX * node1.width * node1.scaleX
  var h1 = node1.parent.scaleY * node1.height * node1.scaleY
  var a = cc.rect(x1, y1, w1, h1)
  var x2 = pos2.x - node2.anchorX * node2.scaleX * node2.width
  var y2 = pos2.y - node2.anchorY * node2.scaleY * node2.height
  var w2 = node2.parent.scaleX * node2.width * node2.scaleX
  var h2 = node2.parent.scaleY * node2.height * node2.scaleY
  var b = cc.rect(x2, y2, w2, h2)
  return cc.Intersection.rectRect(a, b)
};

util.playOnClick = function(){
  let fullPath = "audio/common/btn";
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
};

//获取某个点的包围圈
//posOri        绕着的点
//dir           与计算点的朝向
//surroundDis   半径大小
//
//按45度角的情况 获取一个点 一共取 8个点
/*
  8  1  2
  7 pos 3
  6  5  4
    
*/

util.getSurroundPoint = function (posOri, surroundDis, dir, bEneny) {
  var posSurroundTab = []
  var pos0 = {}
  pos0.x = posOri.x + Math.sin(2 * Math.PI / 360 * 0) * surroundDis
  pos0.y = posOri.y + Math.cos(2 * Math.PI / 360 * 0) * surroundDis

  var pos45 = {}
  pos45.x = posOri.x + Math.sin(2 * Math.PI / 360 * 45) * surroundDis
  pos45.y = posOri.y + Math.cos(2 * Math.PI / 360 * 45) * surroundDis

  var pos90 = {}
  pos90.x = posOri.x + Math.sin(2 * Math.PI / 360 * 90) * surroundDis
  pos90.y = posOri.y + Math.cos(2 * Math.PI / 360 * 90) * surroundDis

  var pos135 = {}
  pos135.x = posOri.x + Math.sin(2 * Math.PI / 360 * 135) * surroundDis
  pos135.y = posOri.y + Math.cos(2 * Math.PI / 360 * 135) * surroundDis

  var pos180 = {}
  pos180.x = posOri.x + Math.sin(2 * Math.PI / 360 * 180) * surroundDis
  pos180.y = posOri.y + Math.cos(2 * Math.PI / 360 * 180) * surroundDis

  var pos225 = {}
  pos225.x = posOri.x + Math.sin(2 * Math.PI / 360 * 225) * surroundDis
  pos225.y = posOri.y + Math.cos(2 * Math.PI / 360 * 225) * surroundDis

  var pos270 = {}
  pos270.x = posOri.x + Math.sin(2 * Math.PI / 360 * 270) * surroundDis
  pos270.y = posOri.y + Math.cos(2 * Math.PI / 360 * 270) * surroundDis

  var pos315 = {}
  pos315.x = posOri.x + Math.sin(2 * Math.PI / 360 * 315) * surroundDis
  pos315.y = posOri.y + Math.cos(2 * Math.PI / 360 * 315) * surroundDis
  //根据朝向 挑选出 最适合的优先选择点
  //posSurroundTab.push(posOri)
  if (dir == 1) {
    posSurroundTab.push(pos270)
    posSurroundTab.push(pos225)
    posSurroundTab.push(pos180)
    posSurroundTab.push(pos315)

    posSurroundTab.push(pos0)
    posSurroundTab.push(pos135)
    posSurroundTab.push(pos90)
    posSurroundTab.push(pos45)
  }

  if (dir == 2) {

    posSurroundTab.push(pos315)
    posSurroundTab.push(pos0)
    posSurroundTab.push(pos270)
    posSurroundTab.push(pos225)

    posSurroundTab.push(pos45)
    posSurroundTab.push(pos180)
    posSurroundTab.push(pos90)
    posSurroundTab.push(pos135)

  }

  if (dir == 3) {
    posSurroundTab.push(pos45)
    posSurroundTab.push(pos0)
    posSurroundTab.push(pos90)
    posSurroundTab.push(pos315)

    posSurroundTab.push(pos135)
    posSurroundTab.push(pos180)
    posSurroundTab.push(pos270)
    posSurroundTab.push(pos225)
  }

  if (dir == 4) {
    posSurroundTab.push(pos135)
    posSurroundTab.push(pos90)
    posSurroundTab.push(pos180)
    posSurroundTab.push(pos225)

    posSurroundTab.push(pos45)
    posSurroundTab.push(pos270)
    posSurroundTab.push(pos0)
    posSurroundTab.push(pos315)

  }
  if (dir == 5) {
    posSurroundTab.push(pos180)
    posSurroundTab.push(pos135)
    posSurroundTab.push(pos225)
    posSurroundTab.push(pos90)

    posSurroundTab.push(pos270)
    posSurroundTab.push(pos315)
    posSurroundTab.push(pos45)
    posSurroundTab.push(pos0)

  }
  if (dir == 6) {
    posSurroundTab.push(pos0)
    posSurroundTab.push(pos45)
    posSurroundTab.push(pos315)
    posSurroundTab.push(pos270)

    posSurroundTab.push(pos90)
    posSurroundTab.push(pos225)
    posSurroundTab.push(pos135)
    posSurroundTab.push(pos180)
  }
  return posSurroundTab
};

// 获得两点之间顺时针旋转的角度
util.TwoPointAngle = function (pointFrom, pointTo) {
  // console.log("pointFrom", pointFrom, pointTo);
  var dx = Math.abs(pointFrom.x - pointTo.x);
  var dy = Math.abs(pointFrom.y - pointTo.y);
  var z = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  var cos = dy / z;
  var radina = Math.acos(cos) // 用反三角函数求弧度
  var angle = Math.floor(180 / (Math.PI / radina)) // 将弧度转换成角度
  if (pointTo.x > pointFrom.x && pointTo.y > pointFrom.y) { // 鼠标在第四象限
    angle = 180 - angle;
  } else if (pointTo.x == pointFrom.x && pointTo.y > pointFrom.y) { // 鼠标在y轴负方向上
    angle = 180;
  } else if (pointTo.x > pointFrom.x && pointTo.y == pointFrom.y) { // 鼠标在x轴正方向上
    angle = 90;
  } else if (pointTo.x < pointFrom.x && pointTo.y > pointFrom.y) {  // 鼠标在第三象限
    angle = 180 + angle;
  } else if (pointTo.x < pointFrom.x && pointTo.y == pointFrom.y) { // 鼠标在x轴负方向
    angle = 270;
  } else if (pointTo.x < pointFrom.x && pointTo.y < pointFrom.y) {  // 鼠标在第二象限
    angle = 360 - angle;
  }
  angle = -180 - angle;
  return angle;
}

// 这里不能去掉img2 的原因是目前还没有封装完全  对于plist的图还没写进来 而且用户传的可能是#xx.png  util.display(self.sp_head, "img2/userhead/touxiang001")
util.display = function (node, fileName) {
  if (fileName === undefined)
    return node.getSpriteFrame();
  else if (typeof fileName === 'string') {
    if (GM.hasLoadImg[fileName]) {
      node.getComponent(cc.Sprite).spriteFrame = GM.hasLoadImg[fileName];
    } else {
      cc.loader.loadRes(fileName, cc.SpriteFrame, function (err, spriteFrame) {
        if (err) {
          cc.error(err.message || err);
          return;
        }
        if (!cc.isValid(node)) {
          return
        }
        // cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));

        GM.hasLoadImg[fileName] = spriteFrame;
        node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });
    }
  }
};
// 获取后缀名 util.getSuffixName("xxx.plist") -> plist
util.getSuffixName = function (filename) {
  var index1 = filename.lastIndexOf(".");
  var index2 = filename.length;
  //后缀名
  var postf = filename.substring(index1 + 1, index2);
  return postf
};
// 加载网络图片 如果提示跨域请求失败让服务端处理   util.loadUrlImg(this.sprite_head, "http://tools.itharbors.com/christmas/res/tree.png")
util.loadUrlImg = function (node, picUrl) {
  if (GM.hasLoadImg[picUrl]) {
    node.getComponent(cc.Sprite).spriteFrame = GM.hasLoadImg[picUrl];
  } else {
    cc.loader.load({ url: picUrl, type: util.getSuffixName(picUrl) }, function (err, texTure) {
      var spriteFrame = new cc.SpriteFrame(texTure);
      node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      GM.hasLoadImg[picUrl] = spriteFrame;
    });
  }
};
// 从父节点脱落 到新的节点去 util.exto(this.hello_word, this.parent_node)
util.exto = function (child, father, zorder) {
  zorder = zorder || 0;
  var oldFather = child.getParent();

  if (oldFather) {
    child.removeFromParent(false);
    father.addChild(child, zorder);
  } else {
    father.addChild(child, zorder);
  }
};
// CocosCreater2.0后已经去掉了颜色穿透  所以要透明穿透只能把这个节点及其子节点设置颜色  util.setColor(this.hello_word, cc.color(0, 0, 0))
util.setColor = function (node, color) {
  node.color = color;
  var children = node.getChildren();
  for (var i = 0; i < children.length; i++) {
    util.setColor(children[i], color);
  }
};

//加载csv数据 并解析
//csvFile 需要加载的csv数据文件 路径必须放置在 assets\resources 下
//ps csv文件如果中文乱码 使用nodepad 修改编码格式为 utf-8
// listByID 如果存在 则数据根据 ID 存入字典中
util.getCsvData = function (csvFile, callBack, listByKey) {
  var dataBeginLine = 5 //表格配置的时候约定好第6行是数据段了
  var filePath = 'csvtable/' + csvFile
  if (null != GM.hasLoadCsv[csvFile]) {
    if (callBack) {
      callBack(GM.hasLoadCsv[csvFile]);
    }
    return
  }
  var csvDataMap = {}
  cc.loader.loadRes(filePath, function (err, mapCsv) {
    if (err) {
      cc.error(err);
    } else {
      var mapArr = mapCsv.text.split("\n")
      var mapKey = mapArr[1].split(",")
      var mapKeyType = mapArr[2].split(",")
      for (var lineIndex = dataBeginLine; lineIndex < mapArr.length; lineIndex++) {
        var itemArr = mapArr[lineIndex].split(",")

        csvDataMap[lineIndex - dataBeginLine] = {}

        for (var itemIndex = 0; itemIndex < itemArr.length; itemIndex++) {
          var keyValue = itemArr[itemIndex]
          if ("int" == mapKeyType[itemIndex]) {
            keyValue = parseInt(itemArr[itemIndex])
          }
          if ("float" == mapKeyType[itemIndex]) {
            keyValue = parseFloat(itemArr[itemIndex])
          }
          if (undefined != mapKey[itemIndex]) {
            csvDataMap[lineIndex - dataBeginLine][mapKey[itemIndex].replace(/\s+/g, "")] = keyValue
          }
        }
      }
      var nCount = 0
      for (var i in csvDataMap) {
        if (csvDataMap[i].hasOwnProperty("ID") && !isNaN(csvDataMap[i].ID)) {
          nCount = nCount + 1
        } else {
          csvDataMap[i] = {}
        }
      }
      csvDataMap.nCount = nCount
      util.getFilePath(csvFile, csvDataMap)
      if (callBack) {
        var csvDataMapNew = {};
        if (listByKey) {
          for (var index in csvDataMap) {
            if (csvDataMap[index] && csvDataMap[index][listByKey]) {
              csvDataMapNew[csvDataMap[index][listByKey]] = csvDataMap[index];
            }
          }
          csvDataMap = csvDataMapNew;
        }
        GM.hasLoadCsv[csvFile] = csvDataMap

        callBack(csvDataMap);
      }
    }
  });
};

util.getUrlCsvData = function (csvFile, callBack, listByKey) {
  var dataBeginLine = 5 //表格配置的时候约定好第6行是数据段了
  var filePath = webData.hostDownload+ 'csvtable/' + csvFile +".csv"
  if (null != GM.hasLoadCsv[csvFile]) {
    if (callBack) {
      callBack(GM.hasLoadCsv[csvFile]);
    }
    return
  }
  var csvDataMap = {}
  let self = this
  cc.loader.load(filePath, function (err, mapCsv) {
    if (err) {
      cc.error(err);
      util.getCsvData(csvFile, callBack, listByKey)
      return
    } else {
      if(!mapCsv)
      {
          console.error("配置加载失败",self._fileName)
          return
      }
      var mapArr = mapCsv.split("\n");
      var mapKey = mapArr[1].split(",");
      var mapKeyType = mapArr[2].split(",");
      for (var lineIndex = dataBeginLine; lineIndex < mapArr.length; lineIndex++) {
          var itemArr = mapArr[lineIndex].split(",");
          if (itemArr.length != mapKey.length || itemArr[0] == "") {
              continue;
          }
          csvDataMap[lineIndex - dataBeginLine] = {};
          for (var itemIndex = 0; itemIndex < itemArr.length; itemIndex++) {
              var keyValue = itemArr[itemIndex];
              if ("int" == mapKeyType[itemIndex]) {
                  keyValue = parseInt(itemArr[itemIndex]);
              }
              if ("float" == mapKeyType[itemIndex]) {
                  keyValue = parseFloat(itemArr[itemIndex]);
              }
              if (undefined != mapKey[itemIndex]) {
                  csvDataMap[lineIndex - dataBeginLine][mapKey[itemIndex].replace(/\s+/g, "")] = keyValue;
              }
          }
      }

      var nCount = 0
      for (var i in csvDataMap) {
        if (csvDataMap[i].hasOwnProperty("ID") && !isNaN(csvDataMap[i].ID)) {
          nCount = nCount + 1
        } else {
          csvDataMap[i] = {}
        }
      }
      csvDataMap.nCount = nCount
      util.getFilePath(csvFile, csvDataMap)
      if (callBack) {
        var csvDataMapNew = {};
        if (listByKey) {
          for (var index in csvDataMap) {
            if (csvDataMap[index] && csvDataMap[index][listByKey]) {
              csvDataMapNew[csvDataMap[index][listByKey]] = csvDataMap[index];
            }
          }
          csvDataMap = csvDataMapNew;
        }
        GM.hasLoadCsv[csvFile] = csvDataMap

        callBack(csvDataMap);
      }
    }
  });
};

util.getFilePath = function (csvFile, csvDataMap) {
  if ("Goods" == csvFile) {
    for (var i in csvDataMap) {
      if (csvDataMap[i].hasOwnProperty("icon")) {
        var tempIcon = csvDataMap[i].icon.replace(/\s+/g, "")
        for (var nIndex = 1; nIndex <= 6; nIndex++) {
          if (("jinbi" + nIndex.toString()) == tempIcon) {
            csvDataMap[i].icon = ("img2/common/token/jinbi/jinbi" + nIndex.toString())
          }
        }
        for (var nIndex = 1; nIndex <= 6; nIndex++) {
          if (("zuanshi" + nIndex.toString()) == tempIcon) {
            csvDataMap[i].icon = "img2/common/token/zuanshi/zuanshi" + nIndex.toString()
          }
        }
        for (var nIndex = 1; nIndex <= 7; nIndex++) {
          if (("hongbao" + nIndex.toString()) == tempIcon) {
            csvDataMap[i].icon = "img2/common/token/hongbao/hongbao" + nIndex.toString()
          }
        }
        for (var nIndex = 1; nIndex <= 7; nIndex++) {
          if (("menpiao" + nIndex.toString()) == tempIcon) {
            csvDataMap[i].icon = "img2/common/token/menpiao/menpiao" + nIndex.toString()
          }
        }
        if ("hongbao" == tempIcon) {
          csvDataMap[i].icon = "img2/common/token/hongbao/hongbao"
        }
      }
    }
  }
};

/**
 * 显示通用提示窗口
 * @param obj 初始化信息 {desc:提示内容 confirmText：确认按钮文本 cancleText：取消按钮文本 confirmFunc:确认回调 cancleFunc：取消回调 btnCount：按钮个数}
 */
util.showTip = function (obj) {
  uiFunc.clearUI("uiWindow/TipCommon1");
  uiFunc.openUI("uiWindow/TipCommon1", (uiScript) => {
    uiScript.init(obj);
  });
};
/**
 * 显示漂浮文字
 * @param str 文字内容
 * @param time 显示时间
 */
util.showAlert = function (str, time) {
  time = time || 2
  uiFunc.clearUI("uiBattle/uiTip");
  uiFunc.openUI("uiBattle/uiTip", (uiScript) => {
    uiScript.init(str, time);
  });
};
/**
 * 获取指定区间的随机数
 * 必须是整数
 * @param min 下限
 * @param max 上限
 */
util.randomRange = function (min, max) {
  min = parseInt(min)
  max = parseInt(max)
  max = max || 0; min = min || 0;
  let rnd = Math.random() * (max - min + 1)
  return Math.floor(min + rnd)
};
/**
 * 获取N个区间随机数
 * @param min 下限
 * @param max 上限
 * @param len 上限
 */
util.randomListRange = function (min, max, len) {
  len = len || (max - min + 1)
  var arr = [];
  for (var i = min; i <= max; i++) {
    arr.push(i);
  }
  arr.sort(
    function () {
      return 0.5 - Math.random();
    }
  );
  arr.length = len
  return arr
};

/**
 * 时间转换为時分秒
 * 100秒 = 01：40
 */
util.ChangeTimeToSeconds = function (mss, showLength) {
  let length = showLength || 3
  var hours = parseInt(mss / (1 * 60 * 60));
  var minutes = parseInt((mss % (1 * 60 * 60)) / (1 * 60));
  var seconds = (mss % (1 * 60)) / 1;
  hours = ("0" + hours).substr(-2);
  minutes = ("0" + minutes).substr(-2)
  seconds = ("0" + seconds).substr(-2)

  if (length == 3) {
    return hours + ":" + minutes + ":" + seconds;
  } else if (length == 2) {
    return minutes + ":" + seconds;
  } else if (length == 1) {
    return seconds
  }
}

util.isNull = function (x) {
  if (x === undefined) {
    return true
  }
  if (x === "") {
    return true
  }
  if (x === null) {
    return true
  }
  if (x === false) {
    return true
  }
  return false
}

//深拷贝对象
util.copyObj = function (obj1, obj2) {
  var obj2 = obj2 || {};
  for (var name in obj1) {
    if (typeof obj1[name] === "object") {
      obj2[name] = (obj1[name].constructor === Array) ? [] : {};
      util.copyObj(obj1[name], obj2[name]);
    } else {
      obj2[name] = obj1[name];
    }
  }
  return obj2;
}

util.linkWidget = function (self, nodeDict) {
  var children = self.children;
  for (let i = 0; i < children.length; i++) {
    var widgetName = children[i].name;
    if (widgetName && widgetName.indexOf("_") > 0) {
      var nodeName = widgetName;
      nodeDict[nodeName] = children[i];
    }
    if (children[i].childrenCount > 0) {
      util.linkWidget(children[i], nodeDict);
    }
  }
}

util.isIphoneX = function () {
  const ratio = cc.view.getFrameSize().width / cc.view.getFrameSize().height
  if (ratio > 1.95) {
    // 目前市面上敢这么飘的也就iPhoneX了
    return true;
  }
  return false;
}

util.getDisHeight = function () {
  const ratio = cc.view.getFrameSize().width / cc.view.getFrameSize().height
  if (ratio > 1.95) {
    // 目前市面上敢这么飘的也就iPhoneX了
    return -60
  }
  return 0;
}

// 比较时间，查看是否同一天
util.checkSameDay = function (preTime) {
  if (!preTime || preTime == "") {
    return false;
  }
  let preData = new Date(preTime);
  var iCurData = new Date();
  if (preData.getFullYear() == iCurData.getFullYear() && preData.getMonth() == iCurData.getMonth() && preData.getDate() == iCurData.getDate()) {
    return true;
  }
  return false;
}

util.timeFormat = function (time) {
  var minute = Math.floor(time / 60);
  minute = (Array(2).join(0) + minute).slice(-2);
  var second = time % 60;
  second = (Array(2).join(0) + second).slice(-2);
  return "" + minute + ":" + second + "";
}

// 判断是否是IOS
util.isIOS = function () {
  if (cc.sys.os === cc.sys.OS_IOS) {
    return true;
  }
  return false;
}

util.setTextMaxCharCode = function (str, maxNum) {
  if (maxNum == null) {
    maxNum = 4;
  }
  if (str.length <= maxNum) {
    return str;
  } else {
    // 区别中英文字符 默认为 9个英文字符长度==5个中文字符等长
    var num = 0;
    for (let i in str) {
      var charCode = str.charCodeAt(i);
      if (charCode > 32 && charCode < 127) {
        num += 5 / 9;
      } else {
        num += 1;
      }
      if (num > maxNum) {
        str = str.substr(0, i);
        str += "..."
        return str;
      }
    }
    return str;
  }
}

util.getRewardShow = function (itemType, itemNum, bTip) {
  var uiPrefabName = "common/uiGetReward"
  if (bTip) {
    uiPrefabName = "common/uiGetTip"
  }
  uiFunc.openUI(uiPrefabName, (uiScript) => {
    var rewardTab = []
    for (let index = 0; index < itemType.length; index++) {
      var rewardItem = {}
      rewardItem.itemType = itemType[index]
      rewardItem.itemNum = itemNum[index]
      rewardTab.push(rewardItem)
    }
    uiScript.initReward(rewardTab, bTip)
  })
}

util.nFormatter = function (num, dis) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "m" },
    { value: 1E9, symbol: "g" },
    { value: 1E12, symbol: "t" },
    { value: 1E15, symbol: "p" },
    { value: 1E18, symbol: "e" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  //parseFloat(`${num / si[i].value}`).toFixed(dis).replace(rx, "$1")
  if (si[i].value == 1)
    return (num / si[i].value).toFixed(dis).replace(rx, "$1") + si[i].symbol;
  return (num / si[i].value).toFixed(dis) + si[i].symbol;
}

util.showCommonReward = function (iRewardType, iRewardNum) {
  if (iRewardType == 3) {
    var iAllCount = BattleMgr.getConfigDataByIndex(52);
    if (gameData.get('freeGoldCount') >= iAllCount) {
      util.showTip({
        desc: "金币不足", btnCount: 1, confirmText: "前往冒险", confirmFunc: () => {
          uiFunc.closeAllDlg();
          if (GM.hallUI && GM.hallUI.enterBattleGame) {
            GM.hallUI && GM.hallUI.enterBattleGame()
          }
        }
      });
      return;
    }
  }
  if (iRewardType == 4) {
    var iAllCount = BattleMgr.getConfigDataByIndex(53);
    if (gameData.get('freeDiamondCount') >= iAllCount) {
      util.showTip({
        desc: "钻石不足", btnCount: 1, confirmText: "前往挑战", confirmFunc: () => {
          uiFunc.closeAllDlg();
          if (GM.hallUI && GM.hallUI.enterMatchTiaoZhan) {
            GM.hallUI && GM.hallUI.enterMatchTiaoZhan()
          }
        }
      });
      return;
    }
  }
  uiFunc.openUI("uiWindow/TipCommon5", function (node) {
    if (iRewardType == 4) {
      node.getComponent("TipCommon5").initTipInfo(iRewardType, iRewardNum, "马上有钱", "img2/common/token/zuanshi3", iRewardNum);
    } else if (iRewardType == 3) {
      node.getComponent("TipCommon5").initTipInfo(iRewardType, iRewardNum, "马上有钱", "img2/common/token/jinbi3", iRewardNum);
    }
  });
}



module.exports = util;