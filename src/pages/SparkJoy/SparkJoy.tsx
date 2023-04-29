import React, { useState, useMemo, useRef, useContext, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import AuthContext from '../../context/authContext';
import { Timestamp } from 'firebase/firestore';
import styled from 'styled-components';
import { updateItem } from '../../utils/firebase';
import circle from './circle-blue.png';
import cross from './cross-blue.png';
import undo from './undo.png';
import { useNavigate } from 'react-router-dom';

import Check from '../../components/Icon/Check';
import Cancel from '../../components/Icon/Cancel';
import Button from '../../components/Button/Button';

// import { RxCircle, RxCross1 } from 'react-icons/rx';
// import { GiCircle } from 'react-icons/gi';
import { CiFaceSmile } from 'react-icons/ci';

const Container = styled.div`
  display: flex;
  width: 100vw;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  bottom: 0;
  width: 100vw;
  height: 250px;
  background-color: #8d9ca4;
`;

const Choice = styled.p`
  font-size: 4rem;
  font-weight: 600;
  line-height: 2.5rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #8d9ca4;
`;

const Yes = styled(Choice)`
  position: absolute;
  z-index: -1;
  right: 10%;
  bottom: 250px;
`;

const No = styled(Choice)`
  position: absolute;
  z-index: -1;
  left: 10%;
  bottom: 250px;
`;

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
  margin: 20px auto 40px;
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
  /* border: 1px solid black; */
  box-shadow: 0px 4px 90px rgba(0, 0, 0, 0.15);

  & > .smile {
    width: 100px;
    height: 100px;
    margin-bottom: 30px;
    color: #8d9ca4;
  }
`;

const EndingText = styled.p`
  margin-bottom: 10px;
  text-align: center;
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0.2rem;
  color: #8d9ca4;
`;

const TinderCardWrapper = styled(TinderCard)`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  /* border: 1px solid rgba(0, 0, 0, 0.15); */
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
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
`;

const StatusWrapper = styled.div`
  display: flex;
  margin: auto 0 0 auto;
  flex-direction: column;
  /* gap: 5px; */
  align-self: flex-end;
  justify-content: center;
  align-items: center;

  /* & > .yes,
  .no {
    width: 50px;
    height: 50px;
    color: #8d9ca4;
  } */
`;

const StatusIcon = styled.img`
  width: 50px;
  height: 50px;
  /* background: center / contain no-repeat; */
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
  /* font-size: 1.25rem; */
  text-align: center;
  letter-spacing: 0.1rem;
  color: #8d9ca4;
`;

// const ChooseButton = styled.button`
//   width: 90px;
//   height: 90px;
//   border-radius: 50%;
//   background-color: rgba(255, 255, 255, 0.1);
// `;

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

    if (items) {
      getRandomElements();
      // setCurrentIndex(items.length - 1);
    }
  }, [items]);

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // const canGoBack = currentIndex && currentIndex < 10;
  // const canSwipe = currentIndex && currentIndex >= 0;

  const swiped = (direction: string, idToDelete: string, index: number) => {
    // setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (id: string, index: number) => {
    currentIndexRef.current! >= index && childRefs[index].current.restoreCard();
  };

  const swipe = async (direction: string) => {
    // if (canSwipe && currentIndex < randomItems!.length) {
    //   await childRefs[currentIndex].current.swipe(direction);
    // }

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
    <Container>
      <QuestionText>Does it spark joy?</QuestionText>

      <CardContainer>
        <EndingCard>
          <EndingText>你真棒</EndingText>
          <CiFaceSmile className="smile" />
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
                  {/* <StatusIcon
                    style={{
                      background:
                        item.status === '保留'
                          ? `url(${circle})`
                          : `center 80% / contain no-repeat url(${cross})`,
                    }}
                  /> */}
                  {/* <RxCircle className="yes" /> */}
                  {/* <RxCross1 className="no" /> */}
                  <Status>{item.status}</Status>
                </StatusWrapper>
              </InfoWrapper>
            </TinderCardWrapper>
          ))}
      </CardContainer>
      <div>
        <button onClick={() => swipe('left')}>
          <Cancel />
        </button>
        <button onClick={() => swipe('right')}>
          <Check />
        </button>
      </div>
      <Background />
      <Yes>YES</Yes>
      <No>NO</No>
    </Container>
  );
}
