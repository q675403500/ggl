window.entityMgr = {}
entityMgr.enemyGroup = []

cc.Class({
    properties: {
    },
  
    onLoad () {
  
    },
  
    start () {
  
    },
    /**
     * 对象池
     *  @param {Object} entity 参数
     *  @param {String} path prefab路径
     *  @param {String} jsName 
     *  @param {String} pfbName 
     *  @param {Function} func 
     */
    createEntity(entity,path,jsName,pfbName,func){
        let entityPrefab = null
        let pool = `${pfbName}Pool`
        if (!entityMgr[pool]) {
            entityMgr[pool] = new cc.NodePool()
        }
        var fun = () => {
            var prefabJS = entityPrefab.getComponent(jsName);
            if (prefabJS) {
              prefabJS.init(entity)
            }
            if (func) {
              func(prefabJS)
            }
        }
        if (entityMgr[pool].size() > 0) {
            entityPrefab = entityMgr[pool].get();
            fun()
        }
        else {
            util.loadPrefab(path, (prefab, bNewOne) => {
                entityPrefab = cc.instantiate(prefab);
                entityPrefab.addComponent(require(jsName))
                fun()
            }, true)
        }
    },
});