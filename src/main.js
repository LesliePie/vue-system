import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import {formatUrl} from "./components/common/formatUrl.js";
import {formatDate} from "./components/common/formatDate.js";
import { Loading } from 'element-ui';
Vue.use(ElementUI, { size: 'small' });
Vue.use(Vuex);
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
     let user=store.getters.user;
      let  token=localStorage.getItem("token");
    axios.defaults.headers.common['__token'] =token;
    if((!token||!user)&& to.path !== '/login'){
        next('/login');
    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        user.login === 'admin' ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})
const store=new Vuex.Store({
    state:{
        //用户信息
        user:{
            login: null,
            id:null,
            name:null,
            roles: [],
            resources: []
        }
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
//构建vue
new Vue({
    watch:{
        router:'checkLogin'
    },
    created(){
        this.checkLogin();
    },
    methods:{
        checkLogin(){
            axios.get("/admin/userInfo",{}).then(res=>{
                if (res.data.code=="000000") {
                    this.$store.commit('updateUserInfo',res.data.data)
                }else if (res.data.code="999999"){
                    router.push('/login');
                }else{
                    console.log("错误信息",res.data.msg)
                }
            }).catch(function (error) {
                router.push('/login');
                if (error.response){
                    this.$message.warning(error.response.msg);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }else{
                    console.log("网络错误")
                }
            })
        }
    },
    store,
    router,
    render: h => h(App)
}).$mount('#app');

