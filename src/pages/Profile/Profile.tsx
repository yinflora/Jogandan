import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/authContext';
import { getItems } from '../../utils/firebase';
// import { Navigate } from 'react-router-dom';

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

const Level = styled.p`
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

export default function Profile() {
  const { user } = useContext(AuthContext);

  const [period, setPeriod] = useState<object>({ start: '', end: '' });
  const [items, setItems] = useState<[] | null>(null);
  const itemRef = useRef<[] | null>(null);

  useEffect(() => {
    async function fetchItems() {
      const itemList = await getItems();
      itemRef.current = itemList;
      setItems(itemList);
    }
    fetchItems();
  }, []);

  useEffect(() => {
    function countItems() {
      const hasPeriod: boolean = Object.values(period).every(
        (time) => time !== ''
      );
      if (hasPeriod) {
        // const periodStart = new Date(period.start).getTime();
        // const periodEnd = new Date(period.end).getTime();

        // // console.log(periodStart, periodEnd);
        // console.log(new Date(period.start), new Date(period.end));

        const filteredItems = itemRef.current.filter((item) => {
          const createdTime = new Date(
            item.created.seconds * 1000 + item.created.nanoseconds / 1000000
          ).getTime();
          const periodStart = new Date(
            period.start + 'T00:00:00.000Z'
          ).getTime();
          const periodEnd = new Date(period.end + 'T23:59:59.999Z').getTime();
          return createdTime >= periodStart && createdTime <= periodEnd;
        });
        console.log(filteredItems);
        setItems(filteredItems);
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
      // console.log('Master');
      return 'Master';
    } else if (processedItems < 100 && processedItems >= 50) {
      // console.log('Veteran');
      return 'Veteran';
    } else if (processedItems < 50 && processedItems >= 10) {
      // console.log('Seasoned');
      return 'Seasoned';
    }
    // console.log('Rookie');
    return 'Rookie';
  }

  return (
    <>
      {/* <Title>Profile</Title> */}
      <Wrapper>
        <Image src={user.photoURL} />
        <InformationWrapper>
          <Name>{user.displayName}</Name>
          {/* {items && handleLevel()} */}
          <Level>{items && handleLevel()}</Level>
          {/* <div>
            <Label>Email</Label>
            <Information>{user.email}</Information>
          </div> */}
          {/* <button onClick={logout}>登出</button> */}
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
        <Qty>
          {
            itemRef.current?.filter((item: any) => item.status !== '已處理')
              .length
          }
        </Qty>
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
    </>
  );
}
