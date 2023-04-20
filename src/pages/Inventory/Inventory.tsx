import React from 'react';
import { useEffect, useRef, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import styled from 'styled-components';

import { getItems, getItemById } from '../../utils/firebase';
import { AuthContext } from '../../context/authContext';
import Popout from './Popout';
import Search from '../../components/Icon/Search';

const Container = styled.div`
  padding: 0 60px 0 150px;
  color: #fff;
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 500px;
  background-color: #8d9ca4;
`;

const TopWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 100px;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
`;

const SearchField = styled.div`
  width: 425px;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 15px;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 45px;
  margin-bottom: 15px;
  border-bottom: 1px solid #fff;
`;

const SearchBar = styled.input`
  width: 80%;
  height: 100%;
  overflow-x: scroll;
  font-size: 1.25rem;
  line-height: 100%;
  color: #fff;
`;

const SearchBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  cursor: pointer;
`;

const SearchText = styled.p`
  font-size: 1.25rem;
`;

const ItemContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const FilterWrapper = styled.div`
  display: flex;
  width: 20%;
  height: 100%;
  margin-top: 105px;
  flex-direction: column;
  gap: 30px;
`;

const FilterTitle = styled.p`
  font-size: 1.25rem;
  letter-spacing: 0.2rem;
  color: #000;
`;

const SubFilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 50%;
  justify-content: space-between;
  align-items: center;
`;

const SubTitle = styled.p<{ isSelected: boolean }>`
  font-size: 14px;
  letter-spacing: 0.2rem;
  color: ${({ isSelected }) => (isSelected ? '#8D9CA4' : '#cdcdcd')};

  &:hover {
    cursor: pointer;
  }
`;

const FilterButton = styled.button`
  font-size: 14px;
  color: #8d9ca4;

  &:hover {
    cursor: pointer;
  }
`;

const Split = styled.div`
  width: 50%;
  height: 1px;
  background-color: #000;
`;

const ProductWrapper = styled.div`
  display: grid;
  width: 80%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 30px;
`;

const Product = styled(Link)`
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

type Filter = {
  category: string;
  status: string;
};

export default function Inventory() {
  const { uid } = useContext(AuthContext);
  const { id } = useParams();

  const [items, setItems] = useState<Items | null>(null);
  const [filter, setFilter] = useState<Filter>({
    category: '',
    status: '',
  });
  const [isPopout, setIsPopout] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [search, setSearch] = useState<string>('');

  const itemsRef = useRef<Items | null>(null);

  useEffect(() => {
    if (!uid) return;

    async function fetchData() {
      const itemList = await getItems(uid);
      itemsRef.current = itemList;
      setItems(itemList);
    }

    async function fetchSelectedData() {
      const item: any = await getItemById(uid, id); //!記得改any
      setSelectedItem(item[0]);
    }

    if (id) {
      fetchSelectedData();
      setIsPopout(true);
    } else {
      fetchData();
      setSelectedItem(null);
      setIsPopout(false);
    }
  }, [uid, id]);

  useEffect(() => {
    function handleFilter() {
      if (!itemsRef.current) return;

      let filteredItems = itemsRef.current;
      if (filter.category !== '' && filter.status !== '') {
        filteredItems = itemsRef.current.filter(
          (item: Item) =>
            item.category === filter.category && item.status === filter.status
        );
      } else if (filter.category !== '') {
        filteredItems = itemsRef.current.filter(
          (item: Item) => item.category === filter.category
        );
      } else if (filter.status !== '') {
        filteredItems = itemsRef.current.filter(
          (item: Item) => item.status === filter.status
        );
      } else if (search !== '') {
        filteredItems = itemsRef.current.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
        // setFilter({
        //   category: '',
        //   status: '',
        // });
      }
      setItems(filteredItems);
    }
    handleFilter();
  }, [filter]);

  function handleClearCategory() {
    if (filter.status === '') {
      setItems(itemsRef.current);
    }
    setFilter({ ...filter, category: '' });
  }

  function handleClearStatus() {
    if (filter.category === '') {
      setItems(itemsRef.current);
    }
    setFilter({ ...filter, status: '' });
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (itemsRef.current && e.key === 'Enter') {
      const filteredItems = itemsRef.current.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setItems(filteredItems);
      setFilter({
        category: '',
        status: '',
      });
    }
  }

  return (
    <Container>
      <TopWrapper>
        <Title>Inventory</Title>
        {/* {Object.values(filter).includes('') &&
        (() => {
          if (filter.category !== '' && filter.status !== '') {
            return (
              <SearchText>
                共
                {items &&
                  items.filter(
                    (item) =>
                      item.category === filter.category &&
                      item.status === filter.status
                  ).length}
                件符合{filter.category}+{filter.status}的物品
              </SearchText>
            );
          } else if (filter.category !== '') {
            return (
              <SearchText>
                共
                {items &&
                  items.filter((item) => item.category === filter.category)
                    .length}
                件符合{filter.category}的物品
              </SearchText>
            );
          } else if (filter.status !== '') {
            return (
              <SearchText>
                共
                {items &&
                  items.filter((item) => item.status === filter.status).length}
                件符合{filter.status}的物品
              </SearchText>
            );
          }
          return null;
        })()} */}
        <SearchField>
          <SearchWrapper>
            <SearchBar
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => handleSearch(e)}
            />
            <SearchBtn>
              <Search />
            </SearchBtn>
          </SearchWrapper>
          <SearchText>
            TOTAL：{items && itemsRef.current ? itemsRef.current.length : 0}
          </SearchText>
          {Object.values(filter).some((value) => value !== '') && (
            <SearchText>
              FILTER：
              {filter.category !== '' && filter.status !== ''
                ? `${filter.category}｜${filter.status}`
                : filter.category !== ''
                ? filter.category
                : filter.status}
            </SearchText>
          )}
        </SearchField>
      </TopWrapper>

      <ItemContainer>
        <FilterWrapper>
          <FilterTitle onClick={() => setItems(itemsRef.current)}>
            All
          </FilterTitle>
          <Split />
          <FilterTitle>Category</FilterTitle>
          <SubFilterWrapper>
            {SUBCATEGORY.map((category) => (
              <TitleWrapper>
                <SubTitle
                  key={category}
                  onClick={() => setFilter({ ...filter, category })}
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
          <Split />

          <FilterTitle>Status</FilterTitle>
          <SubFilterWrapper>
            {SUBSTATUS.map((status) => (
              <TitleWrapper>
                <SubTitle
                  key={status}
                  onClick={() => setFilter({ ...filter, status })}
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
        <ProductWrapper>
          {items &&
            items.map((item: any) => (
              <Product to={`/inventory/${item.id}`}>
                {item.images && <Image src={item.images[0]}></Image>}
                <Name>{item.name}</Name>
              </Product>
            ))}
        </ProductWrapper>
        {isPopout && <Popout selectedItem={selectedItem} />}
      </ItemContainer>
      <Background />
    </Container>
  );
}
