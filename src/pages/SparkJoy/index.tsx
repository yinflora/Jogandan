import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { TfiArrowRight } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import styled, { keyframes } from 'styled-components/macro';
import Button from '../../components/Button/Button';
import Cancel from '../../components/Icon/Cancel';
import Check from '../../components/Icon/Check';
import Happy from '../../components/Icon/Happy';
import UserInfoContext from '../../context/UserInfoContext';
import { Item } from '../../types/types';
import { updateItem } from '../../utils/firebase';
import circle from './images/circle-blue.png';
import cross from './images/cross-blue.png';
import sparkJoy from './images/sparkJoy.png';
import swipeIcon from './images/swipe.png';
import undo from './images/undo.png';

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

const Choice = styled.p`
  font-size: 4rem;
  font-weight: 600;
  line-height: 2.5rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #8d9ca4;
`;

const QuestionText = styled.p<{ children: string }>`
  position: relative;
  font-size: 1.5rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #000;

  ::after {
    content: '${({ children }) => children.slice(-4)}';
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

const Card = styled.div<{ $url: string }>`
  width: 100%;
  aspect-ratio: 1/1;
  background: center / cover url(${({ $url }) => $url});
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
  background-image: url(${sparkJoy});

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

type Direction = 'left' | 'right' | 'up' | 'down';

type API = {
  // eslint-disable-next-line no-unused-vars
  swipe(direction?: Direction): Promise<void>; //!Fixme
  restoreCard(): Promise<void>;
};

const CARD_QTY = 10;

const SparkJoy = () => {
  const { items } = useContext(UserInfoContext);

  const [randomItems, setRandomItems] = useState<Item[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(CARD_QTY - 1);
  const [gamePopout, setGamePopout] = useState<boolean>(true);
  const [guide, setGuide] = useState<boolean>(true);

  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo<Array<React.RefObject<API>>>(
    () =>
      Array(CARD_QTY)
        .fill(0)
        .map(() => React.createRef<API>()),
    []
  );

  const navigate = useNavigate();

  useEffect(() => {
    const existingItems = items.filter((item) => item.status !== '已處理');

    const getRandomIndexes = (n: number) => {
      const indexes = Array.from({ length: existingItems.length }, (_, i) => i);
      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
      }
      return indexes.slice(0, n);
    };

    const getRandomElements = () => {
      const randomIndexes = getRandomIndexes(CARD_QTY);

      const selectedElements = randomIndexes.map(
        (index) => existingItems[index]
      );
      setRandomItems(selectedElements);
      setCurrentIndex(selectedElements.length - 1);
    };

    if (existingItems.length >= 10) {
      getRandomElements();
    } else {
      navigate('/');
    }
    if (!gamePopout)
      setTimeout(() => {
        setGuide(false);
      }, 5000);
  }, [items, gamePopout]);

  const updateCurrentIndex = (index: number) => {
    setCurrentIndex(index);
    currentIndexRef.current = index;
  };

  const outOfFrame = (index: number) => {
    currentIndexRef.current! >= index &&
      childRefs[index].current?.restoreCard();
  };

  const swipeCard = async (direction: Direction) => {
    const canSwipe =
      currentIndex !== null &&
      currentIndex >= 0 &&
      currentIndex < randomItems!.length;
    if (!canSwipe) return;

    await childRefs[currentIndex].current?.swipe(direction);
  };

  const goBack = async () => {
    const canGoBack =
      currentIndex !== null && currentIndex < randomItems!.length;
    if (!canGoBack) return;

    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);

    await childRefs[newIndex].current?.restoreCard();
  };

  const handleStatusChange = async (
    status: '保留' | '待處理',
    index: number
  ) => {
    if (!randomItems) return;

    const updatedItem = randomItems[index];
    updatedItem.status = status;
    await updateItem(updatedItem.id, updatedItem);

    const updatedRandomItems = [...randomItems];
    updatedRandomItems[index].status = status;
    setRandomItems(updatedRandomItems);
  };

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
                key={index}
                ref={childRefs[index]}
                preventSwipe={['up', 'down']}
                flickOnSwipe
                onSwipe={(direction: Direction) => {
                  updateCurrentIndex(index - 1);
                  if (direction === 'right') handleStatusChange('保留', index);
                  if (direction === 'left') handleStatusChange('待處理', index);
                }}
                onCardLeftScreen={() => outOfFrame(index)}
              >
                <Card $url={item.images[0]} />
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
            onClick={() => swipeCard('left')}
            disabled={guide || currentIndex === -1}
          >
            <Cancel />
          </ChooseButton>
          <ChooseButton
            onClick={() => swipeCard('right')}
            disabled={guide || currentIndex === -1}
          >
            <Check />
          </ChooseButton>
        </div>
        <BackgroundContainer>
          <ChoiceContainer>
            <Choice>NO</Choice>
            <Choice>YES</Choice>
          </ChoiceContainer>
        </BackgroundContainer>
      </Container>

      {gamePopout && (
        <ToastContainer>
          <Overlay />

          <Toast>
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
};

export default SparkJoy;
