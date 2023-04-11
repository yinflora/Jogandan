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

const Date = styled.input``;

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
      const hasPeriod = Object.values(period).every((time) => time !== '');
      if (hasPeriod) {
      }
    }
    countItems();
  }, [period]);

  // console.log(period, items);

  // if (isLogin) {
  return (
    <>
      {/* <Title>Profile</Title> */}
      <Wrapper>
        <Image src={user.photoURL} />
        <InformationWrapper>
          <Name>{user.displayName}</Name>
          <Level>Rookie</Level>
          {/* <div>
            <Label>Email</Label>
            <Information>{user.email}</Information>
          </div> */}
          {/* <button onClick={logout}>登出</button> */}
        </InformationWrapper>
      </Wrapper>
      <Label>Period:</Label>
      <Date
        type="date"
        value={period.start}
        onChange={(e) => setPeriod({ ...period, start: e.target.value })}
      />
      <span>~</span>
      <Date
        type="date"
        value={period.end}
        onChange={(e) => setPeriod({ ...period, end: e.target.value })}
      />
      {/* <VisionBoard></VisionBoard> */}
      <QtyWrapper>
        <Qty>{items?.filter((item) => item.status !== '已處理').length}</Qty>
        <QtyTitle>現有物品數量</QtyTitle>
      </QtyWrapper>
      <QtyWrapper>
        <Qty>{items?.filter((item) => item.status === '已處理').length}</Qty>
        <QtyTitle>減少數量</QtyTitle>
      </QtyWrapper>
      <QtyWrapper>
        <Qty>350</Qty>
        <QtyTitle>增加數量</QtyTitle>
      </QtyWrapper>
    </>
  );
  // }
  // return <Navigate to="/login" />;
}
