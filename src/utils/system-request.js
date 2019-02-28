import axios from 'axios';
import router from "../router";
import auth from './auth'
const requset=axios.create({
    //local
    baseURL:'http://localhost:8080/'
    //内网
    //baseURL:'http://192.168.29.16:8099/system/'
    //远程阿里云
     // baseURL:'http://api.shihu45.com/system/'
});
requset.interceptors.request.use(config=>{
    let token=auth.getToken();
    if (token){
        config.headers.common['__token']=token;
    }
    return config;
});
//response拦截器
requset.interceptors.response.use(res=>{
    if (res.data.code=="401"){
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
});
export default requset;
