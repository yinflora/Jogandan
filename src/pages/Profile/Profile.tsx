import { useContext, useEffect, useState, useRef, useReducer } from 'react';
import { AuthContext } from '../../context/authContext';
import { getItems } from '../../utils/firebase';
import Level from '../../components/Level/Level';
import Report from '../../components/Report/Report';
import { Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const InformationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Name = styled.p`
  font-size: 2rem;
`;

const Grade = styled.p`
  color: #acaea9;
`;

const Label = styled.label`
  width: 50px;
`;

const DateInput = styled.input``;

// const VisionBoard = styled.div`
//   width: 70vw;
//   height: 60vh;
//   background-color: gray;
// `;

const QtyWrapper = styled.div``;

const Qty = styled.div`
  font-size: 2rem;
`;

const QtyTitle = styled.p``;

const FilterBtn = styled.button`
  border: 1px solid black;
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

  const itemRef = useRef<Items | null>(null);

  // console.log('items', items);
  console.log(canPlay);

  useEffect(() => {
    async function fetchData() {
      const data = await getItems(uid);
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
      {/* <Title>Profile</Title> */}
      //Todo: 昨天以前才可以popout
      <div>
        <button onClick={() => setCanPlay(false)}>X</button>
        你今天TOUCH了嗎？
        <Link to="/sparkJoy">馬上開始</Link>
      </div>
      <Wrapper>
        <Image src={user.photoURL as string} />
        <InformationWrapper>
          <Name>{user.displayName}</Name>
          <Grade>{items && handleLevel()}</Grade>
        </InformationWrapper>
      </Wrapper>
      <Label>Period:</Label>
      <DateInput
        type="date"
        value={period.start}
        onChange={(e) => setPeriod({ ...period, start: e.target.value })}
      />
      <span>~</span>
      <DateInput
        type="date"
        value={period.end}
        onChange={(e) => setPeriod({ ...period, end: e.target.value })}
      />
      <FilterBtn
        onClick={() => setPeriod({ start: getLastWeek(), end: getToday() })}
      >
        過去7天
      </FilterBtn>
      <FilterBtn onClick={setThisMonth}>本月</FilterBtn>
      <FilterBtn onClick={setLastMonth}>上個月</FilterBtn>
      <FilterBtn onClick={setThisYear}>今年</FilterBtn>
      <FilterBtn onClick={setLastYear}>去年</FilterBtn>
      <FilterBtn onClick={() => setPeriod({ start: '', end: '' })}>
        清空
      </FilterBtn>
      {/* <VisionBoard></VisionBoard> */}
      <QtyWrapper>
        <Qty>{itemRef.current?.length}</Qty>
        <QtyTitle>現有物品總數量</QtyTitle>
      </QtyWrapper>
      <QtyWrapper>
        <Qty>
          {items?.filter((item: any) => item.status === '已處理').length}
        </Qty>
        <QtyTitle>減少數量</QtyTitle>
      </QtyWrapper>
      <QtyWrapper>
        <Qty>
          {items?.filter((item: any) => item.status !== '已處理').length}
        </Qty>
        <QtyTitle>增加數量</QtyTitle>
      </QtyWrapper>
      <Level
        percent={
          itemRef.current
            ? itemRef.current.filter((item) => item.status === '已處理')
                .length / 100
            : 0
        }
      />
      <Report processedItems={processedItems} />
    </>
  );
}
