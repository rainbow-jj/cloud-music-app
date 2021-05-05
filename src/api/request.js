// 用于封装不同的网络请求
import { axiosInstance } from './config';

export const getBannerList = () => {
  return axiosInstance.get('/banner');
}