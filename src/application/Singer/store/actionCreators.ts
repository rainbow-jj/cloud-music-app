import { fromJS } from 'immutable';
import { CHANGE_ARTIST, CHANGE_SONG_OF_ARTIST, CHANGE_LOADING} from './constants';
import { getSingerInfoRequest } from '../../../api/request';

const changeArtist = (data) => ({
  type: CHANGE_ARTIST,
  data: fromJS(data)
})

export const changeLoading = (data) => ({
  type: CHANGE_LOADING,
  data
})

const changeSongOfArtist = (data) => ({
  type: CHANGE_SONG_OF_ARTIST,
  data: fromJS(data)

})

export const getSongerInfo = (id) => {
  return dispatch => {
    getSingerInfoRequest(id).then( (data:any) => {
      dispatch(changeArtist(data.artist));
      dispatch(changeLoading(false));
      dispatch(changeSongOfArtist(data.hotSongs))
    })
  }
}