import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import styled, { css } from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 1000px;
`;

const ItemWrapper = styled.ul`
  /* max-width: 1000px; */
  /* width: 1000px; */
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

      & > {
        border: '1px solid red';
      }
    `};
`;

const Image = styled.img`
  width: 100%;
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

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  function ScrollIntoImage() {
    selectedRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  function handlePrevious() {
    flushSync(() => {
      index > 0 ? setIndex(index - 1) : setIndex(catList.length - 1);
    });
    ScrollIntoImage();
  }

  function handleNext() {
    flushSync(() => {
      index < catList.length - 1 ? setIndex(index + 1) : setIndex(0);
    });
    ScrollIntoImage();
  }

  return (
    <>
      <nav>
        <button onClick={() => handlePrevious()}>Previous</button>
        <button onClick={() => handleNext()}>Next</button>
      </nav>
      <Container>
        <ItemWrapper>
          {catList.map((cat, i) => (
            <Item
              key={cat.id}
              ref={index === i ? selectedRef : null}
              isSelected={index === i}
              isFirst={index === 0}
              isLast={index === catList.length - 1}
            >
              {/* <p>{cat.id}</p> */}
              <Image
                // className={index === i ? 'active' : ''}
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
              <Time>2023/04/01</Time>
            </Item>
          ))}
        </ItemWrapper>
        <Timeline />
      </Container>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    // time: new Date(),
    imageUrl: 'https://placekitten.com/250/200?image=' + i,
  });
}
