var baseNode = require("baseNode")
var entityFactory = require("entityFactory")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
        this.size = 48
        let self = this
        this.sp_scratch.on(cc.Node.EventType.TOUCH_START, (event) => {
            if(self.entity.jsParent){
                self.entity.jsParent.btn_close.active = false
            }
            self.drawCircle(event)
            self.sp_scratch.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
                self.drawCircle(event)
            });
        });
        this.sp_scratch.on(cc.Node.EventType.TOUCH_END, (event) => {
            self.posx = undefined
            self.posy = undefined
            self.sp_scratch.off(cc.Node.EventType.TOUCH_MOVE);
            // self.sp_scratch.off(cc.Node.EventType.TOUCH_CANCEL);
        });
        this.sp_scratch.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            self.posx = undefined
            self.posy = undefined
            self.sp_scratch.off(cc.Node.EventType.TOUCH_MOVE);
            // self.sp_scratch.off(cc.Node.EventType.TOUCH_CANCEL);
        });
    },

    init(entity){
        this.posx = undefined
        this.posy = undefined
        this.entity = entity
        this.node.parent = this.entity.jsParent.node
        this.node.x = 0
        this.node.y = -200
        this.mask = this.node_mask.getComponent(cc.Mask)
        this.stencil = this.mask._graphics
        this.stencil.clear();

        this.loadingItem()
        for(let i = 1;i <= 9;i ++){
            this[`item_active_${i}`] = false
        }
        this.is_win = false
        this.is_win_spe = false
    },

    loadingItem(){
        this.lucky_type = util.getRandom(2)
        if(this.lucky_type == 1){
            let random = util.getRandom(9)
            for(let i = 1;i <= 9;i ++){
                let r = Math.random()
                this[`item_${i}_bg`].color = cc.color(255,255,255)//cc.color(255,212,45)
                if(i == random){
                    this[`item_info_${i}`] = 0
                    this[`item_${i}_icon`].active = false
                    this[`item_${i}_lbl`].active = true
                    // util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/1`)
                }else if(r>0.7){
                    this[`item_info_${i}`] = 2
                    this[`item_${i}_icon`].active = true
                    this[`item_${i}_lbl`].active = false
                    util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/2`)
                }else if(r>0.4){
                    this[`item_info_${i}`] = 3
                    this[`item_${i}_icon`].active = true
                    this[`item_${i}_lbl`].active = false
                    util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/3`)
                }else{
                    this[`item_info_${i}`] = 4
                    this[`item_${i}_icon`].active = true
                    this[`item_${i}_lbl`].active = false
                    util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/4`)
                }

                // else if(r>0.9){
                //     this[`item_info_${i}`] = 1
                //     this[`item_${i}_icon`].active = true
                //     this[`item_${i}_lbl`].active = false
                //     util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/1`)
                // }
            }
            return
        }
        if(this.lucky_type == 2){
            let num = 3
            var blankArr = []
            var numArr = [];
            for(let i = 1;i<=9;i++){
                numArr[i] = i
            }
            var fun = () =>{
                if(num<=0){
                    for(let i = 1;i <= 9;i ++){
                        let r = Math.random()
                        this[`item_${i}_bg`].color = cc.color(255,255,255)
                        let isGood = false
                        for(let temp in blankArr){
                            if(i == temp){
                                isGood = true
                            }
                        }
                        if(isGood){
                            this[`item_info_${i}`] = 1
                            this[`item_${i}_icon`].active = true
                            this[`item_${i}_lbl`].active = false
                            util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/1`)
                        }else if(r>0.7){
                            this[`item_info_${i}`] = 2
                            this[`item_${i}_icon`].active = true
                            this[`item_${i}_lbl`].active = false
                            util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/2`)
                        }else if(r>0.4){
                            this[`item_info_${i}`] = 3
                            this[`item_${i}_icon`].active = true
                            this[`item_${i}_lbl`].active = false
                            util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/3`)
                        }else{
                            this[`item_info_${i}`] = 4
                            this[`item_${i}_icon`].active = true
                            this[`item_${i}_lbl`].active = false
                            util.display(this[`item_${i}_icon`],`img/game/${this.entity.jsParent.info.id}/4`)
                        }
                    }
                    return      
                }
                let key = util.getRandom(numArr.length - 1)
                blankArr[numArr[key]] = true
                numArr.splice(key,1)
                num --
                fun()
            }
            fun()
        }

      
    },

    drawCircle(event){
        if(this.is_win){
            return
        }
        var point = this.node.convertToNodeSpaceAR(event.getLocation());
        var x = Math.floor(point.x)
        var y = Math.floor(point.y)
        if(this.posx == undefined){
            this.posx = x
            this.posy = y
            this.stencil.circle(x,y,this.size);
            this.stencil.fill()
            this.check_scratch_over()
            return
        }
   
        this.stencil.strokeColor = cc.Color.GREEN;
        this.stencil.lineCap = cc.Graphics.LineCap.ROUND

        this.stencil.lineWidth = this.size*2;
        
        this.stencil.moveTo(this.posx,this.posy);
        this.stencil.lineTo(x,y);
        this.stencil.stroke();

        this.posx = x
        this.posy = y

        this.check_scratch_over()
    },

    check_scratch_over(){
        let _size = this.size * 1.2
        for(let i = 1;i <= 9;i ++){
            let item = this[`item_${i}`]
            if(cc.Intersection.rectRect(cc.rect(item.x-this.size/2,item.y-this.size/2,_size,_size),cc.rect(this.posx-this.size/2,this.posy-this.size/2,_size,_size))){
                this[`item_active_${i}`] = true
            }
        }
        for(let i = 1;i <= 9;i ++){
            if(!this[`item_active_${i}`]){
                return
            }
        }
        for(let i = 1;i <= 9;i ++){
            if(this[`item_info_${i}`] == 0){
                this[`item_${i}_bg`].color = cc.color(255,212,45)
            }
        }
        
        if(this.is_win_spe){
            return
        }
        this.is_win_spe = true
        this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function () {
            this.is_win = true
            this.stencil.circle(0,0,1024);
            this.stencil.fill()
            // if(this.lucky_type == 1){
                GM.gameCtrl.addMoney(1000)
            // }
            
            let entity = {
                type : this.lucky_type,
                jsParent : this.entity.jsParent,
            }
            new entityFactory().createEntity(entity,`ui/game/enenyAnimScratchWin`,`enenyAnimScratchWin`,`enenyAnimScratchWin`)
        }.bind(this))))      

    },


    dead(){
        entityMgr.enenyScratchPool.put(this.node)
    },
    
});
