import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import UserInfoContext from '../../context/UserInfoContext';

const NUM_OF_STYLES = 8;

const Background = styled.div`
  position: absolute;
  top: 175px;
  z-index: -1;
  width: 100vw;
  height: 65vh;
  background-color: #e6e6e6;
`;

const PageTitle = styled.h1`
  margin: 150px 0 0 125px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
  color: #000;
  cursor: default;
`;

const ScrollSection = styled.div`
  position: relative;
  display: flex;
  width: 100vw;
  height: 65vh;
  overflow-x: scroll;
`;

const Image = styled.img<{ $index: number }>`
  flex-shrink: 0;
  filter: grayscale(100%);
  transition: all 0.2s ease-in-out;
  object-fit: cover;
  object-position: center;
  opacity: 0.8;

  &:hover {
    filter: none;
    opacity: 1;
    cursor: pointer;
  }

  ${({ $index }) => {
    switch ($index % NUM_OF_STYLES) {
      case 0:
        return css`
          z-index: 1;
          width: 27vh;
          height: 36vh;
          margin-top: 5%;
          margin-left: 30px;
        `;
      case 1:
        return css`
          width: 39vh;
          height: 52vh;
          margin-top: 3%;
          margin-left: -60px;
        `;
      case 2:
        return css`
          z-index: 2;
          width: 20vh;
          height: 15vh;
          margin-top: 7%;
          margin-left: -120px;
        `;
      case 3:
        return css`
          z-index: 1;
          width: 27vh;
          height: 36vh;
          margin-top: 10%;
          margin-left: -90px;
        `;
      case 4:
        return css`
          z-index: 2;
          width: 36vh;
          height: 27vh;
          margin-top: 8%;
          margin-left: -30px;
        `;
      case 5:
        return css`
          width: 39vh;
          height: 52vh;
          margin-top: 3%;
          margin-left: -60px;
        `;
      case 6:
        return css`
          z-index: 1;
          width: 15vh;
          height: 20vh;
          margin-top: 12%;
          margin-left: -60px;
        `;
      case 7:
        return css`
          width: 36vh;
          height: 27vh;
          margin-top: 5%;
          margin-left: -30px;
        `;
      default:
        return css``;
    }
  }}
`;

const Achievement = () => {
  const { items } = useContext(UserInfoContext);
  const navigate = useNavigate();

  if (items) {
    return (
      <>
        <PageTitle>Achievement</PageTitle>
        <ScrollSection>
          {items
            .filter((item) => item.status === '已處理')
            .map((item, index) => (
              <Image
                key={index}
                src={item.images[0]}
                $index={index}
                onClick={() => navigate(`/inventory/${item.id}`)}
              />
            ))}
        </ScrollSection>
        <Background />
      </>
    );
  }
  return null;
};

export default Achievement;
