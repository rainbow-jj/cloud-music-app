import { fromJS } from "immutable";
import * as actionTypes from './constants';

export const changerBannerList = (data:object) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data)
})
