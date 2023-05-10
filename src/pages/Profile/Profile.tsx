import { fabric } from 'fabric';
import { Timestamp } from 'firebase/firestore';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Level from '../../components/Level/Level';
import Report from '../../components/Report/Report';
import { AuthContext } from '../../context/authContext';
import { getBoard, getItems, storage, updateUser } from '../../utils/firebase';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import styled, { css } from 'styled-components/macro';

import { RxCross1 } from 'react-icons/rx';
import { SlCloudUpload } from 'react-icons/sl';
import { TfiArrowRight } from 'react-icons/tfi';

import Button from '../../components/Button/Button';

const Container = styled.div`
  width: 1000px;
  margin: 150px auto 60px;
  cursor: default;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  z-index: -1;
  width: 100vw;
  height: 1000px;
  background-color: #fff;
`;

const WelcomeMessage = styled.p`
  /* width: 980px; */
  margin-right: 20px;
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

const ModifyImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(141, 156, 164, 0.8);

  & > .upload {
    width: 30px;
    height: 30px;
    color: #fff;
  }
`;

const UserImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;

  &:hover ${ModifyImage} {
    display: flex;
    cursor: pointer;
  }
`;

const UserImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

const InfoWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-direction: column;
  gap: 20px;
`;

const UserName = styled.p`
  max-width: 700px;
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

const LinkToGame = styled.p`
  position: relative;
  margin: 0;
  color: #000;
`;

const GameEntry = styled.button<{ canShow: boolean }>`
  position: relative;
  display: flex;
  width: fit-content;
  margin: 20px 20px 0 auto;
  padding: 0;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: ${({ canShow }) => (canShow ? 'pointer' : 'default')};
  opacity: ${({ canShow }) => (canShow ? 1 : 0)};

  &::after {
    position: absolute;
    content: '';
    width: 0;
    left: 0;
    bottom: -5px;
    background: #8d9ca4;
    height: 1px;
    transition: 0.3s ease-out;
  }
  &:hover::after {
    width: 100%;
  }

  &:hover ${LinkToGame} {
    color: #8d9ca4;
  }
  &:hover .arrow {
    transform: translateX(4px);
    color: #8d9ca4;
  }

  & .arrow {
    width: 15px;
    height: 15px;
    stroke-width: 0.5px;
    transition: 0.2s;
    transition-delay: 0.2s;
  }
`;

const VisionBoardWrapper = styled.div`
  display: flex;
  width: 980px;
  flex-direction: column;
`;

const VisionBoard = styled.div`
  position: relative;
  width: 980px;
  margin-top: 80px;
  aspect-ratio: 625/475;
  background-color: #f4f3ef;
`;

const VisionBoardOverlay = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const LinkToEdit = styled(LinkToGame)`
  color: #fff;
`;

const EditButton = styled.button<{ canShow: boolean }>`
  position: relative;
  display: flex;
  width: fit-content;
  margin: 15px 0 100px auto;
  padding: 0;
  color: #fff;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  cursor: pointer;
  opacity: ${({ canShow }) => (canShow ? 1 : 0)};

  &::after {
    position: absolute;
    content: '';
    width: 0;
    left: 0;
    bottom: -5px;
    background: #fff;
    height: 1px;
    transition: 0.3s ease-out;
  }
  &:hover::after {
    width: 100%;
  }

  &:hover .arrow {
    transform: translateX(4px);
    color: #fff;
  }

  & .arrow {
    width: 15px;
    height: 15px;
    stroke-width: 0.5px;
    transition: 0.2s;
    transition-delay: 0.2s;
  }
`;

const ModeFilter = styled.div`
  display: flex;
  align-items: center;
`;

const ModeToggler = styled.div`
  position: relative;
  display: flex;
  width: 100px;
  height: 35px;
  margin-right: 20px;
  justify-content: center;
  align-items: center;
  border: 1px solid #fff;
  color: #fff;
  font-size: 0.85rem;

  &:hover {
    color: #8d9ca4;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;
    left: 0;
    background-color: #fff;
    opacity: 0;
    z-index: -1;
    transition: all 0.5s;
  }

  &:hover::before {
    left: 0;
    right: 0;
    opacity: 1;
  }
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
  height: 30px;
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

  &:hover {
    cursor: pointer;
  }

  & > .clear {
    &:hover {
      stroke-width: 0.5;
    }
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
    font-weight: 500;
  }
`;

const ReportWrapper = styled.div`
  position: relative;
