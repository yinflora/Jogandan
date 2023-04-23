import { useContext, useEffect, useState, useRef, useReducer } from 'react';
import { AuthContext } from '../../context/authContext';
import { getItems, getBoard } from '../../utils/firebase';
import Level from '../../components/Level/Level';
import Report from '../../components/Report/Report';
import { Timestamp } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';

import styled from 'styled-components/macro';

const Container = styled.div`
  margin: 0 auto;
  padding: 0 280px 60px 150px;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  z-index: -1;
  width: 100vw;
  height: 120vh;
  background-color: #fff;
`;

const WelcomeMessage = styled.p`
  letter-spacing: 0.2rem;
  line-height: 1.5rem;
  text-transform: uppercase;
  text-align: end;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: end;
  gap: 40px;
`;

const UserImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserName = styled.p`
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
`;

const UserGrade = styled.p`
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #8d9ca4;
`;

const VisionBoard = styled.img`
  width: 100%;
  margin-top: 100px;
  aspect-ratio: 625/475;
  background-color: gray;
`;

const PeriodFilter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 150px;
  color: #fff;
`;

const PeriodWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  width: 70px;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #fff;
`;

const DateInput = styled.input`
  width: 150px;
  font-family: 'TT Norms Pro', sans-serif;
  font-size: 1rem;
  letter-spacing: 0.2rem;
  color: #fff;
`;

const Dash = styled.div`
  width: 10px;
  height: 1px;
  background-color: #fff;
`;

const Cancel = styled.button`
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const FilterWrapper = styled.div``;

const FilterBtn = styled.button`
  padding: 0 20px;
  border-left: 1px solid #fff;
  letter-spacing: 0.1rem;
  color: #fff;

  &:first-of-type {
    border: none;
  }

  &:hover {
    cursor: pointer;
  }
`;

const AnalyzeWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
  margin-top: 50px;
`;

const ReportWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 60%;
  overflow: hidden;
`;

const QtyContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const QtyWrapper = styled.div`
  display: flex;
  /* height: calc(100% / 3 - 20px); */
  width: 120px;
  height: 120px;
  margin-top: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* aspect-ratio: 1/1; */
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-align: center;
`;

const Qty = styled.div`
  margin-bottom: 10px;
  font-size: 3rem;
`;

const QtyTitle = styled.p`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Toast = styled.div`
  position: relative;
  display: flex;
  width: 600px;
  height: 600px;
  background-color: #fff;
  justify-content: center;
  align-items: end;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.25rem;
`;

const LinkButton = styled.button`
  width: 300px;
  height: 50px;
  /* margin: 0 auto; */
  background-color: #8d9ca4;
`;

const StyledLink = styled(Link)`
  font-size: 1.5rem;
  color: #fff;
`;

type Row = string[];

