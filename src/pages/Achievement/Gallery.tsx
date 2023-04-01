import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import styled, { css } from 'styled-components';

const ItemWrapper = styled.ul`
  /* max-width: 1000px; */
  width: 1000px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: hidden;
  align-items: center;
`;

const Item = styled.li`
  width: 250px;
  /* padding: auto 10px; */
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
      <div>
        <ItemWrapper>
          {catList.map((cat, i) => (
            <Item
              key={cat.id}
              ref={index === i ? selectedRef : null}
              isSelected={index === i}
              isFirst={index === 0}
              isLast={index === catList.length - 1}
            >
              <Image
                // className={index === i ? 'active' : ''}
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </Item>
          ))}
        </ItemWrapper>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i,
  });
}
