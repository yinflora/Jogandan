import styled, { keyframes } from 'styled-components';

const happy = keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  10% {
    transform: translate(10px, 10px);
  }
  20% {
    transform: translate(10px, 5px);
  }
  30% {
    transform: translate(0px, 0px);
  }
  60% {
    transform: translate(-20px, -10px);
  }
  70% {
    transform: translate(-10px, -15px);
  }
  80% {
    transform: translate(-10px, -15px);
  }
  90% {
    transform: translate(0px, 0px);
  }
`;

const blink = keyframes`
  0% {
    transform: scale(1, 1);
  }
  10% {
    transform: scale(1, 1);
  }
  12% {
    transform: scale(1, .1);
  }
  14% {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1, 1);
  }
  32% {
    transform: scale(1, .1);
  }
  34% {
    transform: scale(1, 1);
  }
  60% {
    transform: scale(1, 1);
  }
  62% {
    transform: scale(1, .1);
  }
  64% {
    transform: scale(1, 1);
  }
`;

const Head = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border: 4px solid #8d9ca4;
  border-radius: 50%;
`;

const Face = styled.div`
  animation: ${happy} 8s infinite;
`;

const Eye = styled.div`
  position: absolute;
  top: calc(55px * 0.75);
  width: calc(25px * 0.75);
  height: calc(25px * 0.75);
  background-color: #8d9ca4;
  border-radius: 50%;
  animation: ${blink} 5s infinite;
  animation-delay: 3.4s;
`;

const LeftEye = styled(Eye)`
  left: calc(45px * 0.75);
`;

const RightEye = styled(Eye)`
  right: calc(45px * 0.75);
`;

const Mouth = styled.div`
  position: absolute;
  top: 65px;
  left: 45px;
  width: 50px;
  height: 25px;
  border: 4px solid #8d9ca4;
  border-radius: 0 0 50px 50px;
`;

export default function Happy() {
  return (
    <Head>
      <Face>
        <LeftEye />
        <RightEye />
        <Mouth />
      </Face>
    </Head>
  );
}
