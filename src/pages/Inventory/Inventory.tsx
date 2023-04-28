import React from 'react';
import { useEffect, useRef, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import styled from 'styled-components/macro';

import { getItems, getItemById } from '../../utils/firebase';
import { AuthContext } from '../../context/authContext';
import Popout from './Popout';
import Search from '../../components/Icon/Search';
// import Cross from '../../components/Icon/Cross';
import { RxCross1 } from 'react-icons/rx';

const Container = styled.div`
  /* width: 1000px; */
  margin: 0 auto;
  padding: 0 250px 60px;
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

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
`;

const SearchField = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  flex-shrink: 1;
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
  /* font-size: 1.25rem; */
`;

const ItemContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const FilterWrapper = styled.div`
  display: flex;
  width: 25%;
  height: 100%;
  margin-top: 70px;
  flex-direction: column;
  gap: 30px;
`;

const FilterTitle = styled.p`
  font-size: 1.25rem;
  letter-spacing: 0.2rem;
  color: #000;

  &:first-of-type {
    position: relative;
    width: 35px;
    height: 25px;
    margin-bottom: 40px;
    color: #fff;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 100%;
      left: 0;
      border-bottom: 1px solid #fff;
      opacity: 0;
      transition: all 0.5s;
    }

    &:hover::before {
      left: 0;
      right: 0;
      opacity: 1;
    }
  }
`;

const SubFilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 50%;
  height: 15px;
  justify-content: space-between;
  align-items: center;
`;

const SubTitle = styled.p<{ isSelected: boolean }>`
  /* position: absolute; */
  font-size: 14px;
  letter-spacing: 0.2rem;
  color: ${({ isSelected }) => (isSelected ? '#8D9CA4' : '#b5b4b4')};
  font-weight: ${({ isSelected }) => isSelected && 500};
  transition: 0.3s ease-out;

  &:hover {
    cursor: pointer;
  }

  /* &::before {
    position: absolute;
    content: '居家生活';
    width: 0%;
    inset: 0;
    color: #999999;
    overflow: hidden;
    transition: 0.3s ease-out;
    transition: 0.3s ease-out;
  }

  &:hover::before {
    width: 100%;
  } */
`;

const FilterButton = styled.div`
  /* padding: 0; */
  /* font-size: 14px;
  color: #8d9ca4; */

  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  & > .cancel {
    width: 15px;
    height: 15px;
    color: #8d9ca4;
    stroke-width: 0.5px;
    transition: 0.3s ease-in;
  }
`;

const Split = styled.div`
  width: 50%;
  height: 1px;
  background-color: #000;
`;

const ProductWrapper = styled.div`
  display: grid;
  width: 75%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 60px;
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
  border: 0.5px solid #cdcdcd;

  filter: grayscale(50%);
  transition: all 0.2s ease-in-out;

  &:hover {
    filter: none;
  }
`;

const Name = styled.p`
  margin-top: 30px;
  letter-spacing: 0.1rem;
  color: #707070;
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

const SUBSTATUS: string[] = ['保留', '待處理', '已處理'];

type Item = {
  id?: string;
  name: string;
  status: string;
  category: string;
  created?: Timestamp;
  processedDate?: string;
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
        <PageTitle>Inventory</PageTitle>
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
            FILTER：
            {(() => {
              if (filter.category === '' && filter.status === '') {
                return 'All';
              } else if (filter.category !== '' && filter.status !== '') {
                return `${filter.category}｜${filter.status} (${
                  items &&
                  items.filter(
                    (item) =>
                      item.category === filter.category &&
                      item.status === filter.status
                  ).length
                })`;
              } else if (filter.category !== '') {
                return `${filter.category} (${
                  items &&
                  items.filter((item) => item.category === filter.category)
                    .length
                })`;
              }
              return `${filter.status} (${
                items &&
                items.filter((item) => item.status === filter.status).length
              })`;
            })()}
          </SearchText>
          <SearchText>
            TOTAL：{items && itemsRef.current ? itemsRef.current.length : 0}
          </SearchText>
        </SearchField>
      </TopWrapper>

      <ItemContainer>
        <FilterWrapper>
          <FilterTitle
            onClick={() => {
              setItems(itemsRef.current);
              setSearch('');
            }}
          >
            All
          </FilterTitle>
          {/* <Split /> */}
          <FilterTitle>Category</FilterTitle>
          <SubFilterWrapper>
            {SUBCATEGORY.map((category) => (
              <TitleWrapper>
                <SubTitle
                  key={category}
                  onClick={() => {
                    setFilter({ ...filter, category });
                    setSearch('');
                  }}
                  isSelected={filter.category === category}
                >
                  {category}
                </SubTitle>
                {filter.category === category && (
                  <FilterButton onClick={handleClearCategory}>
                    {/* <Cross size={25} color="#8D9CA4" lineWidth={6} /> */}
                    <RxCross1 className="cancel" />
                  </FilterButton>
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
                  onClick={() => {
                    setFilter({ ...filter, status });
                    setSearch('');
                  }}
                  isSelected={filter.status === status}
                >
                  {status}
                </SubTitle>
                {filter.status === status && (
                  // <FilterButton onClick={handleClearStatus}>X</FilterButton>
                  <FilterButton onClick={handleClearStatus}>
                    {/* <Cross size={25} color="#8D9CA4" lineWidth={6} /> */}
                    <RxCross1 className="cancel" />
                  </FilterButton>
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
        {isPopout && (
          <Popout
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        )}
      </ItemContainer>
      <Background />
    </Container>
  );
}
