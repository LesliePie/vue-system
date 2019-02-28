import request from '../utils/system-request';
const service={};
export default service;
//获取用户信息
service.loadData=function (data) {
    return request({
        url:'/user',
        data:data,
        method:'post'
    })
};
service.getUser=function (id) {
    return request({
        url:'/user/'+id,
        method:'get'
    })
};
//添加至推荐
service.addRecommend=function (data){
    return request({
        url:'/user/'+data,
        method:'put'
    })
}
