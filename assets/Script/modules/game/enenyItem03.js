var baseNode = require("baseNode")
var entityFactory = require("entityFactory")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
        var iHeight = cc.winSize.height;
        this.node_top.y = iHeight/2
        this.node_bottom.y = -iHeight/2
        this.addEvent()
        this.initColor()
    },

    initColor(){
        // this.top_bg.color = webData.color
    },

    addEvent(){
        this.btn_close.quickBt(() => {
            this.dead()
        }); 

        this.btn_next.quickBt(() => {
            if(this.can_next){
                if(this.type == 1){
                    this.next_lucky_num()
                }else if(this.type == 2){
                    this.sub_end()
                }
            }
        }); 

        this.btn_random.quickBt(() => {
            this.select_random()
        }); 

        this.btn_history.quickBt(() => {
            this.select_history()
        }); 

        for(let i = 1;i<=5;i++){
            this[`select_${i}`].quickBt(() => {
                this.del_select_num(i)
            }); 
        }
    },

    init(entity){
        this.node.parent = GM.hallUI.node_main
        this.idx = entity.idx
        this.info = entity.info
        this.initData()
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(`openlucky`);
        animState.wrapMode = cc.WrapMode.Normal;
    },


    dead(){
        GM.gameCtrl.breathe_began()
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(`openlucky`);
        animState.wrapMode = cc.WrapMode.Reverse;
        anim.on('finished', function () {
            anim.off('finished');
            GM.hallUI.node_block.active = false
            entityMgr.enenyItem03Pool.put(this.node)
        }.bind(this), this);
    },

    sub_end(){
        GM.gameCtrl.select_1 = this.select_1_num
        GM.gameCtrl.select_2 = this.select_2_num
        GM.gameCtrl.select_3 = this.select_3_num
        GM.gameCtrl.select_4 = this.select_4_num
        GM.gameCtrl.select_5 = this.select_5_num
        GM.gameCtrl.select_6 = this.lucky_1_num
        GM.gameCtrl.already_select_lucky = true
        this.dead()
    },

    initData(){
        this.type = 1
        this.node_select.x = 0
        this.can_next = false
        for(let i = 1;i<=5;i++){
            this[`select_${i}_num`] = 0
            this[`select_num_${i}`] = false
            this[`lbl_select_${i}`].active = false
            util.display(this[`select_${i}`],`img/lucky/wenhaohei`)
        }
        this.lucky_1_num = 0
        this.lucky_num_1 = false
        this.lbl_lucky_1.active = false
        util.display(this.lucky_1,`img/lucky/wenhaohuang`)
        util.display(this.btn_next,`img/lucky/xiayibu_hui`)
        for(let i = 0;i<60;i++){
            if(this[`num_${i}`]){
                this[`num_${i}`].initData()
            }else{
                let entity = {
                    id : i,
                    js_Lucky : this,
                }
                let self = this
                new entityFactory().createEntity(entity,`ui/game/enenyNum`,`enenyNum`,`enenyNum`,(uiScript) => {
                    self[`num_${i}`] = uiScript
                    self[`num_${i}`].initData()
                })
            }
        }
    },

    del_select_num(id){
        if(this[`select_num_${id}`]){
            this[`num_${this[`select_${id}_num`]}`].no_select()
            this.check_Select_All()
        }
    },

    select_random(){
        if(this.type == 1){
            let num = 5

            var numArr = [];
            for(let i = 0;i<=59;i++){
                numArr[i] = i
                this[`num_${i}`].no_select()
            }
            var fun = () =>{
                if(num<=0){
                    util.display(this.btn_next,`img/lucky/xiayibu`)
                    this.can_next = true
                    return      
                }
                let key = util.getRandom(numArr.length - 1)
                this[`select_num_${num}`] = true
                this[`select_${num}_num`] = numArr[key]
                this[`lbl_select_${num}`].active = true
                this[`lbl_select_${num}`].setLabel(numArr[key])
                util.display(this[`select_${num}`],`img/lucky/hongqiu`)
                this[`select_${num}`].stopAllActions()
                this[`select_${num}`].runAction(cc.sequence(cc.scaleTo(0.25,1.15,1.15),cc.scaleTo(0.25,1,1)))
                this[`num_${numArr[key]}`].yes_select()
                numArr.splice(key,1)
                num --
                fun()
            }
            fun()
        }else if(this.type == 2){
            for(let i = 0;i<=59;i++){
                this[`num_${i}`].no_select()
            }
            let key = util.getRandom(59)
            this.lucky_num_1 = true
            this.lucky_1_num = key
            this.lbl_lucky_1.active = true
            this.lbl_lucky_1.setLabel(key)
            util.display(this.lucky_1,`img/lucky/hongqiu`)
            this.lucky_1.stopAllActions()
            this.lucky_1.runAction(cc.sequence(cc.scaleTo(0.25,1.15,1.15),cc.scaleTo(0.25,1,1)))
            this[`num_${key}`].yes_select()
            util.display(this.btn_next,`img/lucky/tijiao`)
            this.can_next = true
        }
    },

    select_history(){

    },

    next_lucky_num(){
        this.type = 2
        util.display(this.btn_next,`img/lucky/tijiao_hui`)
        this.can_next = false
        this.node_select.runAction(cc.moveTo(0.5,-720,0))
        this.p_layout.runAction(cc.sequence(cc.fadeOut(0.25),cc.callFunc(function () {
            for(let i = 0;i<60;i++){
                this[`num_${i}`].initData()
            }
        }.bind(this)),cc.fadeIn(0.25)))
    },

    change_Select_Num(select,id){
        if(this.type == 1){
            if(select){
                for(let i = 1;i<=5;i++){
                    if(!this[`select_num_${i}`]){
                        this[`select_num_${i}`] = true
                        this[`select_${i}_num`] = id
                        this[`lbl_select_${i}`].active = true
                        this[`lbl_select_${i}`].setLabel(id)
                        util.display(this[`select_${i}`],`img/lucky/hongqiu`)
                        this[`select_${i}`].stopAllActions()
                        this[`select_${i}`].runAction(cc.sequence(cc.scaleTo(0.25,1.15,1.15),cc.scaleTo(0.25,1,1)))
                        return
                    }
                }
            }else{
                for(let i = 1;i<=5;i++){
                    if(this[`select_num_${i}`] && this[`select_${i}_num`] == id){
                        this[`select_num_${i}`] = false
                        this[`select_${i}_num`] = 0
                        this[`lbl_select_${i}`].active = false
                        util.display(this[`select_${i}`],`img/lucky/wenhaohei`)
                        return
                    }
                }
            }
        }else if(this.type == 2){
            if(select){
                if(!this.lucky_num_1){
                    this.lucky_num_1 = true
                    this.lucky_1_num = id
                    this.lbl_lucky_1.active = true
                    this.lbl_lucky_1.setLabel(id)
                    util.display(this.lucky_1,`img/lucky/huangqiu`)
                    this.lucky_1.stopAllActions()
                    this.lucky_1.runAction(cc.sequence(cc.scaleTo(0.25,1.15,1.15),cc.scaleTo(0.25,1,1)))
                    return
                }
            }else{
                if(this.lucky_num_1 && this.lucky_1_num == id){
                    this.lucky_num_1 = false
                    this.lucky_1_num = 0
                    this.lbl_lucky_1.active = false
                    util.display(this.lucky_1,`img/lucky/wenhaohuang`)
                    return
                }
            }
        }
    },

    can_Select_Num(){
        if(this.type == 1){
            for(let i = 1;i<=5;i++){
                if(!this[`select_num_${i}`]){
                    return true
                }
            }
            return false
        }else if(this.type == 2){
            if(!this.lucky_num_1){
                return true
            }
            return false
        }
    },

    check_Select_All(){
        if(this.type == 1){
            for(let i = 1;i<=5;i++){
                if(!this[`select_num_${i}`]){
                    util.display(this.btn_next,`img/lucky/xiayibu_hui`)
                    this.can_next = false
                    return
                }
            }
            util.display(this.btn_next,`img/lucky/xiayibu`)
            this.can_next = true
        }else if(this.type == 2){
            if(!this.lucky_num_1){
                util.display(this.btn_next,`img/lucky/tijiao_hui`)
                this.can_next = false
                return
            }
            util.display(this.btn_next,`img/lucky/tijiao`)
            this.can_next = true
        }
    }
});
