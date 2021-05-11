import { fromJS } from "immutable";
import * as actionTypes from './constants';

const defaultState = fromJS({
  artist:{},
  loading:true,
  songOfArtist:[],
})

export default (state:any = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_ARTIST:
      return state.set('artist',action.data);
    case actionTypes.CHANGE_SONG_OF_ARTIST:
      return state.set('songOfArtist', action.data);
    case actionTypes.CHANGE_LOADING:
      return state.set('loading',action.data);
    default:
      return state;
  }
}