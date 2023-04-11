import styled from 'styled-components';
import Login from '../Login/Login';

const Container = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100vw;
  height: 100px;
  padding: 0 50px;
  align-items: center;
`;

const Logo = styled.span`
  margin-right: auto;
  font-size: 1.5rem;
`;

const MenuBtn = styled.button`
  display: flex;
  width: 50px;
  flex-direction: column;
  gap: 5px;
`;

const Line = styled.span`
  width: 100%;
  height: 1px;
  background-color: #acaea9;
`;

export default function Header() {
  return (
    <Container>
      <Logo>JOGANDAN</Logo>
      <Login />
      <MenuBtn>
        <Line />
        <Line />
        <Line />
      </MenuBtn>
    </Container>
  );
}
