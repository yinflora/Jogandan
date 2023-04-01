import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
  }
`;

function App() {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Outlet />
    </>
  );
}

export default App;
