import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import locomotiveScroll from 'locomotive-scroll';

const Container = styled.div`
  height: 100%;
  background: #eee;
  /* overflow: hidden; */
  overflow: scroll;
`;

const ScrollSection = styled.div`
  padding: 10vh 10vh 10vh 10vmax;
  min-width: 550vh;
`;

const Item = styled.div`
  display: inline-block;
  position: relative;
  margin: 0 -30vh 0 3vh;

  /* &:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  } */
`;

const BigItem = styled(Item)`
  height: 80vh;
  width: 60vh;
`;

const BigItemH = styled(Item)`
  height: 60vh;
  width: 80vh;
`;

const NormalItem = styled(Item)`
  height: 60vh;
  width: 45vh;
  z-index: 1;

  & :nth-of-type(3n) {
    bottom: 5vh;
  }

  &:nth-of-type(4n) {
    bottom: -5vh;
  }
`;

const NormalItemH = styled(Item)`
  height: 45vh;
  width: 60vh;
`;

const SmallItem = styled(Item)`
  height: 40vh;
  width: 30vh;
  z-index: 2;

  &:nth-of-type(3n) {
    bottom: 13vh;
  }

  &:nth-of-type(4n) {
    bottom: -13vh;
  }
`;

const SmallItemH = styled(Item)`
  height: 30vh;
  width: 40vh;
  z-index: 2;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* filter: grayscale(1);
  opacity: 0;
  pointer-events: none;
  transform: translateX(0) translateY(0) scale(1);
  transition: filter 0.3s ease, opacity 1s ease, transform 1s ease; */
`;

export default function Achievement() {
  const containerRef = useRef(null);

  useEffect(() => {
    const scroll = new locomotiveScroll({
      el: containerRef.current,
      smooth: true,
    });
    return () => scroll.destroy();
  }, []);

  return (
    <Container data-scroll-container ref={containerRef}>
      <ScrollSection data-scroll-section>
        <NormalItem data-scroll data-scroll-speed="2">
          <Image src="https://picsum.photos/id/1005/300/400" />
        </NormalItem>
        <BigItem className="-big" data-scroll data-scroll-speed="1">
          <Image src="https://picsum.photos/id/1019/600/800" />
        </BigItem>
        <SmallItemH data-scroll data-scroll-speed="4">
          <Image src="https://picsum.photos/id/1027/400/300" />
        </SmallItemH>
        <NormalItem data-scroll data-scroll-speed="3">
          <Image src="https://picsum.photos/id/1028/300/400" />
        </NormalItem>
        <NormalItemH data-scroll data-scroll-speed="2">
          <Image src="https://picsum.photos/id/1041/400/300" />
        </NormalItemH>
      </ScrollSection>
    </Container>
  );
}
