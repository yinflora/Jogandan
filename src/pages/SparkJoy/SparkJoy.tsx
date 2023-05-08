import React, { useState, useMemo, useRef, useContext, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import AuthContext from '../../context/authContext';
import { Timestamp } from 'firebase/firestore';
import styled, { keyframes } from 'styled-components/macro';
import { updateItem } from '../../utils/firebase';
import circle from './circle-blue.png';
import cross from './cross-blue.png';
import undo from './undo.png';
import { useNavigate } from 'react-router-dom';

import Check from '../../components/Icon/Check';
import Cancel from '../../components/Icon/Cancel';
import Button from '../../components/Button/Button';

import { TfiArrowRight } from 'react-icons/tfi';
import { RxCross1 } from 'react-icons/rx';

import sparkJoy from './sparkJoy.png';
import swipeIcon from './swipe.png';

import Happy from '../../components/Alert/Happy';

const Container = styled.div`
  display: flex;
  width: 100vw;
  margin-top: 150px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: default;
`;

const BackgroundContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 45vh;
  z-index: -1;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 90%;
    background-color: #8d9ca4;
  }
`;

const ChoiceContainer = styled.div`
  display: flex;
  height: 10%;
  justify-content: space-between;
  align-items: end;
  padding: 0 10%;
`;

// const Background = styled.div`
//   position: absolute;
//   z-index: -1;
//   bottom: 0;
//   width: 100vw;
//   /* height: 250px; */
//   height: 30vh;
//   background-color: #8d9ca4;
// `;

const Choice = styled.p`
  font-size: 4rem;
  font-weight: 600;
  line-height: 2.5rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #8d9ca4;
`;

// const Yes = styled(Choice)`
//   position: absolute;
//   z-index: -1;
//   right: 10%;
//   /* bottom: 250px; */
//   bottom: 30vh;
// `;

// const No = styled(Choice)`
//   position: absolute;
//   z-index: -1;
//   left: 10%;
//   /* bottom: 250px; */
//   bottom: 30vh;
// `;

const QuestionText = styled.p`
  position: relative;
  font-size: 1.5rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #000;

  ::after {
    content: '${(props) => (props.children as string).slice(-4)}';
    color: #8d9ca4;
    position: absolute;
    right: 0;
  }
`;

const CardContainer = styled.div`
  position: relative;
  width: 300px;
  height: 450px;
  margin: 20px auto 20px;
`;

const EndingCard = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  flex-direction: column;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 90px rgba(0, 0, 0, 0.15);
  gap: 10px;
`;

const EndingText = styled.p`
  text-align: center;
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0.2rem;
  color: #8d9ca4;
`;

const EndingPrompt = styled.p`
  margin-top: 20px;
  text-align: center;
  font-size: 1rem;
  letter-spacing: 0.1rem;
`;

const TinderCardWrapper = styled(TinderCard)`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  cursor: grab;
`;

const Card = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  background-size: cover;
  background-position: center;
`;

const InfoWrapper = styled.div`
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  gap: 10px;
`;

const Category = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.1rem;
`;

const Name = styled.p`
  width: 100%;
  height: 1.5rem;
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StatusWrapper = styled.div`
  display: flex;
  margin: auto 0 0 auto;
  flex-direction: column;
  align-self: flex-end;
  justify-content: center;
  align-items: center;
`;

const StatusIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const Undo = styled.img`
  position: absolute;
  top: 0;
  right: -40px;
  width: 30px;
  height: 30px;

  &:hover {
    cursor: pointer;
  }
`;

const Status = styled.p`
  text-align: center;
  letter-spacing: 0.1rem;
  color: #8d9ca4;
`;

const ChooseButton = styled.button`
  transition: transform 0.2s ease-in-out;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    cursor: pointer;
  }

  &:hover:disabled {
    cursor: not-allowed;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 900;
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Toast = styled.div`
  position: relative;
  display: flex;
  z-index: 991;
  width: 600px;
  height: 600px;
  flex-direction: column;
  justify-content: end;
  background-color: rgba(141, 156, 164, 0.9);

  & > .close {
    position: absolute;
    top: -30px;
    right: 0;
    width: 20px;
    height: 20px;
    color: #fff;

    &:hover {
      cursor: pointer;
    }
  }
`;

const SloganWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0 10px 0 30px;
  flex-direction: column;
`;

