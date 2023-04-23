import React, { useState, useMemo, useRef, useContext, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import AuthContext from '../../context/authContext';
import { Timestamp } from 'firebase/firestore';
import styled from 'styled-components';
import { updateItem } from '../../utils/firebase';
import circle from './circle-blue.png';
import cross from './cross-blue.png';
import undo from './undo.png';

import Check from '../../components/Icon/Check';
import Cancel from '../../components/Icon/Cancel';

const Container = styled.div`
  display: flex;
  width: 100vw;
  /* height: 100vh; */
  justify-content: center;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
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
  /* right: 140px; */
  right: 10%;
  bottom: 250px;
`;

const No = styled(Choice)`
  position: absolute;
  z-index: -1;
  /* left: 140px; */
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

const TinderCardWrapper = styled(TinderCard)`
  position: absolute;
  /* top: 170px; */
  width: 100%;
  height: 100%;
  /* margin: 20px auto 40px; */
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid black;

  /* & :last-of-type {
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.1);
  } */
`;

// const CardContainer = styled.div`
//   /* width: 90vw; */
//   /* max-width: 260px; */
//   /* height: 300px; */
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   /* margin: 20px auto 40px; */
//   padding: 30px;
//   /* background-color: #fff; */
//   /* box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.1); */
// `;

const Card = styled.div`
  /* position: absolute; */
  /* width: 80vw;
  max-width: 300px;
  height: 500px; */
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
  /* margin-bottom: 10px; */
  font-size: 0.75rem;
  letter-spacing: 0.1rem;
`;

const Name = styled.p`
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
`;

const StatusWrapper = styled.div`
  display: flex;
  /* width: 50px; */
  margin: auto 0 0 auto;
  /* height: 50px; */
  flex-direction: column;
  gap: 5px;
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
  /* top: 190px;
  right: 530px; */
  top: 0;
  right: -40px;
  width: 30px;
  height: 30px;

  &:hover {
    cursor: pointer;
  }
`;

const Status = styled.p`
  font-size: 1.25rem;
  text-align: center;
  letter-spacing: 0.1rem;
  color: #8d9ca4;
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

  const [randomItems, setRandomItems] = useState<Items | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(9);
  const [lastDirection, setLastDirection] = useState<string | null>(null);

  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);
  // const childRefs = useMemo<Array<React.RefObject<number>>>(
  //   () =>
  //     Array(10)
  //       .fill(0)
  //       .map(() => React.createRef()),
  //   []
  // );
  const childRefs = useMemo<Array<React.RefObject<API>>>(
    () =>
      Array(10)
        .fill(0)
        .map(() => React.createRef<API>()),
    []
  );

  // console.log(items);
  // console.log(randomItems);
  console.log(lastDirection);

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
      // const randomIndexes = [];

      // while (randomIndexes.length < 10) {
      //   const randomIndex = Math.floor(Math.random() * filteredItems.length);
      //   if (!randomIndexes.includes(randomIndex)) {
      //     randomIndexes.push(randomIndex);
      //   }
      // }
      const randomIndexes = getRandomIndexes(10);
      // console.log(randomIndexes);

      const selectedElements = randomIndexes.map(
        (index) => filteredItems[index]
      );
      setRandomItems(selectedElements);

      // if (!items) return;

      // const filteredItems = items.filter((item) => item.status !== '已處理');
      // // const randomIndexes = [];
      // const { length } = filteredItems;

      // // Fisher-Yates shuffle algorithm
      // for (let i = length - 1; i >= length - 10 && i >= 0; i--) {
      //   const j = Math.floor(Math.random() * (i + 1));
      //   [filteredItems[i], filteredItems[j]] = [
      //     filteredItems[j],
      //     filteredItems[i],
      //   ];
      // }

      // const selectedElements = filteredItems.slice(length - 10, length);
      // setRandomItems(selectedElements);
    }

    if (items) {
      getRandomElements();
      setCurrentIndex(items.length - 1);
    }
  }, [items]);

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // const canGoBack = currentIndex < randomItems.length - 1;
  const canGoBack = currentIndex && currentIndex < 10;
  const canSwipe = currentIndex && currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction: string, idToDelete: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (id: string, index: number) => {
    console.log(`${id} (${index}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame

    currentIndexRef.current! >= index && childRefs[index].current.restoreCard();

    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (direction: string) => {
    if (canSwipe && currentIndex < randomItems!.length) {
      await childRefs[currentIndex].current.swipe(direction); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  async function handleLike(index: number) {
    console.log('hihihihih');
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
    updatedItem.status = '處理中';
    await updateItem(uid, updatedItem.id, updatedItem);

    const updatedRandomItems = [...randomItems];
    updatedRandomItems[index].status = '處理中';
    setRandomItems(updatedRandomItems);
  }

  return (
    <Container>
      {/* <h1>以下品項是否還讓你怦然心動呢？</h1> */}
      <QuestionText>Does it spark joy?</QuestionText>

      {/* <TinderCardWrapper> */}
      <CardContainer>
        <Undo
          // style={{ backgroundColor: !canGoBack && '#c3c4d3' }}
          src={undo}
          onClick={() => goBack()}
        />
        {randomItems &&
          randomItems.map((item, index) => (
            <TinderCardWrapper
              // className="swipe"
              // style={{ position: 'absolute' }}
              ref={childRefs[index]}
              preventSwipe={['up', 'down']}
              flickOnSwipe={true}
              // swipeRequirementType="position"
              // onSwipeRequirementFulfilled={() => alert('更新成功！')}
              onSwipe={(direction) => {
                // console.log(direction);
                console.log('酷東西');
                swiped(direction, item.id, index);
                if (direction === 'right') {
                  console.log('like!');
                  handleLike(index);
                } else if (direction === 'left') {
                  console.log('unlike!');
                  handleUnlike(index);
                }
              }}
              onCardLeftScreen={() => outOfFrame(item.id, index)}
            >
              {/* <CardContainer> */}
              <Card style={{ backgroundImage: `url(${item.images[0]})` }} />
              <InfoWrapper>
                <Category>{item.category}</Category>
                <Name>{item.name}</Name>
                <StatusWrapper>
                  <StatusIcon src={item.status === '保留' ? circle : cross} />
                  <Status>{item.status}</Status>
                </StatusWrapper>
              </InfoWrapper>
              {/* </CardContainer> */}
            </TinderCardWrapper>
          ))}
      </CardContainer>
      {/* </TinderCardWrapper> */}
      <div className="buttons">
        <button
          // style={{ backgroundColor: !canSwipe && '#c3c4d3' }}
          onClick={() => swipe('left')}
        >
          <Cancel />
        </button>

        {/* <button
          // style={{ backgroundColor: !canSwipe && '#c3c4d3' }}
          onClick={() => swipe('right')}
        >
          Swipe right!
        </button> */}
        <button
          onClick={(e) => {
            console.log('hihihih222');
            e.preventDefault();
            swipe('right');
          }}
        >
          <Check />
        </button>
      </div>
      {/* {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )} */}
      <Background />
      <Yes>YES</Yes>
      <No>NO</No>
    </Container>
  );
}
