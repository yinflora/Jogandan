import styled from 'styled-components';
import Login from '../Login/Login';
import { Link } from 'react-router-dom';

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

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  color: black;
`;

const NavButton = styled(Link)`
  color: black;
`;

// const MenuBtn = styled.button`
//   display: flex;
//   width: 50px;
//   flex-direction: column;
//   gap: 5px;
// `;

// const Line = styled.span`
//   width: 100%;
//   height: 1px;
//   background-color: #acaea9;
// `;

export default function Header() {
  return (
    <Container>
      <Logo>JOGANDAN</Logo>
      <Nav>
        <NavButton to="/">Home</NavButton>
        <NavButton to="/profile">Profile</NavButton>
        <NavButton to="/inventory">Inventory</NavButton>
        <NavButton to="/achievement">Achievement</NavButton>
        <NavButton to="/upload">Upload</NavButton>
        <NavButton to="/compose">Vision Board</NavButton>
      </Nav>
      <Login />
      {/* <MenuBtn>
        <Line />
        <Line />
        <Line />
      </MenuBtn> */}
    </Container>
  );
}
