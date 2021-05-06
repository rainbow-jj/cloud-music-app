// 用于封装不同的网络请求
import { axiosInstance } from './config';

export const getBannerRequest = () => {
  return axiosInstance.get('/banner');
}

export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized');
}