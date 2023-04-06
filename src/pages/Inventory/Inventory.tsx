import styled from 'styled-components';
import { getItems, getFilteredItems } from '../../utils/firebase';
import { useEffect, useRef, useState } from 'react';

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

const FilterTitle = styled.p`
  color: #acaea9;
`;

const SubFilterWrapper = styled.p`
  color: #acaea9;
`;

const SubTitle = styled.p`
  color: ${({ isSelected }) => (isSelected ? 'red' : '#acaea9')};
`;

const SUBCATEGORY = [
  '居家生活',
  '服飾配件',
  '美妝保養',
  '3C產品',
  '影音產品',
  '書報雜誌',
  '體育器材',
  '寵物用品',
  '食物及飲料',
  '興趣及遊戲',
  '紀念意義',
  '其他',
];

const SUBSTATUS = ['保留', '處理中', '已處理'];

export default function Inventory() {
  const itemsRef = useRef(null);
  const [items, setItems] = useState(null);
  const [filter, setfilter] = useState({ category: '', status: '' });

  useEffect(() => {
    // const itemList = getItems();
    // setItems(itemList);
    // console.log(itemList);
    async function fetchData() {
      const itemList = await getItems();
      itemsRef.current = itemList;
      setItems(itemList);
    }
    fetchData();
  }, []);

  console.log(itemsRef.current);

  useEffect(() => {
    function handleFilter() {
      let filteredItems;
      if (filter.category !== '' && filter.status !== '') {
        filteredItems = items.filter(
          (item) =>
            item.category === filter.category && item.status === filter.status
        );
      } else if (filter.category !== '') {
        filteredItems = items.filter(
          (item) => item.category === filter.category
        );
      } else if (filter.status !== '') {
        filteredItems = items.filter((item) => item.status === filter.status);
      }
      console.log(filteredItems);
      setItems(filteredItems);
    }
    handleFilter();
  }, [filter]);

  console.log(filter);

  // console.log(items.filter((item) => item.status === '已處理').length);

  // async function handleFilter(field, value) {
  //   const filteredItems = await getFilteredItems(field, value);
  //   setItems(filteredItems);
  //   // getFilteredItems(field, value);
  // }

  return (
    <>
      <Title>Inventory</Title>
      <Container>
        <FilterWrapper>
          <FilterTitle>All({items ? itemsRef.current.length : 0})</FilterTitle>
          <FilterTitle>Category</FilterTitle>
          <SubFilterWrapper>
            {SUBCATEGORY.map((category) => (
              <SubTitle
                key={category}
                // onClick={() => handleFilter('category', category)}
                onClick={() => setfilter({ ...filter, category })}
                isSelected={filter.category === category}
              >
                {/* {category} */}
                {`${category}(${
                  items &&
                  items.filter((item) => item.category === category).length
                })`}
              </SubTitle>
            ))}
          </SubFilterWrapper>
          <FilterTitle>Status</FilterTitle>
          <SubFilterWrapper>
            {SUBSTATUS.map((status) => (
              <SubTitle
                key={status}
                // onClick={() => handleFilter('status', status)}
                onClick={() => setfilter({ ...filter, status })}
                isSelected={filter.status === status}
              >
                {`${status}(${
                  items && items.filter((item) => item.status === status).length
                })`}
              </SubTitle>
            ))}
          </SubFilterWrapper>
        </FilterWrapper>
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
