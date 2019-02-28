import request from '../utils/system-request.js';
const service={};
export default service;
//加载数据
service.loadData=function (data) {
    return request({
        url:'/notify/pageNotify',
        method:'post',
        data:data
    });
};
//提交
service.submit=function (data) {
    return request({
        url:'/notify/add',
        method:'put',
        data:data
    })
}
