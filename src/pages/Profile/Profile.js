import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Navigate } from 'react-router-dom';

import styled from 'styled-components';

const Title = styled.h1`
  font-size: 4rem;
`;

const Wrapper = styled.div`
  display: flex;
`;

const Image = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 50%;
`;

const InformationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.span`
  width: 50px;
`;

const Information = styled.span`
  border: 1px solid #000;
`;

export default function Profile() {
  const { user, isLogin, logout } = useContext(AuthContext);

  if (isLogin) {
    return (
      <>
        <Title>Profile</Title>
        <Wrapper>
          <Image src={user.photoURL} />
          <InformationWrapper>
            <div>
              <Label>Name</Label>
              <Information>{user.displayName}</Information>
            </div>
            <div>
              <Label>Email</Label>
              <Information>{user.email}</Information>
            </div>
            <button onClick={logout}>登出</button>
          </InformationWrapper>
        </Wrapper>
      </>
    );
  }
  return <Navigate to="/login" />;
}
