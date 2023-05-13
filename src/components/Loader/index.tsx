import styled, { keyframes } from 'styled-components';

const pass = keyframes`
0% {
  opacity: 1;
}
50% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

const pass1 = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const LoaderContainer = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #8d9ca4;
  color: #fff;
`;

const Text = styled.span`
  opacity: 0;
  font-size: 2rem;
  letter-spacing: 0.5rem;
  animation: ${pass} 2s ease-in-out infinite;
`;

const Dot1 = styled(Text)`
  animation: ${pass1} 2s ease-in-out infinite;
  animation-delay: 1.6s;
`;

const Dot2 = styled(Text)`
  animation: ${pass1} 2s ease-in-out infinite;
  animation-delay: 2s;
`;

const L = styled(Text)`
  animation-delay: 0.2s;
`;

const O = styled(Text)`
  animation-delay: 0.4s;
`;

const A = styled(Text)`
  animation-delay: 0.6s;
`;

const D = styled(Text)`
  animation-delay: 0.8s;
`;

const I = styled(Text)`
  animation-delay: 1s;
`;

const N = styled(Text)`
  animation-delay: 1.2s;
`;

const G = styled(Text)`
  animation-delay: 1.4s;
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <L>L</L>
      <O>o</O>
      <A>a</A>
      <D>d</D>
      <I>i</I>
      <N>n</N>
      <G>g</G>
      <Dot1>.</Dot1>
      <Dot2>.</Dot2>
    </LoaderContainer>
  );
};

export default Loader;
