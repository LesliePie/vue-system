import request from '../utils/system-request';
const service={};
export default service;
//加载数据
service.loadData=function (data) {
    return request({
        url:'/circleArticle/pageArticles',
        data:data,
        method:'post'
    })
}
//添加到推荐
service.addRecommend=function (data) {
    return request({
        url:'/circleArticle/'+data,
        method:'put'
    })
}
