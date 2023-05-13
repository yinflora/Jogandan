import styled, { keyframes } from 'styled-components';

const sad = keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  15% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(0px, -25px);
  }
  35% {
    transform: translate(0px, -25px);
  }
  45% {
    transform: translate(0px, 0px);
  }
  70% {
    transform: translate(0px, 0px);
  }
  80% {
    transform: translate(-15px, -25px);
  }
  90% {
    transform: translate(-15px, -25px);
  }
  100% {
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
  width: 100px;
  height: 100px;
  border: 4px solid #fff;
  border-radius: 50%;
`;

const Face = styled.div`
  animation: ${sad} 6s infinite;
`;

const Eye = styled.div`
  position: absolute;
  top: calc(105px / 2);
  width: calc(25px / 2);
  height: calc(25px / 2);
  background-color: #fff;
  border-radius: 50%;
  animation: ${blink} 5s infinite;
  animation-delay: 3.4s;
`;

const LeftEye = styled(Eye)`
  left: calc(45px / 2);
`;

const RightEye = styled(Eye)`
  right: calc(45px / 2);
`;

const Mouth = styled.div`
  position: absolute;
  top: calc(130px / 2);
  left: calc(43px / 2);
  width: 50px;
  height: 25px;
  border-style: solid;
  border-radius: 50%;
  border-width: 4px;
  border-color: #fff transparent transparent transparent;
`;

const Sad = () => {
  return (
    <Head>
      <Face>
        <LeftEye />
        <RightEye />
        <Mouth />
      </Face>
    </Head>
  );
};

export default Sad;
