import { useContext, useEffect, useState, useRef, useReducer } from 'react';
import { AuthContext } from '../../context/authContext';
import { getItems } from '../../utils/firebase';
// import { Navigate } from 'react-router-dom';
import Level from '../../components/Level/Level';
import Report from '../../components/Report/Report';

import styled from 'styled-components';

// const Title = styled.h1`
//   font-size: 4rem;
// `;

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

// const Label = styled.span`
//   width: 50px;
// `;

// const Information = styled.span`
//   border: 1px solid #000;
// `;

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

const VisionBoard = styled.div`
  width: 70vw;
  height: 60vh;
  background-color: gray;
`;

const QtyWrapper = styled.div``;

const Qty = styled.div`
  font-size: 2rem;
`;

const QtyTitle = styled.p``;

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

function reducer(items, { type, payload }) {
  switch (type) {
    case 'FETCH_DATA': {
      return payload.data;
    }
    case 'FILTER_PERIOD':
      return items.filter((item) => {
        const createdTime = new Date(
          item.created.seconds * 1000 + item.created.nanoseconds / 1000000
        ).getTime();
        return (
          createdTime >= payload.periodStart && createdTime <= payload.periodEnd
        );
      });
  }
}

export default function Profile() {
  const { user } = useContext(AuthContext);

  const [items, dispatch] = useReducer(reducer, []);
  const [period, setPeriod] = useState<object>({ start: '', end: '' });
  // const [items, setItems] = useState<[] | null>(null);
  const [processedItems, setProcessedItems] = useState<[]>([]);

  const itemRef = useRef<[] | null>(null);

  console.log('items', items);

  useEffect(() => {
    async function fetchData() {
      const data = await getItems();
      itemRef.current = data;
      dispatch({ type: 'FETCH_DATA', payload: { data } });

      const filteredItems = data.filter((item) => item.status === '已處理');

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
    fetchData();
  }, []);

  console.log(processedItems);

  // useEffect(() => {
  //   async function fetchItems() {
  //     const itemList = await getItems();
  //     itemRef.current = itemList;
  //     setItems(itemList);
  //     console.log(itemList);
  //   }
  //   fetchItems();
  // }, []);

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
          payload: { periodStart, periodEnd },
        });

        // const filteredItems = itemRef.current.filter((item) => {
        //   const createdTime = new Date(
        //     item.created.seconds * 1000 + item.created.nanoseconds / 1000000
        //   ).getTime();
        //   const periodStart = new Date(
        //     period.start + 'T00:00:00.000Z'
        //   ).getTime();
        //   const periodEnd = new Date(period.end + 'T23:59:59.999Z').getTime();
        //   return createdTime >= periodStart && createdTime <= periodEnd;
        // });
        // console.log(filteredItems);
        // setItems(filteredItems);

        const filteredItems = items.filter((item) => item.status === '已處理');

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
    }
    countItems();
  }, [period]);

  function handleLevel() {
    const processedItems = itemRef.current?.filter(
      (item) => item.status === '已處理'
    ).length;
    // const processedItems = 55;

    if (processedItems >= 100) {
      return 'Master';
    } else if (processedItems < 100 && processedItems >= 50) {
      return 'Veteran';
    } else if (processedItems < 50 && processedItems >= 10) {
      return 'Seasoned';
    }
    return 'Rookie';
  }

  return (
    <>
      {/* <Title>Profile</Title> */}
      <Wrapper>
        <Image src={user.photoURL} />
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
      {/* <button
        onClick={() =>
          dispatch({ type: 'choose_one', payload: { month: 2023 } })
        }
      >
        test
      </button> */}
      <Report processedItems={processedItems} />
    </>
  );
}