const fadeIn = keyframes`
   from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const MainSlogan = styled.p`
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 3.25rem;
  letter-spacing: 0.1rem;
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
  animation-delay: 0.3s;
`;

const SubSlogan = styled.p`
  margin-top: 15px;
  letter-spacing: 0.1rem;
  color: #b5b4b4;
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
  animation-delay: 0.6s;
`;

const Start = styled.p`
  position: relative;
  margin: 0;
  font-size: 2rem;
  color: #000;

  &::before {
    position: absolute;
    content: 'START';
    width: 0%;
    inset: 0;
    color: #8d9ca4;
    overflow: hidden;
    transition: 0.3s ease-out;
  }
`;

const StartButton = styled.button`
  margin: 30px 10px 30px 0;
  align-self: flex-end;
  width: fit-content;
  padding: 0;
  border: none;
  background: none;
  position: relative;
  display: flex;
  font-weight: 600;
  font-size: 2rem;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;

  opacity: 0;
  animation: ${fadeIn} 1s forwards;
  animation-delay: 1.2s;

  &::after {
    position: absolute;
    content: '';
    width: 0;
    left: 0;
    bottom: -7px;
    background: #8d9ca4;
    height: 2px;
    transition: 0.3s ease-out;
  }
  &:hover::after {
    width: 100%;
  }
  &:hover ${Start}::before {
    width: 100%;
  }
  &:hover .startArrow {
    transform: translateX(4px);
    color: #8d9ca4;
  }

  & .startArrow {
    z-index: 992;
    width: 20px;
    height: 20px;
    stroke-width: 1px;
    transition: 0.2s;
    transition-delay: 0.2s;
  }
`;

const GuideContainer = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 60px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 10px;
`;

const swipeAnimation = keyframes`
  0% {transform: translateX(0)}
  25% {transform: translateX(-50%)}
  75% {transform: translateX(50%)}
  100% {transform: translateX(0)}
`;

const SwipeIconWrapper = styled.div`
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SwipeIcon = styled.img`
  width: 80px;
  height: 80px;
  animation: ${swipeAnimation} 5s infinite;
`;

const SwipeDescription = styled.p`
  font-size: 1rem;
  line-height: 1.25rem;
`;

const GuideTitle = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.1rem;
  text-align: center;
`;

const GuideDescription = styled.p`
  font-size: 1rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.1rem;
  text-align: center;
`;

type Item = {
  id: string;
  name: string;
  status: string;
  category: string;
  created: Timestamp;
  processedDate: string;
  description: string;
  images: string[];
};

type Items = Item[];
type API = any; //!Fixme

