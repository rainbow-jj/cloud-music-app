import { fromJS } from "immutable"; // 把JS数据转换成immutable数据结构
import * as constantsTypes from './constants'; 

// 初始值
const defaultState = fromJS({
  bannerList: [],
  recommendList: [],
  enterLoading: true,
});

export default (state = defaultState, action) => {
  switch(action.type) {
    case constantsTypes.CHANGE_BANNER:
      return state.set('bannerList', action.data);
    case constantsTypes.CHANGE_RECOMMEND_LIST:
      return state.set('recommendList', action.data);  
    case constantsTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    default:
      return state
  }
  
}


