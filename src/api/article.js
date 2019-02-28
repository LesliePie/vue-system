import request from '../utils/system-request';
const article={};
export default article;
//加载数据
article.loadData=function (data) {
    return request({
        url:'/resource/pageResource',
        data:data,
        method:'post'
    })
};
//修改文章
article.update=function (data) {
    return request({
        url:'/resource/update',
        method:'patch',
        data:data
    })
}
