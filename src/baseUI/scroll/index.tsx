import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, useMemo } from "react"
import BScroll from "better-scroll"
import { ScrollContainer, PullDownLoading ,PullUpLoading } from './style';
import Loading from '../../baseUI/loading';
import LoadingV2 from "../loading-v2";
import { debounce } from '../../api/utils';

export type Direction = 'vertical' | 'horizontal';
interface ScrollProps {
  children?: React.ReactNode,
  refresh?: boolean,
  direction?: Direction,
  onScroll?: ((e) => void) | null,
  pullUp?: (() => void) | null,
  pullDown?: (() => void) | null,
  pullUpLoading?: boolean,
  pullDownLoading?: boolean,
  bounceTop?: boolean,//是否支持向上吸顶
  bounceBottom?: boolean//是否支持向上吸顶
  click?: boolean,
}

const defaultProps: ScrollProps = {
  // direction: 'vertical',
  click: false,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
};


const Scroll = (props: ScrollProps = defaultProps, ref: React.ForwardedRef<any>) => {
  const [bScrollState, setBScrollState] = useState<any>();
  // const bScrollRef = useRef<any | null>(null);
  const scrollContaninerRef = useRef<any>(null);

  const { direction, click, refresh, bounceTop, bounceBottom ,pullUpLoading, pullDownLoading} = props;

  const { pullUp, pullDown, onScroll } = props;

  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300)
  }, [pullUp])
  
  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  },[pullDown]);

  useEffect(() => {
    if (!scrollContaninerRef.current) return;
    console.log('scrollContaninerRef: ', scrollContaninerRef.current);
    const scroll:any = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === "horizontal",
      // scrollX: true,
      scrollY: direction === "vertical",
      mouseWheel: true,
      probeType: 3,
      click: true,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    setBScrollState(scroll);
    return () => {
      // if (bScrollState) bScrollState = null;
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!bScrollState || !onScroll) return;
    
    bScrollState.on('scroll', (scroll: any) => {
      onScroll(scroll);
    })
    return () => {
      bScrollState.off('scroll');
    }
  }, [onScroll, bScrollState]);

  useEffect(() => {
    if (!bScrollState || !pullUp) return;
    bScrollState.on('scrollEnd', () => {
      //判断是否滑动到了底部
      if (bScrollState.y <= bScrollState.maxScrollY + 100) {
        pullUpDebounce();
      }
    });
    return () => {
      bScrollState.off('scrollEnd');
    }
  }, [pullUp, pullUpDebounce, bScrollState]);

  useEffect(() => {
    if (!bScrollState || !pullDown) return;
    bScrollState.on('touchEnd', (pos: { y: number }) => {
      //判断用户的下拉动作
      if (pos.y > 50) {
        pullDownDebounce();
      }
    });
    return () => {
      bScrollState.off('touchEnd');
    }
  }, [pullDown, pullUpDebounce, bScrollState]);


  useEffect(() => {
    if (refresh && bScrollState) {
      bScrollState.refresh();
    }
  });

  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScrollState) {
        bScrollState.refresh();
        bScrollState.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if (bScrollState) {
        return bScrollState;
      }
    }
  }));
  // 上拉刷新功能
  const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
  const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
  return (
      <ScrollContainer ref={scrollContaninerRef}>
        {props.children}
        {/* 滑到底部加载动画 */}
        <PullUpLoading style={PullUpdisplayStyle}><Loading></Loading></PullUpLoading>
        {/* 顶部下拉刷新动画 */}
        <PullDownLoading style={PullDowndisplayStyle}><LoadingV2></LoadingV2></PullDownLoading>
      </ScrollContainer>
  );
}

export default forwardRef(Scroll);