const CATEGORIES: Row = [
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

type Action =
  | { type: 'FETCH_DATA'; payload: { data: Items } }
  | {
      type: 'FILTER_PERIOD';
      payload: {
        items: Items | null;
        periodStart: number;
        periodEnd: number;
      };
    };

function reducer(items: Items, action: Action): Items {
  const { type, payload } = action;
  switch (type) {
    case 'FETCH_DATA': {
      return payload.data;
    }
    case 'FILTER_PERIOD':
      return (
        payload.items?.filter((item: Item) => {
          const createdTime = new Date(
            item.created.seconds * 1000 + item.created.nanoseconds / 1000000
          ).getTime();
          return (
            createdTime >= payload.periodStart &&
            createdTime <= payload.periodEnd
          );
        }) ?? []
      );
    default: {
      throw Error('err');
    }
  }
}

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

type Period = {
  start: string;
  end: string;
};

// type ReportItems = number[] | [];

export default function Profile() {
  const { user, uid, lastLoginInTime } = useContext(AuthContext);

  const [items, dispatch] = useReducer(reducer, []);
  const [period, setPeriod] = useState<Period>({ start: '', end: '' });
  // const [items, setItems] = useState<[] | null>(null);
  const [processedItems, setProcessedItems] = useState<[]>([]);
  // const [existingItems, setExistingItems] = useState<[]>([]);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [boardUrl, setBoardUrl] = useState<string>('');

  const itemRef = useRef<Items | null>(null);

  // console.log('items', items);
  console.log(canPlay);

  useEffect(() => {
    async function fetchData() {
      const data = await getItems(uid);

      const boardId = localStorage.getItem('boardId');
      const board = await getBoard(uid, boardId);
      if (board) setBoardUrl(board.url);

      itemRef.current = data;
      dispatch({ type: 'FETCH_DATA', payload: { data } });

      const filteredItems = data.filter((item) => item.status !== '已處理');

      const qtyList = filteredItems.reduce((acc, item) => {
        const index = CATEGORIES.indexOf(item.category); // 取得分類在 categories 中的索引
        if (index !== -1) {
          // 如果分類存在
          acc[index]++; // 將對應的數量加 1
        }
        return acc;
      }, Array(CATEGORIES.length).fill(0)); // 初始化為 0 的陣列

      setProcessedItems(qtyList);
    }

    function compareTime() {
      if (!lastLoginInTime) return;

      const today = new Date();
      const date = new Date(lastLoginInTime);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const isYesterday =
        date.getDate() === today.getDate() - 1 &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      //Todo: popout小遊戲
      if (isToday) {
        console.log('是今天');
      } else if (isYesterday || date < today) {
        console.log('是昨天以前');
        setCanPlay(true);
      }
      return null;
    }

    fetchData();
    compareTime();
  }, [uid, lastLoginInTime]);

  useEffect(() => {
    function countItems() {
      const hasPeriod: boolean = Object.values(period).every(
        (time) => time !== ''
      );
      if (hasPeriod) {
        const periodStart = new Date(`${period.start}T00:00:00.000Z`).getTime();
        const periodEnd = new Date(`${period.end}T23:59:59.999Z`).getTime();

        dispatch({
          type: 'FILTER_PERIOD',
          payload: { items: itemRef.current, periodStart, periodEnd },
        });
      }
    }
    countItems();
  }, [period]);

  useEffect(() => {
    const filteredItems = items.filter(
      (item: Item) => item.status !== '已處理'
    );

    const qtyList = filteredItems.reduce((acc: any, item: Item) => {
      const index = CATEGORIES.indexOf(item.category); // 取得分類在 categories 中的索引
      if (index !== -1) {
        // 如果分類存在
        acc[index]++; // 將對應的數量加 1
      }
      return acc;
    }, Array(CATEGORIES.length).fill(0)); // 初始化為 0 的陣列

    setProcessedItems(qtyList);
  }, [items]);

  function handleLevel() {
    const disposedItems: number | undefined = itemRef.current?.filter(
      (item) => item.status === '已處理'
    ).length;
    // const processedItems = 55;

    if (disposedItems) {
      if (disposedItems >= 100) {
        return 'Master';
      } else if (disposedItems < 100 && disposedItems >= 50) {
        return 'Veteran';
      } else if (disposedItems < 50 && disposedItems >= 10) {
        return 'Seasoned';
      }
    }
    return 'Rookie';
  }

  function getLastWeek() {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    // 格式化日期为 YYYY-MM-DD
    const formattedSevenDaysAgo = `${sevenDaysAgo.getFullYear()}-${String(
      sevenDaysAgo.getMonth() + 1
    ).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`;
    return formattedSevenDaysAgo;
  }

  function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  function setThisMonth() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    // 格式化日期为 YYYY-MM-DD
    const formattedFirstDayOfMonth = `${firstDayOfMonth.getFullYear()}-${String(
      firstDayOfMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(2, '0')}`;
    const formattedLastDayOfMonth = `${lastDayOfMonth.getFullYear()}-${String(
      lastDayOfMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`;
    setPeriod({
      start: formattedFirstDayOfMonth,
      end: formattedLastDayOfMonth,
    });
  }

  function setLastMonth() {
    const today = new Date();
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );
    // 格式化日期为 YYYY-MM-DD
    const formattedFirstDayOfLastMonth = `${firstDayOfLastMonth.getFullYear()}-${String(
      firstDayOfLastMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(firstDayOfLastMonth.getDate()).padStart(
      2,
      '0'
    )}`;
    const formattedLastDayOfLastMonth = `${lastDayOfLastMonth.getFullYear()}-${String(
      lastDayOfLastMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(lastDayOfLastMonth.getDate()).padStart(
      2,
      '0'
    )}`;
    setPeriod({
      start: formattedFirstDayOfLastMonth,
      end: formattedLastDayOfLastMonth,
    });
  }

  function setThisYear() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
    // 格式化日期为 YYYY-MM-DD
    const formattedFirstDayOfYear = `${firstDayOfYear.getFullYear()}-${String(
      firstDayOfYear.getMonth() + 1
    ).padStart(2, '0')}-${String(firstDayOfYear.getDate()).padStart(2, '0')}`;
    const formattedLastDayOfYear = `${lastDayOfYear.getFullYear()}-${String(
      lastDayOfYear.getMonth() + 1
    ).padStart(2, '0')}-${String(lastDayOfYear.getDate()).padStart(2, '0')}`;
    setPeriod({
      start: formattedFirstDayOfYear,
      end: formattedLastDayOfYear,
    });
  }

  function setLastYear() {
    const today = new Date();
    const lastYearStartDate = new Date(today.getFullYear() - 1, 0, 1); // 去年的第一天
    const lastYearEndDate = new Date(today.getFullYear() - 1, 11, 31); // 去年的最后一天
    // 格式化日期为 YYYY-MM-DD
    const formattedLastYearStartDate = `${lastYearStartDate.getFullYear()}-${String(
      lastYearStartDate.getMonth() + 1
    ).padStart(2, '0')}-${String(lastYearStartDate.getDate()).padStart(
      2,
      '0'
    )}`;
    const formattedLastYearEndDate = `${lastYearEndDate.getFullYear()}-${String(
      lastYearEndDate.getMonth() + 1
    ).padStart(2, '0')}-${String(lastYearEndDate.getDate()).padStart(2, '0')}`;
    setPeriod({
      start: formattedLastYearStartDate,
      end: formattedLastYearEndDate,
    });
  }

  return (
    <>
      <Container>
        <WelcomeMessage>
          WELCOME
          <br />
          BACK
        </WelcomeMessage>
        <UserInfo>
          <UserImage src={user.photoURL as string} />
          <InfoWrapper>
            <UserName>{user.displayName}</UserName>
            <UserGrade>{items && handleLevel()}</UserGrade>
          </InfoWrapper>
        </UserInfo>

        <Level
          percent={
            itemRef.current
              ? itemRef.current.filter((item) => item.status === '已處理')
                  .length / 100
              : 0
          }
        />

        <VisionBoard src={boardUrl} />

        <PeriodFilter>
          <PeriodWrapper>
            <Label htmlFor="date">PERIOD</Label>
            <InputWrapper>
              <DateInput
                id="date"
                type="date"
                value={period.start}
                onChange={(e) =>
                  setPeriod({ ...period, start: e.target.value })
                }
              />
              <Dash />
              <DateInput
                id="date"
                type="date"
                value={period.end}
                onChange={(e) => setPeriod({ ...period, end: e.target.value })}
              />
            </InputWrapper>
            <Cancel onClick={() => setPeriod({ start: '', end: '' })}>X</Cancel>
          </PeriodWrapper>

          <FilterWrapper>
            <FilterBtn
              onClick={() =>
                setPeriod({ start: getLastWeek(), end: getToday() })
              }
            >
              過去 7 天
            </FilterBtn>
            <FilterBtn onClick={setThisMonth}>本月</FilterBtn>
            <FilterBtn onClick={setLastMonth}>上個月</FilterBtn>
            <FilterBtn onClick={setThisYear}>今年</FilterBtn>
            <FilterBtn onClick={setLastYear}>去年</FilterBtn>
          </FilterWrapper>
        </PeriodFilter>

        <AnalyzeWrapper>
          <ReportWrapper>
            <Report processedItems={processedItems} />
          </ReportWrapper>

          <QtyContainer>
            <QtyWrapper>
              <Qty>{itemRef.current?.length}</Qty>
              <QtyTitle>TOTAL</QtyTitle>
            </QtyWrapper>
            <QtyWrapper>
              <Qty>
                {items?.filter((item: any) => item.status === '已處理').length}
              </Qty>
              <QtyTitle>REDUCE</QtyTitle>
            </QtyWrapper>
            <QtyWrapper>
              <Qty>
                {items?.filter((item: any) => item.status !== '已處理').length}
              </Qty>
              <QtyTitle>INCREASE</QtyTitle>
            </QtyWrapper>
          </QtyContainer>
        </AnalyzeWrapper>
      </Container>
      <Background />
      {/* //Todo: 昨天以前才可以popout */}
      <div>
        <button onClick={() => setCanPlay(false)}>X</button>
        你今天TOUCH了嗎？
        {/* <Link to="/sparkJoy">馬上開始</Link> */}
      </div>

      <Overlay>
        <Toast>
          <CloseButton>X</CloseButton>
          <LinkButton>
            <StyledLink to="/sparkJoy">立刻去玩</StyledLink>
          </LinkButton>
        </Toast>
      </Overlay>
    </>
  );
}
