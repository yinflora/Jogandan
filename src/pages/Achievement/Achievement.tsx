import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProcessedItems } from '../../utils/firebase';
import styled from 'styled-components';
import AuthContext from '../../context/authContext';

const Background = styled.div`
  position: absolute;
  top: 175px;
  z-index: -1;
  width: 100vw;
  height: 65vh;
  background-color: #cdcdcd;
`;

const PageTitle = styled.h1`
  margin-left: 125px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
  color: #000;
`;

const Image = styled.img`
  height: 100px;
  filter: grayscale(100%);
  transition: all 0.2s ease-in-out;

  &:hover {
    filter: none;
  }
`;

function Achievement() {
  const { uid } = useContext(AuthContext);
  const [items, setItems] = useState<Array<any> | null>(null);

  useEffect(() => {
    if (!uid) return;
    async function fetchData() {
      const processedItems = await getProcessedItems(uid);
      const sortedItems = processedItems.sort(
        (a, b) => a.processedDate.seconds - b.processedDate.seconds
      );
      setItems(sortedItems);
    }
    fetchData();
  }, [uid]);

  if (items) {
    return (
      <>
        <PageTitle>Achievement</PageTitle>
        {items &&
          items.map((item) =>
            item.images.map(
              (image: string, index: number) =>
                image !== '' && (
                  <Link to={`/inventory/${item.id}`}>
                    <Image key={index} src={image} />
                  </Link>
                )
            )
          )}
        <Background />
      </>
    );
  }
  return null;
}

export default Achievement;
