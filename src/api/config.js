import axios from 'axios';

export const baseUrl = 'http://192.168.3.7:4000/';

//axios 的实例以及拦截器配置
const axiosInstance = axios.create({
  baseURL: baseUrl
})

// // 添加请求拦截器
axiosInstance.interceptors.response.use(
  // 对响应数据做点什么
  res => res.data,
  // 对响应错误做点什么
  err => {console.log(err,'网络错误')}
)

export {axiosInstance};