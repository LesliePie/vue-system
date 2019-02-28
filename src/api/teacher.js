import request from '../utils/system-request';
const service={};
export default service;
//获取详情
service.detail=function (data) {
    return request({
        url:'/teacherAuthorization/'+data,
        method:'get'
    })
}
//获取分页数据
service.loadData=function (data) {
    return request({
        url:'/teacherAuthorization/pageAuthorization',
        method:'post',
        data:data
    })
}
//修改
service.update=function (data) {
    return request({
        url:'/teacherAuthorization/update',
        method:'post',
        data:data
    })
}

