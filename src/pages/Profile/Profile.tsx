// import { useContext } from 'react';
// import { AuthContext } from '../../context/authContext';
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
  return (
    <>
      <Title>Profile</Title>
      <Wrapper>
        <Image />
        <InformationWrapper>
          <div>
            <Label>Name</Label>
            <Information>尹兆慈</Information>
          </div>
          <div>
            <Label>Email</Label>
            <Information>flora@gmail.com</Information>
          </div>
        </InformationWrapper>
      </Wrapper>
    </>
  );
}
