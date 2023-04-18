import React, { useState, useMemo, useRef, useContext, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import AuthContext from '../../context/authContext';
import { Timestamp } from 'firebase/firestore';
import styled from 'styled-components';
import { updateItem } from '../../utils/firebase';

const CardContainer = styled.div`
  width: 90vw;
  max-width: 260px;
  height: 300px;
  position: relative;
`;

const Card = styled.div`
  position: absolute;
  background-color: #fff;
  width: 80vw;
  max-width: 260px;
  height: 300px;
  box-shadow: 0px 0px 60px 0px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  background-size: cover;
  background-position: center;
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

export default function SparkJoy() {
  const { uid, items } = useContext(AuthContext);

  const [randomItems, setRandomItems] = useState<Items | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(9);
  const [lastDirection, setLastDirection] = useState<string | null>(null);

  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useMemo(
    () =>
      Array(10)
        .fill(0)
        .map(() => React.createRef()),
    []
  );

  // console.log(items);
  // console.log(randomItems);

  useEffect(() => {
    function getRandomElements() {
      if (!items) return;

      const filteredItems = items.filter((item) => item.status !== '已處理');
      const randomIndexes = [];

      while (randomIndexes.length < 10) {
        const randomIndex = Math.floor(Math.random() * filteredItems.length);
        if (!randomIndexes.includes(randomIndex)) {
          randomIndexes.push(randomIndex);
        }
      }
      const selectedElements = randomIndexes.map(
        (index) => filteredItems[index]
      );
      setRandomItems(selectedElements);
    }
    if (items) {
      getRandomElements();

      setCurrentIndex(items.length - 1);
    }
  }, [items]);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // const canGoBack = currentIndex < randomItems.length - 1;
  const canGoBack = currentIndex < 10;
  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction: string, idToDelete: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (id: string, index: number) => {
    console.log(`${id} (${index}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame

    currentIndexRef.current >= index && childRefs[index].current.restoreCard();

    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (direction: string) => {
    if (canSwipe && currentIndex < randomItems.length) {
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>以下品項是否還讓你怦然心動呢？</h1>
      <CardContainer>
        {randomItems &&
          randomItems.map((item, index) => (
            <TinderCard
              // className="swipe"
              // style={{ position: 'absolute' }}
              ref={childRefs[index]}
              preventSwipe={['up', 'down']}
              flickOnSwipe={true}
              // swipeRequirementType="position"
              // onSwipeRequirementFulfilled={() => alert('更新成功！')}
              onSwipe={(direction) => {
                console.log(direction);
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
              <Card
                style={{ backgroundImage: `url(${item.images[0]})` }}
                // style={{
                //   width: 50,
                //   height: 100,
                //   backgroundColor: '#828282',
                //   backgroundImage: `url(${item.images[0]})`,
                // }}
                // className="card"
              >
                <p>{item.name}</p>
                <p>{item.status}</p>
              </Card>
            </TinderCard>
          ))}
      </CardContainer>
      <div className="buttons">
        <button
          // style={{ backgroundColor: !canSwipe && '#c3c4d3' }}
          onClick={() => swipe('left')}
        >
          Swipe left!
        </button>
        <button
          // style={{ backgroundColor: !canGoBack && '#c3c4d3' }}
          onClick={() => goBack()}
        >
          Undo swipe!
        </button>
        <button
          // style={{ backgroundColor: !canSwipe && '#c3c4d3' }}
          onClick={() => swipe('right')}
        >
          Swipe right!
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  );
}
