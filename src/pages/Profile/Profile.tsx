import { useContext, useEffect, useState, useRef, useReducer } from 'react';
import { AuthContext } from '../../context/authContext';
import { getItems, getBoard } from '../../utils/firebase';
import Level from '../../components/Level/Level';
import Report from '../../components/Report/Report';
import { Timestamp } from 'firebase/firestore';
import { fabric } from 'fabric';
import { useNavigate } from 'react-router-dom';

import styled, { css } from 'styled-components/macro';
import Cross from '../../components/Icon/Cross';

// import { HiArrowRight } from 'react-icons/hi';
import { TfiArrowRight } from 'react-icons/tfi';

const Container = styled.div`
  margin: 0 auto;
  /* padding: 0 280px 60px 150px; */
  padding: 0 0 100px 150px;
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
  width: 980px;
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

// const VisionBoard = styled.img`
//   /* width: 100%; */
//   width: 980px;
//   margin-top: 100px;
//   aspect-ratio: 625/475;
//   background-color: gray;
// `;

const VisionBoardWrapper = styled.div`
  display: flex;
  width: 980px;
  flex-direction: column;
`;

const VisionBoard = styled.div`
  width: 980px;
  margin-top: 100px;
  aspect-ratio: 625/475;
  background-color: #f4f3ef;
`;

const EditButton = styled.button`
  display: flex;
  margin: 10px 0 100px auto;
  padding: 5px 0;
  color: #fff;
  align-items: center;
  gap: 10px;

  &:hover {
    margin-bottom: 99px;
    border-bottom: 1px solid #fff;
    cursor: pointer;
  }
`;

const ModeFilter = styled.div`
  display: flex;
  /* margin-top: 100px; */
  align-items: center;
`;

const ModeToggler = styled.div`
  display: flex;
  width: 100px;
  height: 35px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  border: 1px solid #fff;
  color: #fff;
  font-size: 0.85rem;
`;

const CurrentMode = styled(ModeToggler)<{ isDeclutteredMode: boolean }>`
  ${({ isDeclutteredMode }) =>
    !isDeclutteredMode &&
    css`
      background-color: #fff;
      color: #8d9ca4;
    `}

  &:hover {
    cursor: pointer;
  }
`;

const DeclutterMode = styled(ModeToggler)<{ isDeclutteredMode: boolean }>`
  ${({ isDeclutteredMode }) =>
    isDeclutteredMode &&
    css`
      background-color: #fff;
      color: #8d9ca4;
    `}

  &:hover {
    cursor: pointer;
  }
`;

const PeriodFilter = styled.div<{ disabled: boolean }>`
  display: flex;
  width: 1000px;
  justify-content: space-between;
  margin-top: 30px;
  color: #fff;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}
`;

const PeriodWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  width: 100px;
  color: #fff;
  text-transform: uppercase;
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
  font-size: 0.85rem;
  letter-spacing: 0.2rem;
  color: #fff;

  &[type='date']::-webkit-calendar-picker-indicator {
    color: #fff;
    filter: invert(1);

    &:hover {
      cursor: pointer;
    }
  }
`;

const Dash = styled.div`
  width: 10px;
  height: 1px;
  background-color: #fff;
`;

const Cancel = styled.div`
  margin-left: 10px;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const FilterBtn = styled.button`
  padding: 0 20px;
  border-left: 1px solid #fff;
  font-size: 0.85rem;
  letter-spacing: 0.1rem;
  color: #fff;

  &:first-of-type {
    border: none;
  }

  &:hover {
    cursor: pointer;
  }
`;

// const AnalyzeWrapper = styled.div`
//   display: flex;
//   width: 100%;
//   height: 500px;
//   margin-top: 50px;
// `;

const ReportWrapper = styled.div`
  /* position: relative;
  width: 100%;
  height: 0;
  padding-top: 60%;
  overflow: hidden; */
  display: flex;
  margin-right: auto;
`;

const QtyWrapper = styled.div`
  display: flex;
  width: 120px;
  height: 120px;
  margin-top: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

// const Overlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   z-index: 1;
//   display: flex;
//   width: 100vw;
//   height: 100vh;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   background-color: rgba(0, 0, 0, 0.5);
// `;

// const Toast = styled.div`
//   position: relative;
//   display: flex;
//   width: 600px;
//   height: 600px;
//   background-color: #fff;
//   justify-content: center;
//   align-items: end;
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   font-size: 1.25rem;
// `;

// const LinkButton = styled.button`
//   width: 300px;
//   height: 50px;
//   /* margin: 0 auto; */
//   background-color: #8d9ca4;
// `;

// const StyledLink = styled(Link)`
//   font-size: 1.5rem;
//   color: #fff;
// `;

// type Row = string[];

