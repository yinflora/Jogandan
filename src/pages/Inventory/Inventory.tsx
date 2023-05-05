import { useEffect, useRef, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import styled from 'styled-components/macro';

import { getItems, getItemById } from '../../utils/firebase';
import { AuthContext } from '../../context/authContext';
import Popout from './Popout';
import Search from '../../components/Icon/Search';
import { RxCross1 } from 'react-icons/rx';

const Container = styled.div`
  width: 1000px;
  margin: 150px auto 60px;
  color: #fff;
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 460px;
  background-color: #8d9ca4;
`;

const TopWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 60px;
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
  display: flex;
  width: 100%;
  height: 45px;
  margin-bottom: 15px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #fff;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;
    left: 0;
    background-color: rgba(255, 255, 255, 0.1);
    border-bottom: 2px solid #fff;
    opacity: 0;
    transition: all 0.5s;
  }

  &:focus-within::before {
    left: 0;
    right: 0;
    opacity: 1;
  }
`;

const SearchBar = styled.input`
  width: 80%;
  height: 100%;
  padding-left: 6px;
  overflow-x: scroll;
  font-size: 1.25rem;
  line-height: 100%;
  color: #fff;
`;

const SearchBtn = styled.button`
  border: none;
  cursor: pointer;
`;

const SearchText = styled.p`
  font-size: 1rem;
`;

const ItemContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
`;

const FilterWrapper = styled.div`
  display: flex;
  width: auto;
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
  height: 15px;
  justify-content: space-between;
  align-items: center;
`;

const SubTitle = styled.p<{ isSelected: boolean }>`
  font-size: 14px;
  letter-spacing: 0.2rem;
  color: ${({ isSelected }) => (isSelected ? '#8D9CA4' : '#b5b4b4')};
  font-weight: ${({ isSelected }) => isSelected && 500};
  transition: 0.3s ease-out;
  cursor: pointer;
`;

const FilterButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  & .cancel {
    width: 15px;
    height: 15px;
    color: #8d9ca4;
    stroke-width: 0.5px;
    transition: 0.3s ease-in;
  }
`;

const Split = styled.div`
  width: 100%;
  height: 1px;
  background-color: #000;
`;

const ProductWrapper = styled.div`
  display: grid;
  width: 75%;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-template-rows: repeat(4, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 60px;
`;

const Product = styled.div`
  width: 100%;
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 0.5px solid #cdcdcd;
  transition: all 0.2s ease-in-out;
  filter: grayscale(50%);
  cursor: pointer;

  &:hover {
    filter: none;
  }
`;

const Name = styled.p`
  margin-top: 30px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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

  const [items, setItems] = useState<Items | null>(null);
  const [filter, setFilter] = useState<Filter>({
    category: '',
    status: '',
  });
  const [isPopout, setIsPopout] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [search, setSearch] = useState<string>('');
  const [isBottom, setIsBottom] = useState<boolean>(false);

  const itemsRef = useRef<Items | null>(null);
  const startIndexRef = useRef<number>(0);
  const MAX_ITEMS = 24;
  const BOTTOM_HEIGHT = 150;

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;

    async function fetchData() {
      if (filter.category !== '' || filter.status !== '') return;

      const itemList = await getItems(uid);
      itemsRef.current = itemList;

      const slicedItems = itemList.slice(0, MAX_ITEMS);
      setItems(slicedItems);
      startIndexRef.current = MAX_ITEMS;
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
    function handleScroll() {
      const scrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;
      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const distanceFromBottom = pageHeight - (scrollY + windowHeight);

      setIsBottom(distanceFromBottom < BOTTOM_HEIGHT);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      !isBottom ||
      !itemsRef.current ||
      !items ||
      items.length === itemsRef.current.length ||
      filter.category !== '' ||
      filter.status !== ''
    )
      return;

    const startIndex = startIndexRef.current;
    const endIndex = startIndexRef.current + MAX_ITEMS;

    const slicedItems = itemsRef.current.slice(startIndex, endIndex);
    const newItems = [...items, ...slicedItems];

    setItems(newItems);

    startIndexRef.current = endIndex;
  }, [isBottom]);

  useEffect(() => {
    async function handleFilter() {
      if (!itemsRef.current) return;

      const itemList = await getItems(uid);
      itemsRef.current = itemList;

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
  }, [filter, isPopout]);

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

  function handleSearch() {
    if (itemsRef.current) {
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchBtn onClick={handleSearch}>
              <Search />
            </SearchBtn>
          </SearchWrapper>
          <SearchText>
            FILTER：
            {/* {(() => {
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
            })()} */}
            {(() => {
              if (filter.category === '' && filter.status === '') {
                return 'All';
              } else if (filter.category !== '' && filter.status !== '') {
                return `${filter.category}｜${filter.status} (${
                  itemsRef.current &&
                  itemsRef.current.filter(
                    (item) =>
                      item.category === filter.category &&
                      item.status === filter.status
                  ).length
                })`;
              } else if (filter.category !== '') {
                return `${filter.category} (${
                  itemsRef.current &&
                  itemsRef.current.filter(
                    (item) => item.category === filter.category
                  ).length
                })`;
              }
              return `${filter.status} (${
                itemsRef.current &&
                itemsRef.current.filter((item) => item.status === filter.status)
                  .length
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
              setFilter({ category: '', status: '' });
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
                  <FilterButton onClick={handleClearStatus}>
                    <RxCross1 className="cancel" />
                  </FilterButton>
                )}
              </TitleWrapper>
            ))}
          </SubFilterWrapper>
        </FilterWrapper>
        <ProductWrapper>
          {items &&
            items.map((item: any, index: number) => (
              <Product key={index}>
                {item.images && (
                  <Image
                    src={item.images[0]}
                    onClick={() => navigate(`/inventory/${item.id}`)}
                  ></Image>
                )}
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
