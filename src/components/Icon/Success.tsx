import styled, { keyframes } from 'styled-components';

const drawCircle = keyframes`
  from {
    stroke-dashoffset: 1194;
  }
  to {
    stroke-dashoffset: 2388;
  }
`;

const drawCheck = keyframes`
  from {
    stroke-dashoffset: 350;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const Circle = styled.circle`
  stroke-dasharray: 1194;
  stroke-dashoffset: 1194;
  animation: ${drawCircle} 1s ease-in-out;
  animation-fill-mode: forwards;
`;

const Check = styled.polyline`
  stroke-dasharray: 350;
  stroke-dashoffset: 350;
  animation: ${drawCheck} 0.8s ease-out;
  animation-fill-mode: forwards;
  animation-delay: 0.95s;
`;

const Success = () => {
  return (
    <svg width="100" height="100">
      <Circle
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        cx="50"
        cy="50"
        r="47.5"
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <Check
        fill="none"
        stroke="#fff"
        points="22,54 43.25,75.5 76,42"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Success;
