import { fabric } from 'fabric';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { SlCloudUpload } from 'react-icons/sl';
import { TfiArrowRight } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import Button from '../../components/Button/Button';
import Level from '../../components/Level';
import Report from '../../components/Report';
import { UserInfoContext } from '../../context/UserInfoContext';
import { ItemType, UserType } from '../../types/types';
import * as firebase from '../../utils/firebase';
import {
  getLastMonth,
  getLastYear,
  getThisMonth,
  getThisWeek,
  getThisYear,
} from '../../utils/timeHelper';

type Period = {
  start: string;
  end: string;
};
type ReportStatus = '目前持有' | '已處理';
type FilterItem = {
  value: string;
  action: () => { startDate: string; endDate: string };
};

const STATUS: ReportStatus[] = ['目前持有', '已處理'];
const FILTER: FilterItem[] = [
  { value: '過去 7 天', action: getThisWeek },
  { value: '本月', action: getThisMonth },
  { value: '上個月', action: getLastMonth },
  { value: '今年', action: getThisYear },
  { value: '去年', action: getLastYear },
];
const GAME_MIN_NUMBER = 10;
const BOARD_WIDTH = 980;
const BOARD_HEIGHT = 748;
const BOARD_ORIGIN_WIDTH = 625;
const BOARD_ORIGIN_HEIGHT = 475;

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

const InvisibleInput = styled.input`
  display: none;
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

const GameEntry = styled.button<{ $isVisible: boolean }>`
  position: relative;
  display: flex;
  width: fit-content;
  margin: 20px 20px 0 auto;
  padding: 0;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: ${({ $isVisible }) => ($isVisible ? 'pointer' : 'default')};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};

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

const EditButton = styled.button<{ $isVisible: boolean }>`
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
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};

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

const ModeToggler = styled.div<{ isSelected: boolean }>`
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
  cursor: pointer;

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

  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: #fff;
      color: #8d9ca4;
    `}
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

const useReportItems = (items: ItemType[]) => {
  const [reportItems, setReportItems] = useState<ItemType[] | []>([]);
  const [period, setPeriod] = useState<Period>({ start: '', end: '' });
  const [status, setStatus] = useState<ReportStatus>('目前持有');

  useEffect(() => {
    if (!items) return;

    if (status === '已處理') {
      const declutteredItems = items.filter(
        (item: ItemType) => item.status === '已處理'
      );
      const periodStart = new Date(`${period.start}T00:00:00.000Z`).getTime();
      const periodEnd = new Date(`${period.end}T23:59:59.999Z`).getTime();

      if (isNaN(periodStart) || isNaN(periodEnd)) {
        setReportItems(declutteredItems);
      } else {
        const filteredItems = declutteredItems.filter((item: ItemType) => {
          const createdTime = new Date(
            item.created.seconds * 1000 + item.created.nanoseconds / 1000000
          ).getTime();
          return createdTime >= periodStart && createdTime <= periodEnd;
        });
        setReportItems(filteredItems);
      }
    } else {
      const existingItems = items.filter(
        (item: ItemType) => item.status !== '已處理'
      );
      setReportItems(existingItems);
    }
  }, [items, period, status]);

  return {
    reportItems,
    period,
    setPeriod,
    status,
    setStatus,
  };
};

const Profile = () => {
  const { user, setUser, items } = useContext(UserInfoContext);
  const { reportItems, period, setPeriod, status, setStatus } =
    useReportItems(items);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getCurrentUser() {
      const userData = (await firebase.getUser()) as UserType;
      setUser(userData);
    }
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const { data, isEdited } = user.visionBoard;

    if (!isEdited) setIsFirst(true);

    const canvas = new fabric.Canvas('canvas', {
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
    });

    canvas.loadFromJSON(data, () => {
      const scaleX = canvas.getWidth() / BOARD_ORIGIN_WIDTH;
      const scaleY = canvas.getHeight() / BOARD_ORIGIN_HEIGHT;
      const zoom = Math.max(scaleX, scaleY);
      canvas.setZoom(zoom);
      canvas.selection = false;
      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.hoverCursor = 'default';
      });
    });
  }, [user]);

  const handleModifyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];

    if (!image) return;

    const storageRef = ref(
      firebase.storage,
      `/${user.uid}/userImages/${image.name}`
    );
    const snapshot = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(snapshot.ref);

    await firebase.updateUser(url);

    setUser({ ...user, image: url });
  };

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
            <UserImage src={user.image} />
            <InvisibleInput
              id="uploadImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleModifyImage(e)}
            />
            <label htmlFor="uploadImage">
              <ModifyImage>
                <SlCloudUpload className="upload" />
              </ModifyImage>
            </label>
          </UserImageWrapper>

          <InfoWrapper>
            <UserName>{user.name}</UserName>
            <UserGrade>{user.level}</UserGrade>
          </InfoWrapper>
        </UserInfo>

        <Level
          percent={
            items.filter((item: ItemType) => item.status === '已處理').length /
            100
          }
        />
        <GameEntry $isVisible={items.length >= GAME_MIN_NUMBER}>
          <LinkToGame
            onClick={() =>
              items.length >= GAME_MIN_NUMBER && navigate('/spark-joy')
            }
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
          <EditButton
            $isVisible={!isFirst}
            onClick={() => navigate(`/compose`)}
          >
            <LinkToEdit>編輯夢想板</LinkToEdit>
            <TfiArrowRight className="arrow" />
          </EditButton>
        </VisionBoardWrapper>

        <ModeFilter>
          <Label>FILTER</Label>
          {STATUS.map((item: ReportStatus) => (
            <ModeToggler
              key={item}
              isSelected={item === status}
              onClick={() => setStatus(item)}
            >
              {item}
            </ModeToggler>
          ))}
        </ModeFilter>

        <PeriodFilter disabled={status === '目前持有'}>
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
            {FILTER.map((filter) => (
              <FilterBtn
                key={filter.value}
                onClick={() => {
                  const { startDate, endDate } = filter.action();
                  setPeriod({ start: startDate, end: endDate });
                }}
              >
                {filter.value}
              </FilterBtn>
            ))}
          </FilterWrapper>
        </PeriodFilter>

        <ReportWrapper>
          <Report items={reportItems} />
          <QtyWrapper>
            <Qty>{reportItems.length}</Qty>
            <QtyTitle>{reportItems.length <= 1 ? 'ITEM' : 'ITEMS'}</QtyTitle>
          </QtyWrapper>
        </ReportWrapper>
      </Container>
      <Background />
    </>
  );
};

export default Profile;