export default function SparkJoy() {
  const { uid, items } = useContext(AuthContext);
  const navigate = useNavigate();

  const [randomItems, setRandomItems] = useState<Items | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(9);
  const [gamePopout, setGamePopout] = useState<boolean>(true);
  const [guide, setGuide] = useState<boolean>(true);

  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo<Array<React.RefObject<API>>>(
    () =>
      Array(10)
        .fill(0)
        .map(() => React.createRef<API>()),
    []
  );

  useEffect(() => {
    if (!items) return;

    const filteredItems = items.filter((item) => item.status !== '已處理');

    function getRandomIndexes(n: number) {
      const indexes = Array.from({ length: filteredItems.length }, (_, i) => i); // 創建包含 0 到 77 的陣列
      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 生成 0 到 i 之間的隨機整數
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]; // 交換 indexes[i] 和 indexes[j] 的位置
      }
      return indexes.slice(0, n);
    }

    function getRandomElements() {
      const randomIndexes = getRandomIndexes(10);

      const selectedElements = randomIndexes.map(
        (index) => filteredItems[index]
      );
      setRandomItems(selectedElements);
      setCurrentIndex(selectedElements.length - 1);
    }

    if (items) getRandomElements();
  }, [items]);

  useEffect(() => {
    if (gamePopout) return;

    setTimeout(() => {
      setGuide(false);
    }, 5000);
  }, [gamePopout]);

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const swiped = (direction: string, idToDelete: string, index: number) => {
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (id: string, index: number) => {
    currentIndexRef.current! >= index && childRefs[index].current.restoreCard();
  };

  const swipe = async (direction: string) => {
    const canSwipe =
      currentIndex !== null &&
      currentIndex >= 0 &&
      currentIndex < randomItems!.length;
    if (!canSwipe) return;

    await childRefs[currentIndex].current.swipe(direction);
  };

  const goBack = async () => {
    const canGoBack =
      currentIndex !== null && currentIndex < randomItems!.length;

    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  async function handleLike(index: number) {
    if (!randomItems) return;

    const updatedItem = randomItems[index];
    updatedItem.status = '保留';
    await updateItem(uid, updatedItem.id, updatedItem);

    const updatedRandomItems = [...randomItems];
    updatedRandomItems[index].status = '保留';
    setRandomItems(updatedRandomItems);
  }

  async function handleUnlike(index: number) {
    if (!randomItems) return;

    const updatedItem = randomItems[index];
    updatedItem.status = '待處理';
    await updateItem(uid, updatedItem.id, updatedItem);

    const updatedRandomItems = [...randomItems];
    updatedRandomItems[index].status = '待處理';
    setRandomItems(updatedRandomItems);
  }

  return (
    <>
      <Container>
        <QuestionText>Does it spark joy?</QuestionText>

        <CardContainer>
          {guide && (
            <GuideContainer>
              <SwipeIconWrapper>
                <SwipeDescription>不心動</SwipeDescription>
                <SwipeIcon src={swipeIcon} />
                <SwipeDescription>心動</SwipeDescription>
              </SwipeIconWrapper>
              <div>
                <GuideTitle>
                  根據心動結果
                  <br />
                  更改物品狀態
                </GuideTitle>
                <GuideDescription>待處理 / 保留</GuideDescription>
              </div>
            </GuideContainer>
          )}

          <EndingCard>
            <EndingText>你真棒 !</EndingText>
            <Happy />
            <EndingPrompt>記得處理不心動的物品喔～</EndingPrompt>
            <Button buttonType="normal" onClick={() => navigate('/inventory')}>
              確認結果
            </Button>
          </EndingCard>
          {randomItems &&
            currentIndex !== null &&
            currentIndex < randomItems.length - 1 && (
              <Undo src={undo} onClick={() => goBack()} />
            )}
          {randomItems &&
            randomItems.map((item, index) => (
              <TinderCardWrapper
                ref={childRefs[index]}
                preventSwipe={['up', 'down']}
                flickOnSwipe={true}
                onSwipe={(direction) => {
                  swiped(direction, item.id, index);
                  if (direction === 'right') {
                    handleLike(index);
                  } else if (direction === 'left') {
                    handleUnlike(index);
                  }
                }}
                onCardLeftScreen={() => outOfFrame(item.id, index)}
              >
                <Card style={{ backgroundImage: `url(${item.images[0]})` }} />
                <InfoWrapper>
                  <Category>{item.category}</Category>
                  <Name>{item.name}</Name>
                  <StatusWrapper>
                    <StatusIcon src={item.status === '保留' ? circle : cross} />
                    <Status>{item.status}</Status>
                  </StatusWrapper>
                </InfoWrapper>
              </TinderCardWrapper>
            ))}
        </CardContainer>
        <div>
          <ChooseButton
            onClick={() => swipe('left')}
            disabled={guide || currentIndex === -1}
          >
            <Cancel />
          </ChooseButton>
          <ChooseButton
            onClick={() => swipe('right')}
            disabled={guide || currentIndex === -1}
          >
            <Check />
          </ChooseButton>
        </div>
        {/* <Background></Background> */}
        <BackgroundContainer>
          <ChoiceContainer>
            <Choice>NO</Choice>
            <Choice>YES</Choice>
          </ChoiceContainer>
        </BackgroundContainer>
        {/* <Yes>YES</Yes>
        <No>NO</No> */}
      </Container>

      {gamePopout && (
        <ToastContainer>
          <Overlay />

          <Toast style={{ backgroundImage: `url(${sparkJoy})` }}>
            <RxCross1 className="close" onClick={() => setGamePopout(false)} />

            <SloganWrapper>
              <MainSlogan>
                您是否有太多物品，
                <br />
                卻難以抉擇去留？
              </MainSlogan>
              <SubSlogan>
                現在馬上通過簡單的二選一小遊戲提升整理動力！
              </SubSlogan>
              <StartButton onClick={() => setGamePopout(false)}>
                <Start>START</Start>
                <TfiArrowRight className="startArrow" />
              </StartButton>
            </SloganWrapper>
          </Toast>
        </ToastContainer>
      )}
    </>
  );
}
