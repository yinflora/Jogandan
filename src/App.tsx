import { Outlet, useLocation } from 'react-router-dom';
import { Reset } from 'styled-reset';
import { createGlobalStyle } from 'styled-components';
import { AuthContextProvider } from './context/authContext';
import Header from './components/Header/Header';
import BackButton from './components/Button/BackButton';

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
    /* padding-top: 150px; */
    position: relative;
    overflow: scroll;
  }
`;

function App() {
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
      <AuthContextProvider>
        <Header />
        <Outlet />
        <BackButton />
      </AuthContextProvider>
    </>
  );
}

export default App;
