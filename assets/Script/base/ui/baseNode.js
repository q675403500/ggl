 cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    //privete: 如果进行继承需要在子类里面调用this._super();
    onLoad () {
        //只有带"_"的 节点名字才会加入映射
        var linkWidget = function(self, nodeDict,isbtnChild) {
            var children = self.children;
            isbtnChild = isbtnChild || self.getComponent(cc.Button) || self.canTouch || self.getComponent(cc.EditBox)
            for (var i = 0; i < children.length; i++) {
                var widgetName = children[i].name;
                if (widgetName && widgetName.indexOf("_") > 0) {
                    var nodeName = widgetName;
                    if (nodeDict[nodeName]) {
                        // cc.log("控件名字重复!" + children[i].name);
                    }
                    nodeDict[nodeName] = children[i];
                    this[nodeName] = children[i];
                }
                if (children[i].childrenCount > 0) {
                    linkWidget(children[i], nodeDict,isbtnChild);
                }
                
                // if(!isbtnChild)
                // {
                //     children[i].addComponent(cc.BlockInputEvents)
                // }
            }
        }.bind(this);
        linkWidget(this.node, this.node);

        //添加底部吞噬层
        this.addComponent(cc.BlockInputEvents)
    },

    show(arg)
    {
        this.__showing__ = true;
        this.__arg__ = arg;
        let topaddZ = 1000
        
        var children = this.node.parent.children;
        var zIndex = 0;
        for (let i = 0; i < children.length; i++) {
            let childZ = children[i].zIndex
            childZ = childZ>=topaddZ?childZ-topaddZ:childZ
            zIndex = Math.max(zIndex,childZ)
        }
        this.node.zIndex =  zIndex + (this.froceTop?topaddZ:1);
        
        if (this.playScale) {
            this.playScaleAni();
        }
    },

    
    hide()
    {
        this.node.zIndex = 0;
    },

    
    lateUpdate()
    {
        if (this.__showing__ && this.onEnter)
        {
            this.__showing__ = false;
            this.onEnter(this.__arg__)
            this.__arg__ = null
        }

        if(this.callfuns)
        {
            let func = this.callfuns.shift()
            if(func)
            {
                func();
            }
        }
    },

    delayCall(func)
    {
        if(!this.callfuns)
        {
            this.callfuns = []
        }

        this.callfuns.push(func)
    },

    removeAllDelayCall()
    {
        this.callfuns = []
    }
});
