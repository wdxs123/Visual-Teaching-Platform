import axios from 'axios';
import {useUserStore}from '@/stores'
import { ElMessage } from 'element-plus';
import router from '@/router';

const baseURL = 'http:/big-event-vue-apt-t.itheima.net'; 
// 或者想更灵活，比如截取到端口部分，也可用 window.location.href 再处理
// 比如 const baseUrl = window.location.href.split('/#')[0] （若有路由哈希情况，根据实际调整）

// 后续若用 axios 之类的请求库，可这样配置

const instance = axios.create({
  baseURL,
  timeout:10000
  // 其他配置...
});

// 请求拦截器
instance.interceptors.request.use(
    (config)=>{
        const useStore=useUserStore()
        if(useStore.token){
            config.headers.Authorization=useStore.token
        }

        return config
    },
    (err)=>Promise.reject(err)
)

// 相应拦截器
instance.interceptors.response.use(
    (res)=>{
    if(res.data.code===0){
        return res
    }
    ElMessage.error(res.data.message||'服务异常')


    return Promise.reject(res.data)
},
(err)=>{
    if(err.response?.status===401){
        router.push('/login')
    }


    ElMessage.error(err.response.data.message||'服务异常')
    return Promise.reject(err)
}
)
    



export default instance;
export {baseURL}