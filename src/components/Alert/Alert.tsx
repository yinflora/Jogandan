import styled from 'styled-components';
import Success from './Success';

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const AlertWrapper = styled.div`
  z-index: 6;
  width: 600px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.7);
`;

export default function Alert() {
  return (
    <StyledContainer>
      <Overlay />
      <AlertWrapper>
        <Success />
      </AlertWrapper>
    </StyledContainer>
  );
}
