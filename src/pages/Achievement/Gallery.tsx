import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import styled, { css } from 'styled-components';

import Previous from '../../components/Button/Previos';
import Next from '../../components/Button/Next';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 1000px;
`;

const ItemWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: hidden;
  align-items: flex-end;
`;

const Item = styled.li`
  width: 250px;
  padding: 10px;
  flex-shrink: 0;

  ${({ isSelected, isFirst, isLast }) =>
    isSelected &&
    css`
      width: 500px;
      margin-left: ${isFirst ? '250px' : 0};
      margin-right: ${isLast ? '250px' : 0};
      /* transform: translateX(${isFirst ? '-250px' : isLast ? '250px' : 0}); */

      & > {
        border: '1px solid red';
      }
    `};
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
`;

const Time = styled.p`
  margin: 60px auto;
  text-align: center;
  color: #acaea9;
`;

const Timeline = styled.div`
  position: absolute;
  top: 400px;
  left: 0;
  width: 100%;
  height: 1px;
  margin-top: 30px;
  background-color: #acaea9;
`;

export default function CatFriends({ items }) {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  console.log(items);

  function ScrollIntoImage() {
    selectedRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  function handlePrevious() {
    const nextIndex = index > 0 ? index - 1 : items.length - 1;
    flushSync(() => setIndex(nextIndex));
    ScrollIntoImage();
  }

  function handleNext() {
    const nextIndex = index < items.length - 1 ? index + 1 : 0;
    flushSync(() => setIndex(nextIndex));
    ScrollIntoImage();
  }

  return (
    <Container>
      <Previous onClick={() => handlePrevious()} />
      <ImageContainer>
        <ItemWrapper>
          {items.map((item, i) => (
            <Item
              key={i}
              ref={index === i ? selectedRef : null}
              isSelected={index === i}
              isFirst={index === 0}
              isLast={index === items.length - 1}
            >
              <Image src={item.image} />
              <Time>{item.processedDate.seconds}</Time>
              <p>{item.name}</p>
            </Item>
          ))}
        </ItemWrapper>
        <Timeline />
      </ImageContainer>
      <Next onClick={() => handleNext()} />
    </Container>
  );
}

// const catList = [];
// for (let i = 0; i < 10; i++) {
//   catList.push({
//     id: i,
//     imageUrl: 'https://placekitten.com/250/200?image=' + i,
//   });
// }
