import { Outlet } from 'react-router-dom';
import { Reset } from 'styled-reset';
import { createGlobalStyle } from 'styled-components';
import { AuthContextProvider } from './context/authContext';

import Header from './components/Header/Header';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'TT Norms Pro', sans-serif;
  }

  button {
    border: 0;
    background-color: transparent;
  }

  a {
    text-decoration: none;
  }

  #root {
    min-height: 100vh;
    padding-top: 150px;
    position: relative;
  }
`;

function App() {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <AuthContextProvider>
        <Header />
        <Outlet />
      </AuthContextProvider>
    </>
  );
}

export default App;
