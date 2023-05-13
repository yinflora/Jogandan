import { useContext, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { v4 as uuidv4 } from 'uuid';
import Search from '../../components/Icon/Search';
import { AuthContext } from '../../context/authContext';
import { Category, Item, Status } from '../../types/types';
import Popout from './Popout';

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
  cursor: default;
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
  z-index: 1;
  border: none;
  cursor: pointer;
`;

const SearchText = styled.p`
  font-size: 1rem;
  cursor: default;
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
  cursor: default;

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

const NoMatchPrompt = styled.div`
  display: flex;
  width: 100%;
  grid-column: 1 / 4;
  padding-top: 165px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  letter-spacing: 0.1rem;
  color: #b5b4b4;
`;

const NoMatchEmoji = styled.p`
  font-size: 3rem;
  letter-spacing: 0.4rem;
  font-weight: 500;
`;

const NoMatchText = styled.p`
  font-size: 1.25rem;
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
  cursor: default;
`;

type Filter = {
  category: Category | '';
  status: Status | '';
};

const SUBCATEGORY: Category[] = [
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
const SUBSTATUS: Status[] = ['保留', '待處理', '已處理'];

export default function Inventory() {
  const { items } = useContext(AuthContext);

  const [filter, setFilter] = useState<Filter>({
    category: '',
    status: '',
  });
  const [search, setSearch] = useState<string>('');

  const { id } = useParams();
  const navigate = useNavigate();

  let userItems: Item[] = items;

  if (filter.category !== '' && filter.status !== '') {
    if (search === '') {
      userItems = items.filter(
        (item: Item) =>
          item.category === filter.category && item.status === filter.status
      );
    } else {
      userItems = items.filter(
        (item: Item) =>
          item.category === filter.category &&
          item.status === filter.status &&
          item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  } else if (filter.category !== '') {
    if (search === '') {
      userItems = items.filter(
        (item: Item) => item.category === filter.category
      );
    } else {
      userItems = items.filter(
        (item: Item) =>
          item.category === filter.category &&
          item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  } else if (filter.status !== '') {
    if (search === '') {
      userItems = items.filter((item: Item) => item.status === filter.status);
    } else {
      userItems = items.filter(
        (item: Item) =>
          item.status === filter.status &&
          item.name.toLowerCase().includes(search.toLowerCase())
      );
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
              }
              if (filter.category !== '' && filter.status !== '') {
                return `${filter.category}｜${filter.status} (${userItems.length})`;
              }
              if (filter.category !== '') {
                return `${filter.category} (${userItems.length})`;
              }
              return `${filter.status} (${userItems.length})`;
            })()}
          </SearchText>
          <SearchText>TOTAL：{items.length}</SearchText>
        </SearchField>
      </TopWrapper>

      <ItemContainer>
        <FilterWrapper>
          <FilterTitle
            onClick={() => {
              setSearch('');
              setFilter({ category: '', status: '' });
            }}
          >
            All
          </FilterTitle>
          <FilterTitle>Category</FilterTitle>
          <SubFilterWrapper>
            {SUBCATEGORY.map((category) => (
              <TitleWrapper>
                <SubTitle
                  key={category}
                  onClick={() => {
                    setFilter({ ...filter, category });
                  }}
                  isSelected={filter.category === category}
                >
                  {category}
                </SubTitle>
                {filter.category === category && (
                  <FilterButton
                    onClick={() => setFilter({ ...filter, category: '' })}
                  >
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
                  }}
                  isSelected={filter.status === status}
                >
                  {status}
                </SubTitle>
                {filter.status === status && (
                  <FilterButton
                    onClick={() => setFilter({ ...filter, status: '' })}
                  >
                    <RxCross1 className="cancel" />
                  </FilterButton>
                )}
              </TitleWrapper>
            ))}
          </SubFilterWrapper>
        </FilterWrapper>

        <ProductWrapper>
          {userItems.length === 0 ? (
            <NoMatchPrompt>
              <NoMatchEmoji>:(</NoMatchEmoji>
              <NoMatchText>沒有符合搜尋條件的項目</NoMatchText>
            </NoMatchPrompt>
          ) : (
            userItems.map((item: Item) => (
              <Product key={uuidv4()}>
                {item.images && (
                  <Image
                    src={item.images[0]}
                    onClick={() => navigate(`/inventory/${item.id}`)}
                  ></Image>
                )}
                <Name>{item.name}</Name>
              </Product>
            ))
          )}
        </ProductWrapper>
        {id && (
          <Popout selectedItem={items.find((item) => item.id === id) || null} />
        )}
      </ItemContainer>
      <Background />
    </Container>
  );
}
