// 用于封装不同的网络请求ajax请求
import { axiosInstance } from './config';

export const getBannerRequest = () => {
  return axiosInstance.get('/banner');
}

// 获取 '推荐歌单'
export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized');
}

// 获取 ‘热门歌手’
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`)
}

// 获取 歌手分类列表
export const getSingerListRequest = (category,alpha, count) => {
  // return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
  return axiosInstance.get(`/artist/list?type=${category}&area=${count}&initial=${alpha.toLowerCase()}`);

}

export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`);
}


export const getAlbumDetailRequest = (id) => {
  return axiosInstance.get(`/playlist/detail?id=${id}`)
}

// 获取歌手单曲
export const getSingerInfoRequest = (id) => {
  return axiosInstance.get(`/artists?id=${id}`)
}