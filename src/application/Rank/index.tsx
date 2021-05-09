import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getRankList } from './store';
import { filterIndex } from '../../api/utils';
import Scroll from '../../baseUI/scroll';
import { SongList, List, ListItem, Container} from './style';
import { EnterLoading } from '../Singers/style';
import Loading from '../../baseUI/loading';
import { renderRoutes } from 'react-router-config';

// interface RankProps  {
//   globalRank: any,
//   rankList?: any,
//   loading?: boolean,
//   getRankListDataDispatch,
//   tracks: any
// }

const Rank = (props) => {
  const {rankList:list, loading} = props;
  const { getRankListDataDispatch } = props;

  let rankList = list ? list.toJS() : [];

  useEffect(() => {
    getRankListDataDispatch()
  },[]);

  // 数据处理 官方网和全球榜
  let globalStartIndex = filterIndex(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);

  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`)
  
  }

  const randerSongList = (list) => {
    return list.length ?  (
      <SongList>
        {
          list.map((item,index) => {
            return <li key={index}>{index +1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  }

  // 榜单数据未加载出来之前个隐藏
  let displayStyle = loading ? { "diaplay": "none" } : { "display": ""};

  const renderRankList = (list, global = false) => {
    return (
      <List globalRank={global}>
        {
        list.map((item) => {
          return (
            <ListItem key={item.coverImgId} tracks={item.tracks} onClick={() => enterDetail(item)}>
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt="" />
                <div className="decorate"></div>
                <span className="update_frequecy">{item.updateFrequency}</span>
              </div>
              { randerSongList(item.tracks)}
            </ListItem>
          )
        })
        }
      </List>
    )
  }

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>官方榜</h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>全球榜</h1>
          {renderRankList(globalList, true)}
          { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  )
}

const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading'])
})

const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDataDispatch() {
      dispatch(getRankList());
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));