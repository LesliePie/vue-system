import request from '../utils/system-request.js';
import front from "../utils/front-request";
const dictionay={};
export default  dictionay;
//获取树形字典
dictionay.tree=function () {
    return request({
        url:'/dictionary',
        method:'get',
        data:{}
    })
};
//删除字典
dictionay.delete=function (data) {
    return request({
        url:'/dictionary/'+data,
        method:'delete'
    })
};
//字典详情
dictionay.detail=function(data){
    return request({
        url:'/dictionary/'+data,
        method:'get'
    })
}
//编辑字典
dictionay.update=function (data) {
        return request({
            url:'/dictionary',
            method:'patch',
            data:data,
            headers:{'Content-Type': 'multipart/form-data'}
        })
};
//新增字典
dictionay.add=function (data) {
    return request({
        url:'/dictionary',
        data:data,
        method:'put',
        headers:{'Content-Type': 'multipart/form-data'}
    })
}
//获取子类树
dictionay.getChildTree=function (data) {
    return front({
        url:'/dictionary/tree/'+data,
        method:'get'
    })
};
//根据parentId获取列表
dictionay.pageByParentId=function (data) {
    return front({
        url:'/dictionary',
        method:'post',
        data:data
    })
}