`;

const QtyWrapper = styled.div`
  position: absolute;
  top: 0;
  right: -120px;
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
  const { user, setUser, uid } = useContext(AuthContext);
  const navigate = useNavigate();

  const [items, dispatch] = useReducer(reducer, []);
  const [existingItems, setExistingItems] = useState<Items | []>([]);
  const [period, setPeriod] = useState<Period>({ start: '', end: '' });
  const [isDeclutteredMode, setIsDeclutteredMode] = useState<boolean>(false);

  const [isFirst, setIsFirst] = useState<boolean>(false);

  const itemRef = useRef<Items | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getItems(uid);
      dispatch({ type: 'FETCH_DATA', payload: { data } });
      itemRef.current = data;

      const boardId = localStorage.getItem(`${uid}/boardId`);
      const board = await getBoard(uid, boardId);

      if (board) {
        if (!board.isEdited) setIsFirst(true);

        const canvas = new fabric.Canvas('canvas', {
          width: 980,
          height: 748,
        });

        canvas.loadFromJSON(board.data, () => {
          const scaleX = canvas.getWidth() / 625;
          const scaleY = canvas.getHeight() / 475;
          const zoom = Math.max(scaleX, scaleY);
          canvas.setZoom(zoom);
          canvas.selection = false;
          canvas.forEachObject((obj) => {
            obj.selectable = false;
            obj.hoverCursor = 'default';
          });
        });
      }

      const existing = data.filter((item) => item.status !== '已處理');
      setExistingItems(existing);
    }

    fetchData();
  }, [uid]);

  useEffect(() => {
    if (isDeclutteredMode) countItems();
  }, [period, isDeclutteredMode]);

  function countItems() {
    if (!itemRef.current) return;

    const periodStart = new Date(`${period.start}T00:00:00.000Z`).getTime();
    const periodEnd = new Date(`${period.end}T23:59:59.999Z`).getTime();

    const declutteredItems = itemRef.current.filter(
      (item) => item.status === '已處理'
    );

    dispatch({
      type: 'FILTER_PERIOD',
      payload: { data: declutteredItems, periodStart, periodEnd },
    });
  }

  function handleLevel() {
    const disposedItems: number | undefined = itemRef.current?.filter(
      (item) => item.status === '已處理'
    ).length;

    if (disposedItems) {
      if (disposedItems >= 100) {
        return 'Master';
      } else if (disposedItems < 100 && disposedItems >= 50) {
        return 'Veteran';
      } else if (disposedItems < 50 && disposedItems >= 30) {
        return 'Seasoned';
      }
    }
    return 'Rookie';
  }

  function getLastWeek() {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
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
    const lastYearStartDate = new Date(today.getFullYear() - 1, 0, 1);
    const lastYearEndDate = new Date(today.getFullYear() - 1, 11, 31);
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

  async function handleModifyImage(e: React.ChangeEvent<HTMLInputElement>) {
    const image = e.target.files && e.target.files[0];

    if (!image) return;

    const storageRef = ref(storage, `/${uid}/userImages/${image.name}`);
    const snapshot = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(snapshot.ref);

    await updateUser(url);

    setUser({ ...user, image: url });
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
          <UserImageWrapper>
            <UserImage src={user.image as string} />
            <input
              id="uploadImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleModifyImage(e)}
              style={{ display: 'none' }}
            />
            <label htmlFor="uploadImage">
              <ModifyImage>
                <SlCloudUpload className="upload" />
              </ModifyImage>
            </label>
          </UserImageWrapper>

          <InfoWrapper>
            <UserName>{user.name}</UserName>
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
        <GameEntry canShow={items.length >= 10}>
          <LinkToGame
            onClick={() => items.length >= 10 && navigate('/sparkJoy')}
          >
            每日小遊戲
          </LinkToGame>
          <TfiArrowRight className="arrow" />
        </GameEntry>

        <VisionBoardWrapper>
          <VisionBoard>
            <canvas id="canvas" />
            {isFirst && (
              <VisionBoardOverlay>
                <Button
                  buttonType="normal"
                  onClick={() => navigate('/compose')}
                >
                  立即開始編輯夢想板
                </Button>
              </VisionBoardOverlay>
            )}
          </VisionBoard>
          <EditButton canShow={!isFirst} onClick={() => navigate(`/compose`)}>
            <LinkToEdit>編輯夢想板</LinkToEdit>
            <TfiArrowRight className="arrow" />
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
              <RxCross1 className="clear" />
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

        <ReportWrapper>
          <Report items={isDeclutteredMode ? items : existingItems} />

          <QtyWrapper>
            <Qty>{isDeclutteredMode ? items.length : existingItems.length}</Qty>
            <QtyTitle>
              {items.length <= 1 || existingItems.length <= 1
                ? 'ITEM'
                : 'ITEMS'}
            </QtyTitle>
          </QtyWrapper>
        </ReportWrapper>
      </Container>
      <Background />
    </>
  );
}
