import request from '../utils/front-request';
import system from '../utils/system-request';
const recommend={};
export default recommend;

//获取推荐看法/提问
recommend.getArticles=function (data) {
    return request({
        url:'/article/pageRecommendArticles',
        data:data,
        method:'post'
    })
}
// 获取推荐用户
recommend.getUsers=function (data) {
    return request({
        url:'/user/pageRecommendUsers',
        data:data,
        method:'post'
    })
}
//获取推荐圈子
recommend.getCircles=function (data) {
    return request({
        url:'/discussCircle/pageRecommendCircles',
        data:data,
        method:'post'
    })
}
//移除圈子
recommend.delete=function (data) {
    return system({
        url:'/recommend/remove',
        data:data,
        method:'delete'
    })
}
//获取详情
recommend.getOrder=function (data) {
    return system({
        url:'/recommend/detail',
        data:data,
        method:'post'
    })
};
//修改其排序
recommend.update=function (data) {
    return system({
        url:'/recommend/updateOrder',
        data:data,
        method:'post'
    })
}
