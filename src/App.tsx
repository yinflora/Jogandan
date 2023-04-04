import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';
import { AuthContextProvider } from './context/authContext';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
  }

  #root {
    min-height: 100vh;
    padding: 140px 50px 115px;
    position: relative;
  }
`;

function App() {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <AuthContextProvider>
        <Outlet />
      </AuthContextProvider>
    </>
  );
}

export default App;
