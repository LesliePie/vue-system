export function formatUrl(url) {
    return "http://www.shihu45.com/resource"+url;
}
/*function test(data) {
    //68 365355 - /
    //非数字
    if (isNaN(data)){
        if (data.startsWith("-")||data.startsWith("/")||data.split("-").length>2||data.split("/").length>2||
        data.endsWith("-")||data.endsWith("/")){
            this.$message.warning("不符合格式")
        } else {

        }
    }else{
        if (data<68){
            this.$message.warning("应该小于68")
            return;
        } else if (data>365355){
            this.$message.warning("应该不大于365355")
        }
    }
}*/
