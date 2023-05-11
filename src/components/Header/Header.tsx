import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Home from '../../components/Icon/Home';
import { AuthContext } from '../../context/authContext';
import Login from '../Button/Login';

const Container = styled.section`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  display: flex;
  width: 100vw;
  padding: 30px 60px 0;
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

const NavButton = styled(Link)<{ color: string; isActive: boolean }>`
  position: relative;
  height: 35px;
  font-size: 1rem;
  line-height: 35px;
  color: inherit;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }

  ${({ isActive, color }) =>
    isActive
      ? css`
          border-bottom: 1px solid ${color};
        `
      : css`
          &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: 100%;
            left: 0;
            border-bottom: 1px solid ${color};
            opacity: 0;
            z-index: -1;
            transition: all 0.5s;
          }

          &:hover::before {
            left: 0;
            right: 0;
            opacity: 1;
          }
        `}
`;

const HomeWrapper = styled.div<{ color: string; isActive: boolean }>`
  position: relative;
  display: flex;
  height: 35px;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  ${({ isActive, color }) =>
    isActive
      ? css`
          border-bottom: 1px solid ${color};
        `
      : css`
          &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: 100%;
            left: 0;
            border-bottom: 1px solid ${color};
            opacity: 0;
            z-index: -1;
            transition: all 0.5s;
          }

          &:hover::before {
            left: 0;
            right: 0;
            opacity: 1;
          }
        `}
`;

const routes = [
  { pathName: '/upload', text: 'Upload' },
  { pathName: '/inventory', text: 'Inventory' },
  { pathName: '/achievement', text: 'Achievement' },
  { pathName: '/compose', text: 'Vision Board' },
];

export default function Header() {
  const { isLogin, logout } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const fillColor =
    location.pathname.includes('/upload') ||
    location.pathname.includes('/inventory')
      ? '#fff'
      : '#000';

  const isAtLogin =
    location.pathname === '/signup' || location.pathname === '/login';

  return (
    <Container color={fillColor}>
      <Logo to="/">JOGANDAN</Logo>
      {isLogin ? (
        <Nav>
          {routes.map((route) => (
            <NavButton
              to={route.pathName}
              color={fillColor}
              isActive={location.pathname.includes(route.pathName)}
            >
              {route.text}
            </NavButton>
          ))}
          <Login onClick={logout} color={fillColor}>
            Logout
          </Login>
          <HomeWrapper
            color={fillColor}
            isActive={location.pathname.includes('/profile')}
            onClick={() => navigate('/profile')}
          >
            <Home fill={fillColor} />
          </HomeWrapper>
        </Nav>
      ) : (
        !isAtLogin && (
          <Login onClick={() => navigate('/login')} color={fillColor}>
            Login
          </Login>
        )
      )}
    </Container>
  );
}
