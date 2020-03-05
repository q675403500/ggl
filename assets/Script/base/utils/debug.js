//游戏报错收集
var hasPost = []
var olderror = console.error
console.error = function(msg) {
    olderror.call(this,msg);
}