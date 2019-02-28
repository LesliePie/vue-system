import request from '../utils/system-request.js';
const service={};
service.login=function (data) {
    return request({
        url:'/login',
        method:'post',
        data:data
    })
};

export default service;
