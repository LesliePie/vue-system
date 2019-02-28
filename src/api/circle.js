import request from '../utils/system-request';
const service={};
export default service;
//加载圈子
service.loadData=function () {
    return request({
        url:'/circle/selectData',
        method:'post'
    })
}
//新增或修改
service.saveOrUpdate=function (data) {
    return request({
        url:'circle/saveOrUpdate',
        method:'post',
        headers:{'Content-Type': 'multipart/form-data'},
        data:data
    })
}
//删除
service.delete =function (data) {
    return request({
        url:'/circle/'+data,
        method:'delete'
    })
}
service.addRecommend=function (data) {
    return request({
        url:'/circle/'+data,
        method:'put'
    })
}
