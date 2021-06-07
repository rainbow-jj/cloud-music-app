import React, {useEffect, useRef, useState, useMemo} from 'react'
import styled from 'styled-components';
// import { useForm , Controller, SubmitHandler} from "react-hook-form";
import style from '../../assets/global-style';
import { debounce } from '../../api/utils';

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width:100%;
  padding:0 6px;
  padding-right: 20px;
  height: 40px;
  background: ${style["theme-color"]};
  .icon-back {
    font-size: 24px;
    color: ${style["font-color-light"]};
  }
   .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${style["theme-color"]};
    color: ${style["highlight-background-color"]};
    font-size: ${style["font-size-m"]};
    outline: none;
    border: none;
    border-bottom: 1px solid ${style["border-color"]};
    &::placeholder {
      color: ${style["font-color-light"]};
    }
  }
  .icon-delete {
    font-size: 16px;
    color: ${style["background-color"]};
  }
`

const SearchBox = (props) => {
  const { handleQuery } = props;
  // const { handleSubmit, control, reset } = useForm<IFormInputs>();
  // const onSubmit: SubmitHandler<IFormInputs> = data => console.log(data);
  const queryRef = useRef<any>();
  const [query, setQuery] = useState('');
  const { newQuery } = props;
  const displayStyle = query ? {display: 'block'}:{display: 'none'};

  useEffect(() => {
    queryRef.current.focus();
  }, [])

  useEffect(() => {
    if (newQuery !== query) {
      setQuery(newQuery);
    }
  }, [newQuery])

  const clearQuery = () => {
    setQuery('');
    queryRef.current.focus();
  }

  const handleChange = (e) => {
    // console.log('e', e.currentTarget.value)
    setQuery(e.currentTarget.value)
  }

  //缓存方法
  let handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500)
  }, [handleQuery]);

  useEffect(() => {
    // 防抖
    handleQueryDebounce(query)
  }, [query]);
  
  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back()}>&#xe655;</i>
        <input className="box" ref={queryRef} placeholder="搜索歌曲，歌手，专辑" value={query} onChange={handleChange}></input>
      <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>&#xe600;</i>
    </SearchBoxWrapper>
  )
}

export default SearchBox;