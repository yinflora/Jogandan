import { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';
import BackButton from './components/Button/BackButton';
import Header from './components/Header';
import Loader from './components/Loader';
import { LoadingContext } from './context/LoadingContext';
import { UserInfoContextProvider } from './context/UserInfoContext';

const GlobalStyle = createGlobalStyle<{ backgroundColor: string }>`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'TT Norms Pro', sans-serif;
    background-color: ${({ backgroundColor }) => backgroundColor};
  }

  button {
    border: 0;
    background-color: transparent;
  }

  a {
    text-decoration: none;
  }

  input, select{
    background-color: transparent;
    outline: none;
    border: none;
  }

  #root {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    overflow-y: scroll;
  }
`;

const App = () => {
  const { isLoading } = useContext(LoadingContext);
  const location = useLocation();

  const backgroundColor =
    location.pathname.includes('/upload') ||
    location.pathname.includes('/profile')
      ? '#8D9CA4'
      : '#fff';

  return (
    <>
      <Reset />
      <GlobalStyle backgroundColor={backgroundColor} />
      <UserInfoContextProvider>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Header />
            <Outlet />
            <BackButton />
          </>
        )}
      </UserInfoContextProvider>
    </>
  );
};

export default App;
