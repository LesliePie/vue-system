import request from '../utils/system-request.js';
const service={};
export default service;

service.getData=function (data) {
    return request({
        data:data,
        method:'post',
        url:'/feedback/pageFeedback'
    })
}
