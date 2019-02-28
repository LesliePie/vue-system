import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import {formatUrl} from "./components/common/formatUrl.js";
import { Loading } from 'element-ui';
import auth from './utils/auth';
Vue.use(ElementUI, { size: 'small' });
Vue.use(Vuex);
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
})
//全局缓存用户信息
const store=new Vuex.Store({
    state:{
        //用户信息
        user:{}
    },
    mutations:{
        updateUserInfo(state,newUserInfo){
            state.user = newUserInfo;
        }
    },
    getters: {
        user:state => state.user
    }
})
/*const requset={};
requset.requestSys=axios.create({
    baseURL:'http://localhost:90/'
})
requset.requestFront=axios.create({
    baseURL:'http://www.shihu45.com/'
})
//axios request请求拦截器
requset.requestSys.interceptors.request.use(config=>{
    let token=localStorage.getItem("token");
    if (token){
        config.headers.common['__token']=token;
    }
    return config;
});
//response拦截器
requset.requestSys.interceptors.response.use(res=>{
    const data=res.data;
    if (data.code=="999999"){
        router.push("/login");
    } else{
        return res;
    }},error => {
    if (error&&error.response){
        switch (error.response.status){
            case 401:
                router.push("/login");
        }
        return Promise.reject(error)
    }
})*/
//构建vue
new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');

