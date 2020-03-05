
cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: cc.Prefab,
        spacing: 10,  //item之间的间隔
        rowCount: 5, // view中能显示多少行
        colCount: 2, //每行有多少个item
        scrollView: cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.updateTimer = 0  
        this.updateInterval = 0.05
        this.cacheRow = this.rowCount + 6 //缓存多少行
        this.rowCount = Math.ceil(this.rowCount)
        this.items = [] // 存储实际创建的项数组

        const item = cc.instantiate(this.itemTemplate)
        this.itemHeight = item.height
        this.itemWidth = item.width
        this.spawnCount = this.cacheRow * this.colCount
        this.bufferZone = this.cacheRow * (this.itemHeight + this.spacing) / 2
        this.content = this.scrollView.content
        this.contenty = this.scrollView.content.y
    },

    resetData (data, callBack,showIndex) {
        this.isInit = this.initialize(data, callBack,showIndex)
    },
    // 列表初始化
    initialize (data, callBack,showIndex) {
        if (!callBack || !data || data.length === 0 || !this.itemTemplate || !this.scrollView) {
            console.log('初始化失败，请检查所有必要参数')
            return false
        }
        this.data = data
        this.itemUpdateFunc = callBack
        this.totalRow = Math.ceil(data.length / this.colCount) 
        this.lastContentPosY = 0 

        // this.content.removeAllChildren()
        // 获取整个列表的高度
        this.content.height = this.totalRow * (this.itemHeight + this.spacing) + this.spacing
        this.content.width = this.colCount * (this.itemWidth + this.spacing) + this.spacing

        // if(this.isInit)
        // {
        //     return true
        // }
        showIndex = showIndex || 0
        if(showIndex < 0)
        {
            showIndex = 0
        }

        this.scrollView.content.y = this.contenty + (this.itemHeight + this.spacing) *showIndex
        
        if(showIndex >= this.data.length)
        {
            showIndex = this.data.length - 1
            this.scrollView.content.y = this.content.height - this.contenty
        }
        // this.lastContentPosY = this.scrollView.content.y 
        let offsetIndex = Math.floor(showIndex/this.cacheRow)
        const offset = (this.itemHeight + this.spacing) * this.cacheRow

        let row = 0
        for (let i = 0; i < this.spawnCount; i += this.colCount) { // spawn items, we only need to do this once
            const itemY = -this.itemHeight * (0.5 + row) - this.spacing * (row + 1) - offset *offsetIndex
            for (let j = 0; j < this.colCount; j++) {
                const itemId = i + j + offsetIndex*this.cacheRow
                let item = null
                if (itemId >= this.items.length) {
                    item = cc.instantiate(this.itemTemplate)
                    this.items.push(item)
                    this.content.addChild(item)
                } else {
                    item = this.items[i + j]
                }
                
                // 设置该item的坐标（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
                const itemX = (j + 0.5) * this.itemWidth + this.spacing * (j + 1) - this.content.width / 2
                item.setPosition(itemX, itemY)
                item.itemId = itemId
               
                if (itemId >= this.data.length) {
                    item.active = false
                } else {
                    item.active = true
                    this.itemUpdateFunc(itemId, item, this.data[itemId])
                }
            }
            row++
        }
        return true
    },
    // 返回item在ScrollView空间的坐标值
    getPositionInView (item) {
        const worldPos = item.parent.convertToWorldSpaceAR(item.position)
        const viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos)
        return viewPos
    },

    // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update (dt) {
        this.updateTimer += dt
        if (!this.isInit || this.updateTimer < this.updateInterval) {
            return // we don't need to do the math every frame
        }
        this.updateTimer = 0
        if(this.scrollView.content.y == this.lastContentPosY)
        {
            return
        }
        const items = this.items
        const isDown = this.scrollView.content.y < this.lastContentPosY
        const offset = (this.itemHeight + this.spacing) * this.cacheRow
        let newY = 0

        for (let i = 0; i < items.length; i += this.colCount) {
            const viewPos = this.getPositionInView(items[i])
            if (isDown) {
                newY = items[i].y + offset
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    for (let j = 0; j < this.colCount; j++) {
                        const index = j + i
                        items[index].y = newY
                        const itemId = items[index].itemId - this.spawnCount// update item id
                        items[index].itemId = itemId
                        if (itemId >= 0 && itemId < this.data.length) {
                            items[index].active = true
                            this.itemUpdateFunc(itemId, items[index], this.data[itemId])
                        } else {
                            items[index].active = false
                        }
                    }
                }
            } else {
                newY = items[i].y - offset
                if (viewPos.y > this.bufferZone && newY > -this.content.height) {
                    for (let j = 0; j < this.colCount; j++) {
                        const index = j + i
                        items[index].y = newY
                        const itemId = items[index].itemId + this.spawnCount// update item id
                        items[index].itemId = itemId
                        if (itemId >= 0 && itemId < this.data.length) {
                            items[index].active = true
                            this.itemUpdateFunc(itemId, items[index], this.data[itemId])
                        } else {
                            items[index].active = false
                        }
                    }
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y
    },
})
