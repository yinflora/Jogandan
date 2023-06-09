import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Chevron from '../Icon/Chevron';

const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

const StyledButton = styled.button<{ $isVisible: boolean }>`
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(223, 223, 223, 0.5);
  animation: ${bounce} 1s infinite;
  cursor: pointer;
`;

const BackButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  function toggleVisibility() {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <StyledButton onClick={scrollToTop} $isVisible={isVisible}>
      <Chevron rotateDeg={0} color="#a2a2a2" />
    </StyledButton>
  );
};

export default BackButton;
