var baseNode = require("baseNode")
var entityFactory = require("entityFactory")
var regeneratorRuntime = require("runtime")
const List = require('List');

cc.Class({
    extends: baseNode,

    properties: {
        list:List,
    },


    start () {
        GM.gameCtrl = this
        this.breathe_begin = false
        this.breathe_time = 0
        this.breathe_object = undefined
        this.opt_item_set = []
        this.item_data = []
        this.already_select_lucky = false
        this.select_1 = 0
        this.select_2 = 0
        this.select_3 = 0
        this.select_4 = 0
        this.select_5 = 0
        this.select_6 = 0

        this.open_scratch_num = 0

        this.node_scrollview.on('scroll-began', this.all_stop_action, this);
        this.node_scrollview.on('scroll-ended', this.breathe_began, this);
        this.initData()
        this.init()
    },

    initData(){
        this.item_data = [
            {
                type : 2,
                id: 1,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
            {
                type : 1,
                id: 1,
            },
            {
                type : 1,
                id: 2,
            },
            {
                type : 1,
                id: 3,
            },
        ]
    },
    /**
     * 刷新数据
     */
    refreshData(idx){
        this.list.aniDelItem(idx,function () {
            this.item_data.splice(idx,1)
            this.list.numItems = this.item_data.length;
            // this.item_content.y --
            let i = (idx - 1>=0)?idx - 1 : 0
            this.list.scrollTo(idx-1)
            this.breathe_began()
        }.bind(this), this)
        
        let entity = {
            parent : this.node_main,
        }
        new entityFactory().createEntity(entity,`ui/game/enenyAddTop`,`enenyAddTop`,`enenyAddTop`)


    },

    set_scratch_info(entity){
        this.scratch_entity = entity
    },

    open_scratch(){
        this.open_scratch_num = 0
        new entityFactory().createEntity(this.scratch_entity,`ui/game/enenyItem02`,`enenyItem02`,`enenyItem02`)
    },

    addMoney(money){
        let entity = {
            money : money,
            parent : this.node_main,
        }
        new entityFactory().createEntity(entity,`ui/game/enenyAddmoney`,`enenyAddmoney`,`enenyAddmoney`)
    },

    init(){
        this.list.calcCustomSize(this.item_data.length);
        this.list.numItems = this.item_data.length;
        this.breathe_began()
        GM.uiLoading.dead()
    },

    onListRender(item, idx) {
     
        // let avatarNode = item.getChildByName('avatarNode');
        // console.log(idx)

        let prefabJS = item.getComponent("enenyItem01")
        if(!prefabJS){
            item.addComponent(require("enenyItem01"))
            prefabJS = item.getComponent("enenyItem01");
        }
        prefabJS.init(this.item_data[idx],idx)
    },


    update(dt){
        if (dt > 0.2) {//低于5帧不做处理
            return
        }
        if(!this.breathe_begin && this.breathe_object){
            if(Date.now() - this.breathe_time>5000){
                this.breathe_begin = true
                this.breathe_object.play_breathe()
            }
        }
    },

    // breathe_end(){
        // if(this.breathe_begin){
            // this.breathe_begin = false
            // if(this.breathe_object){
                // this.all_stop_action()
            // }
        // }
    // },

    breathe_began(){
        for(let temp in this.item_content.children){
            if(this.item_content.children[temp].y + this.item_content.y < - this.item_content.children[temp].height/2){
                if(this.breathe_object && this.breathe_object.node && this.breathe_object.node.parent && this.item_content.children[temp].y + this.item_content.y > this.breathe_object.node.y + this.breathe_object.node.parent.y){
                    this.breathe_object = this.item_content.children[temp].getComponent("enenyItem01")
                }else if(!this.breathe_object){
                    this.breathe_object = this.item_content.children[temp].getComponent("enenyItem01")
                }
            }
        }
        this.breathe_time = Date.now()
    },

    all_stop_action(){
        this.breathe_begin = false
        for(let temp in this.item_content.children){
            if(this.item_content.children[temp]){
                let js = this.item_content.children[temp].getComponent("enenyItem01")
                if(js){
                    js.stop_breathe()
                }
            }
        }
        this.breathe_object = undefined
    },
});