// const CATEGORIES: Row = [
//   '居家生活',
//   '服飾配件',
//   '美妝保養',
//   '3C產品',
//   '影音產品',
//   '書報雜誌',
//   '體育器材',
//   '寵物用品',
//   '食物及飲料',
//   '興趣及遊戲',
//   '紀念意義',
//   '其他',
// ];

type Action =
  | { type: 'FETCH_DATA'; payload: { data: Items } }
  | {
      type: 'FILTER_PERIOD';
      payload: {
        data: Items;
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
      if (isNaN(payload.periodStart) || isNaN(payload.periodEnd)) {
        return payload.data ?? [];
      }
      return (
        payload.data.filter((item: Item) => {
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
// function reducer(items: Items, action: Action): Items {
//   const { type, payload } = action;
//   switch (type) {
//     case 'FETCH_DATA': {
//       return payload.data;
//     }
//     case 'FILTER_PERIOD':
//       return (
//         payload.data.filter((item: Item) => {
//           const createdTime = new Date(
//             item.created.seconds * 1000 + item.created.nanoseconds / 1000000
//           ).getTime();
//           return (
//             createdTime >= payload.periodStart &&
//             createdTime <= payload.periodEnd
//           );
//         }) ?? []
//       );
//     default: {
//       throw Error('err');
//     }
//   }
// }

// function reducer(items: Items, action: Action): Items {
//   const { type, payload } = action;
//   switch (type) {
//     case 'FETCH_DATA': {
//       return payload.data;
//     }
//     case 'FILTER_PERIOD':
// if (payload.periodStart.isNaN() || payload.periodEnd.isNaN()) {
//   return payload.data ?? [];
// }
// return (
//   payload.data.filter((item: Item) => {
//     const createdTime = new Date(
//       item.created.seconds * 1000 + item.created.nanoseconds / 1000000
//     ).getTime();
//     return (
//       createdTime >= payload.periodStart &&
//       createdTime <= payload.periodEnd
//     );
//   }) ?? []
// );
//     default: {
//       throw Error('err');
//     }
//   }
// }

// async function reducer(items: Items, action: Action): Items {
//   const { type, payload } = action;
//   switch (type) {
//     case 'FETCH_DATA': {
//       const data = await getItems(payload.uid);
//       return data;
//     }
//     case 'FILTER_PERIOD':
//       return (
//         payload.items?.filter((item: Item) => {
//           const createdTime = new Date(
//             item.created.seconds * 1000 + item.created.nanoseconds / 1000000
//           ).getTime();
//           return (
//             createdTime >= payload.periodStart &&
//             createdTime <= payload.periodEnd
//           );
//         }) ?? []
//       );
//     default: {
//       throw Error('err');
//     }
//   }
// }

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

export default function Profile() {
  const { user, uid, lastLoginInTime } = useContext(AuthContext);
  const navigate = useNavigate();

  const [items, dispatch] = useReducer(reducer, []);
  // const [existingItems, setExistingItems] = useState<[]>([]);
  // const [declutteredItems, setDeclutteredItems] = useState<Items>(null);
  const [period, setPeriod] = useState<Period>({ start: '', end: '' });
  const [canPlay, setCanPlay] = useState<boolean>(false);
  // const [boardUrl, setBoardUrl] = useState<string>('');
  const [isDeclutteredMode, setIsDeclutteredMode] = useState<boolean>(false);

  const itemRef = useRef<Items | null>(null);
  const existingItemsRef = useRef<Items | []>([]);

  console.log(canPlay);
  // console.log(items);

  useEffect(() => {
    async function fetchData() {
      const data = await getItems(uid);
      dispatch({ type: 'FETCH_DATA', payload: { data } });
      itemRef.current = data;

      const boardId = localStorage.getItem('boardId');
      const board = await getBoard(uid, boardId);
      // if (board) setBoardUrl(board.url);
      if (board) {
        const canvas = new fabric.Canvas('canvas', {
          width: 980,
          height: 748,
        });

        // fabric.loadSVGFromString(board.url, (objects, options) => {
        //   const obj = fabric.util.groupSVGElements(objects, options);
        //   canvas.add(obj).renderAll();
        // });

        canvas.loadFromJSON(board.data, () => {
          const scaleX = canvas.getWidth() / 625;
          const scaleY = canvas.getHeight() / 475;
          const zoom = Math.max(scaleX, scaleY);
          canvas.setZoom(zoom);
          canvas.selection = false;
          canvas.forEachObject((obj) => {
            obj.selectable = false;
          });
        });
      }

      // const filteredItems = data.filter((item) => item.status !== '已處理');
      // const qtyList = filteredItems.reduce((acc, item) => {
      //   const index = CATEGORIES.indexOf(item.category);
      //   if (index !== -1) {
      //     acc[index]++;
      //   }
      //   return acc;
      // }, Array(CATEGORIES.length).fill(0));

      existingItemsRef.current = data.filter(
        (item) => item.status !== '已處理'
      );
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
    // function countItems() {
    //   const hasPeriod: boolean = Object.values(period).every(
    //     (time) => time !== ''
    //   );
    //   if (hasPeriod) {
    //     const periodStart = new Date(`${period.start}T00:00:00.000Z`).getTime();
    //     const periodEnd = new Date(`${period.end}T23:59:59.999Z`).getTime();
    //     const declutteredItems = itemRef.current?.filter(
    //       (item) => item.status === '已處理'
    //     );

    //     dispatch({
    //       type: 'FILTER_PERIOD',
    //       payload: { data: declutteredItems, periodStart, periodEnd },
    //     });
    //   }
    // }
    // countItems();

    // const hasPeriod: boolean = Object.values(period).every(
    //   (time) => time !== ''
    // );
    // if (hasPeriod)
    if (isDeclutteredMode) countItems();
  }, [period, isDeclutteredMode]);

  function countItems() {
    if (!itemRef.current) return;

    const periodStart = new Date(`${period.start}T00:00:00.000Z`).getTime();
    const periodEnd = new Date(`${period.end}T23:59:59.999Z`).getTime();

    const declutteredItems = itemRef.current.filter(
      (item) => item.status === '已處理'
    );

    // console.log(periodStart, periodEnd);
    // console.log(declutteredItems);

    dispatch({
      type: 'FILTER_PERIOD',
      payload: { data: declutteredItems, periodStart, periodEnd },
    });
  }

  // function caculateReportItems() {
  //   const periodStart = new Date(`${period.start}T00:00:00.000Z`).getTime();
  //   const periodEnd = new Date(`${period.end}T23:59:59.999Z`).getTime();

  //   if (isDeclutteredMode) {
  //     const declutteredItems = items.filter((item) => item.status === '已處理');

  //     dispatch({
  //       type: 'FILTER_PERIOD',
  //       payload: { data: declutteredItems, periodStart, periodEnd },
  //     });
  //   } else {
  //     if (!itemRef.current) return;
  //     const existingItems = itemRef.current.filter(
  //       (item) => item.status !== '已處理'
  //     );

  //     dispatch({
  //       type: 'FETCH_DATA',
  //       payload: { data: existingItems },
  //     });
  //   }
  // }

  function handleLevel() {
    const disposedItems: number | undefined = itemRef.current?.filter(
      (item) => item.status === '已處理'
    ).length;

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

        {/* <VisionBoard src={boardUrl} /> */}
        <VisionBoardWrapper>
          <VisionBoard>
            <canvas id="canvas" />
          </VisionBoard>
          <EditButton onClick={() => navigate(`/compose`)}>
            <span>編輯夢想版</span>
            <TfiArrowRight />
          </EditButton>
        </VisionBoardWrapper>

        <ModeFilter>
          <Label>FILTER</Label>
          <CurrentMode
            isDeclutteredMode={isDeclutteredMode}
            onClick={() => setIsDeclutteredMode(false)}
          >
            目前持有
          </CurrentMode>
          <DeclutterMode
            isDeclutteredMode={isDeclutteredMode}
            onClick={() => setIsDeclutteredMode(true)}
          >
            已處理
          </DeclutterMode>
        </ModeFilter>
        <PeriodFilter disabled={!isDeclutteredMode}>
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
            <Cancel onClick={() => setPeriod({ start: '', end: '' })}>
              <Cross size={30} color="#fff" lineWidth={4} />
            </Cancel>
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

        {/* <AnalyzeWrapper> */}
        <ReportWrapper>
          {/* <Report existingItems={existingItems} /> */}
          <Report
            items={isDeclutteredMode ? items : existingItemsRef.current}
          />
          {/* <Report items={items} /> */}

          {/* </AnalyzeWrapper> */}
          <QtyWrapper>
            <Qty>
              {isDeclutteredMode
                ? items.length
                : existingItemsRef.current.length}
              {/* {isDeclutteredMode
                ? items.filter((item: any) => item.status === '已處理').length
                : existingItemsRef.current.reduce(
                    (acc: number, curr: number) => acc + curr,
                    0
                  )} */}
            </Qty>
            <QtyTitle>
              {items.length <= 1 || existingItemsRef.current.length <= 1
                ? 'ITEM'
                : 'ITEMS'}
            </QtyTitle>
          </QtyWrapper>
        </ReportWrapper>
      </Container>
      <Background />
      {/* //Todo: 昨天以前才可以popout */}
      {/* <div>
        <button onClick={() => setCanPlay(false)}>X</button>
        你今天TOUCH了嗎？
        <Link to="/sparkJoy">馬上開始</Link>
      </div> */}

      {/* <Overlay>
        <Toast>
          <CloseButton onClick={() => setCanPlay(false)}>X</CloseButton>
          <LinkButton>
            <StyledLink to="/sparkJoy">立刻去玩</StyledLink>
          </LinkButton>
        </Toast>
      </Overlay> */}
    </>
  );
}
