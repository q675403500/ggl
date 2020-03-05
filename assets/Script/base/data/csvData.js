var regeneratorRuntime = require("runtime")
var __datas = {}
var baseData = require("baseData")

cc.Class({
    extends: baseData,
    properties: {
        _fileName:undefined,//.csv文件名
        _csvData:undefined,//数据
    },

    /**
     * 初始化类
     * 
     * @param {String} fileName csv文件名 
     * 
     */
    ctor()
    {
        var fileName = arguments[0];
        if(fileName)
        {
            this._fileName = fileName;
            this.loadCSV()
            return
        }
        if(!this._fileName)
        {
            cc.error("mush define a csv path")
            return
        }
    },

    onLoadCSV(callback)
    {
        
    },


    /**
     * 读取文件数据,数据直接以id作为key.
     * @param {Function} callBack 回调 
     * 
     */
    async loadCSV(callBack)
    {
        if(__datas[this._fileName])
        {        
            if (callBack)
            {
                callBack()
            }
            return
        }

        var dataBeginLine = 5 //表格配置的时候约定好第6行是数据段了
        var filePath = 'csvtable/' + this._fileName
        var csvDataMap = {}
        var rs = await cc.loadResNow(filePath);
        var err = rs.e
        if (err)
        {
            cc.error(err);
            return
        }
        var mapCsv = rs.v
        var mapArr = mapCsv.text.split("\n")
        var mapKey = mapArr[1].split(",")
        var mapKeyType = mapArr[2].split(",")
        for(var lineIndex = dataBeginLine; lineIndex < mapArr.length; lineIndex++){
            var itemArr = mapArr[lineIndex].split(",")
            if(itemArr.length != mapKey.length || itemArr[0] == ""){
                continue;
            }
            csvDataMap[lineIndex-dataBeginLine] = {}
            for(var itemIndex = 0; itemIndex < itemArr.length; itemIndex++){
                var keyValue = itemArr[itemIndex]
                if ("int" == mapKeyType[itemIndex]){
                    //科学计数法没有转过来
                    if(itemArr[itemIndex].indexOf("+")>0)
                    {
                        cc.error("load csv error file = "+this._fileName)
                    }
                    keyValue = parseInt(itemArr[itemIndex])
                }
                if ("float" == mapKeyType[itemIndex]){
                    keyValue = parseFloat(itemArr[itemIndex])
                }
                if (undefined != mapKey[itemIndex] ){
                    csvDataMap[lineIndex-dataBeginLine][mapKey[itemIndex].replace(/\s+/g, "")] = keyValue
                }
            }
        }

        //把表转化为以id为key.避免频繁遍历
        __datas[this._fileName] = {};
        for(let i in csvDataMap)
        {
            var info = csvDataMap[i]
            var id = info["id"]
            if(!id)
            {
                cc.error(filePath+" 表配置不规范,没有id");
                continue;
            }
            __datas[this._fileName][id] = info;
        }
        
        if (callBack)
        {
            callBack()
        }
    },

    async loadUrlCSV(callBack)
    {

        if(__datas[this._fileName])
        {        
            if (callBack)
            {
                callBack()
            }
            return
        }
        var dataBeginLine = 5; 
        var csvDataMap = {};
        let self = this
        // console.log(webData.G_RES_URL())
        cc.loader.load(webData.G_RES_URL() + "csvtable/" + this._fileName + ".csv", function (err, mapCsv) {
            if (err) {
                console.log("网络配置加载失败,加载本地配置",self._fileName);
                self.loadCSV(callBack)
                return
                //cc.error(err);
            } else {
                // console.log(mapCsv)
                if(!mapCsv)
                {
                    console.error("配置加载失败",self._fileName)
                    return
                }
                // mapCsv = mapCsv.replace(/[\r]/g,"")
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

                __datas[self._fileName] = {};
                for(let i in csvDataMap)
                {
                    var info = csvDataMap[i]
                    var id = info["id"] || info["ID"]
                    if(!id)
                    {
                        cc.error(self._fileName+" 表配置不规范,没有id");
                        continue;
                    }
                    __datas[self._fileName][id] = info;
                }
                
                if (callBack)
                {
                    callBack()
                }
            }
        });
    },

    /**
     * 获取所有数据
     * @returns {Object}  表数据 
     * 
     */
    getAllDatas()
    {
        if (!__datas[this._fileName])
        {
            cc.error("not found data",this._fileName)
        }
        return __datas[this._fileName]
    },

    //所有id
    getIDs()
    {
        var datas = this.getAllDatas()
        return Object.keys(datas)
    },

    /**
     * 获取对应id所有数据
     * @param {int} id id 
     * @returns {Object}  表数据 
     * 
     */
    getInfoByID(id)
    {
        id = parseInt(id)
        if (!__datas[this._fileName])
        {
            cc.error("not found data",this._fileName)
        }
        return __datas[this._fileName][id]
    },

    getValueByIDKey(id,key)
    {
        var info = this.getInfoByID(id)
        if (!info)
        {
            cc.error("not found data id = "+id)
        }

        var value = info[key]

        if (!value)
        {
            cc.error("not found value id = "+id + "key = "+key)
        }

        return value
    },

    //通过属性查找出id
    getIDByKeyValue(key,value)
    {
        var datas = this.getAllDatas()
        for(let id in datas)
        {
            if(this.getValueByIDKey(id,key) === value)
            {
                return id
            }
        }
    }
});