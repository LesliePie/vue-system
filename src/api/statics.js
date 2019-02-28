import request from '../utils/system-request';

const statics ={};
export default statics;
//首页人数，资源量统计
statics.banner=function () {
    return request({
        url:'/statics/bannerStatics',
        methods:'get',
        data:{}
    })
}
