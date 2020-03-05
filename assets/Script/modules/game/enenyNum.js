var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,

    properties: {
    },

    start () {
      this.addEvent()
    },

    init(eneny){
        this.select = false
        this.id = eneny.id
        this.node.zIndex = this.id
        this.js_Lucky = eneny.js_Lucky
        this.node.parent = this.js_Lucky.p_layout
        this.lbl_num.setLabel(this.id)
    },  

    addEvent(){
        this.node.quickBt(() => {
            this.check_select_state()
        }); 
    },

    initData(){
        this.no_select()
    },

    check_select_state(){
        if(this.select){
            this.no_select()
        }
        else if(this.js_Lucky.can_Select_Num()){
            this.yes_select()
        }
        this.js_Lucky.check_Select_All()
    },

    no_select(){
        this.select = false
        // util.display(this.node,`img/lucky/heiqiu`)
        this.sp_bg.active = false
        this.js_Lucky.change_Select_Num(false,this.id)
    },

    yes_select(){
        this.select = true
        this.sp_bg.active = true
        // util.display(this.node,`img/lucky/hongqiu`)
        this.js_Lucky.change_Select_Num(true,this.id)
    },
});
