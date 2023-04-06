import styled from 'styled-components';
import { getItems } from '../../utils/firebase';
import { useEffect, useState } from 'react';

const Title = styled.h1`
  font-size: 4rem;
`;
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const FilterWrapper = styled.div`
  width: 20%;
  height: 100%;
  background-color: #000;
`;

const ItemWrapper = styled.div`
  display: grid;
  width: 80%;
  /* height: 100%; */
  /* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */
  /* grid-template-rows: 1fr 1fr 1fr 1fr; */
  /* grid-template-rows: 350px 350px 350px 350px; */
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 20px;
  background-color: #828282;
`;

const Item = styled.div`
  width: 100%;
  background-color: #fff;
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
`;

const Name = styled.p``;

export default function Inventory() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    // const itemList = getItems();
    // setItems(itemList);
    // console.log(itemList);
    async function fetchData() {
      const itemList = await getItems();
      setItems(itemList);
    }
    fetchData();
  }, []);

  console.log(items);

  return (
    <>
      <Title>Inventory</Title>
      <Container>
        <FilterWrapper>aaaaaaa</FilterWrapper>
        <ItemWrapper>
          {items &&
            items.map((item) => (
              <Item>
                {item.images && <Image src={item.images[0]}></Image>}
                <Name>{item.name}</Name>
              </Item>
            ))}
        </ItemWrapper>
      </Container>
    </>
  );
}
