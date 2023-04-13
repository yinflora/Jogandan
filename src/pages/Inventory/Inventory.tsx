import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getItems, getItemById } from '../../utils/firebase';
import styled from 'styled-components';
import Popout from './Popout';

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
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 20px;
  background-color: #828282;
`;

const Item = styled(Link)`
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

const TitleWrapper = styled.div`
  display: flex;
`;

const FilterTitle = styled.p`
  width: 100px;
  color: #acaea9;
`;

const FilterButton = styled.button`
  color: #acaea9;
`;

const SubFilterWrapper = styled.p`
  color: #acaea9;
`;

const SubTitle = styled.p<{ isSelected: boolean }>`
  color: ${({ isSelected }) => (isSelected ? 'red' : '#acaea9')};
`;

const SUBCATEGORY: string[] = [
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

const SUBSTATUS: string[] = ['保留', '處理中', '已處理'];

type processedItem = {
  category: string;
  status: string;
};

export default function Inventory() {
  const [items, setItems] = useState<processedItem[] | null>(null);
  const [filter, setfilter] = useState<processedItem>({
    category: '',
    status: '',
  });
  const [isPopout, setIsPopout] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<[] | null>(null);

  const itemsRef = useRef<processedItem[] | null>(null);

  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const itemList = await getItems();
      itemsRef.current = itemList;
      setItems(itemList);
    }

    async function fetchSelectedData() {
      const item = await getItemById(id);
      setSelectedItem(item);
    }

    if (id) {
      fetchSelectedData();
      setIsPopout(true);
    } else {
      fetchData();
      setSelectedItem(null);
      setIsPopout(false);
    }
  }, [id, isPopout, selectedItem]);

  useEffect(() => {
    function handleFilter() {
      let filteredItems = itemsRef.current;
      if (filter.category !== '' && filter.status !== '') {
        filteredItems = itemsRef.current.filter(
          (item: processedItem) =>
            item.category === filter.category && item.status === filter.status
        );
      } else if (filter.category !== '') {
        filteredItems = itemsRef.current.filter(
          (item: processedItem) => item.category === filter.category
        );
      } else if (filter.status !== '') {
        filteredItems = itemsRef.current.filter(
          (item: processedItem) => item.status === filter.status
        );
      }
      setItems(filteredItems);
    }
    handleFilter();
  }, [filter]);

  function handleClearCategory() {
    if (filter.status === '') {
      setItems(itemsRef.current);
    }
    setfilter({ ...filter, category: '' });
  }

  function handleClearStatus() {
    if (filter.category === '') {
      setItems(itemsRef.current);
    }
    setfilter({ ...filter, status: '' });
  }

  return (
    <>
      <Title>Inventory</Title>
      <p>Total: {items ? itemsRef.current.length : 0}</p>
      <p>
        {!Object.values(filter).includes('')
          ? `共${
              items &&
              items.filter(
                (item) =>
                  item.category === filter.category &&
                  item.status === filter.status
              ).length
            }件符合${filter.category}+${filter.status}的物品`
          : filter.category !== ''
          ? `共${
              items &&
              items.filter((item) => item.category === filter.category).length
            }件符合${filter.category}的物品`
          : `共${
              items &&
              items.filter((item) => item.status === filter.status).length
            }件符合${filter.status}的物品`}
      </p>
      <Container>
        <FilterWrapper>
          <FilterTitle onClick={() => setItems(itemsRef.current)}>
            All
          </FilterTitle>
          <FilterTitle>Category</FilterTitle>
          <SubFilterWrapper>
            {SUBCATEGORY.map((category) => (
              <TitleWrapper>
                <SubTitle
                  key={category}
                  onClick={() => setfilter({ ...filter, category })}
                  isSelected={filter.category === category}
                >
                  {category}
                </SubTitle>
                {filter.category === category && (
                  <FilterButton onClick={handleClearCategory}>X</FilterButton>
                )}
              </TitleWrapper>
            ))}
          </SubFilterWrapper>
          <FilterTitle>Status</FilterTitle>
          <SubFilterWrapper>
            {SUBSTATUS.map((status) => (
              <TitleWrapper>
                <SubTitle
                  key={status}
                  onClick={() => setfilter({ ...filter, status })}
                  isSelected={filter.status === status}
                >
                  {status}
                </SubTitle>
                {filter.status === status && (
                  <FilterButton onClick={handleClearStatus}>X</FilterButton>
                )}
              </TitleWrapper>
            ))}
          </SubFilterWrapper>
        </FilterWrapper>
        <ItemWrapper>
          {items &&
            items.map((item: any) => (
              <Item to={`/inventory/${item.id}`}>
                {item.images && <Image src={item.images[0]}></Image>}
                <Name>{item.name}</Name>
              </Item>
            ))}
        </ItemWrapper>
        {isPopout && <Popout selectedItem={selectedItem} />}
      </Container>
    </>
  );
}
