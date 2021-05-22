import { fromJS } from "immutable";
import { SET_CURRENT_INDEX, SET_CURRENT_SONG, SET_FULL_SCREEN, SET_MODE, SET_PLAYING, SET_PLAY_LIST, SET_SEQUENCE_PLAY_LIST, SET_SHOW_PLAY_LIST, DELETE_SONG } from "./constants";

export const changeFullScreen = (data) => ({
  type: SET_FULL_SCREEN,
  data
})

export const changePlaying = (data) => ({
  type: SET_PLAYING,
  data
})

export const changeSequencePlayList = (data) => ({
  type: SET_SEQUENCE_PLAY_LIST,
  data: fromJS(data)
})

export const changePlayList = (data) => ({
  type: SET_PLAY_LIST,
  data: fromJS(data)
})

export const changeMode = (data) => ({
  type: SET_MODE,
  data
})

export const changeCurrentIndex = (data) => ({
  type: SET_CURRENT_INDEX,
  data
})

export const changeShowPlayList = (data) => ({
  type: SET_SHOW_PLAY_LIST,
  data
})

export const changeCurrentSong = (data) => ({
  type: SET_CURRENT_SONG,
  data: fromJS(data)
})

export const deleteSong = (data) => ({
  type: DELETE_SONG,
  data
})
