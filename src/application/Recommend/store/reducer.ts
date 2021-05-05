import { fromJS } from "immutable";
import * as constantsTypes from './constants';

// 初始值
const defaultState = fromJS({
  bannerList: []
})

export default (state:any = defaultState, action:any) => {
  
  switch(action.type) {
    case constantsTypes.CHANGE_BANNER:
      return state.set('bannerList', action.data);
      
    default:
      return state
  }
  
}


