import React, { FC,forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react"
import BScroll from "better-scroll"
import styled from 'styled-components';

interface ScrollProps {
  children?: React.ReactNode,
  direction?: "vertical" | 'horizontal',
  refresh?: boolean,
  onScroll?: (e) => void ,
  pullUp?: () => void,
  pullDown?: () => void,
  pullUpLoading?: boolean,
  pullDownLoading?: boolean,
  bounceTop?: boolean,//是否支持向上吸顶
  bounceBottom?: boolean//是否支持向上吸顶
  click?: any,
}

const defaultProps: ScrollProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  // onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  // pullUp: null,
  // pullDown: null,
  bounceTop: true,
  bounceBottom: true
};

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`
const Scroll = (props: ScrollProps = defaultProps, ref: React.Ref<any>) => {
  const bScrollRef = useRef<any>(null);

  const scrollContaninerRef = useRef<any>(null);

  const { direction, click, refresh, bounceTop, bounceBottom } = props;

  const { pullUp, pullDown, onScroll } = props;

  useEffect(() => {
    console.log('scrollContaninerRef: ', scrollContaninerRef.current);
    const scroll:any = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === "horizontal",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    bScrollRef.current = scroll;
    return () => {
      // if (bScrollRef.current) bScrollRef.current = null;
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!bScrollRef.current || !onScroll) return;
    bScrollRef.current.on('scroll', (scroll: any) => {
      onScroll(scroll);
    })
    return () => {
      bScrollRef.current.off('scroll');
    }
  }, [onScroll, bScrollRef.current]);

  useEffect(() => {
    if (!bScrollRef.current || !pullUp) return;
    bScrollRef.current.on('scrollEnd', () => {
      //判断是否滑动到了底部
      if (bScrollRef.current.y <= bScrollRef.current.maxScrollY + 100) {
        pullUp();
      }
    });
    return () => {
      bScrollRef.current.off('scrollEnd');
    }
  }, [pullUp, bScrollRef.current]);

  useEffect(() => {
    if (!bScrollRef.current || !pullDown) return;
    bScrollRef.current.on('touchEnd', (pos: { y: number }) => {
      //判断用户的下拉动作
      if (pos.y > 50) {
        pullDown();
      }
    });
    return () => {
      bScrollRef.current.off('touchEnd');
    }
  }, [pullDown, bScrollRef.current]);


  useEffect(() => {
    if (refresh && bScrollRef.current) {
      bScrollRef.current.refresh();
    }
  });

  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScrollRef.current) {
        bScrollRef.current.refresh();
        bScrollRef.current.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if (bScrollRef.current) {
        return bScrollRef.current;
      }
    }
  }));


  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
    </ScrollContainer>
  );
}

export default forwardRef(Scroll);
