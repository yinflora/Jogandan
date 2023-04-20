import { Link, useLocation } from 'react-router-dom';

import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

import styled from 'styled-components';

import Login from '../Login/Login';
import Home from '../../components/Icon/Home';

const Container = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100vw;
  height: 100px;
  padding: 0 60px;
  align-items: center;
  color: ${({ color }) => color};
`;

const Logo = styled(Link)`
  margin-right: auto;
  font-size: 1.5rem;
  letter-spacing: 0.2rem;
  color: inherit;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 50px;
`;

const NavButton = styled(Link)`
  font-size: 1rem;
  color: inherit;
  text-decoration: none;
`;

export default function Header() {
  const { isLogin, login, logout } = useContext(AuthContext);

  const location = useLocation();

  const fillColor =
    location.pathname.includes('/upload') ||
    location.pathname.includes('/inventory')
      ? '#fff'
      : '#000';

  return (
    <Container color={fillColor}>
      <Logo to="/">JOGANDAN</Logo>
      {isLogin ? (
        <Nav>
          <NavButton to="/inventory">Inventory</NavButton>
          <NavButton to="/upload">Upload</NavButton>
          <NavButton to="/achievement">Achievement</NavButton>
          <NavButton to="/compose">Vision Board</NavButton>
          <Login onClick={logout} color={fillColor}>
            Logout
          </Login>
          <Link to="/profile">
            <Home fill={fillColor} />
          </Link>
        </Nav>
      ) : (
        <Login onClick={login} color={fillColor}>
          Login
        </Login>
      )}
    </Container>
  );
}
