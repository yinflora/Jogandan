import styled from 'styled-components';

const LoginBtn = styled.button`
  position: relative;
  width: 90px;
  height: 35px;
  font-size: 14px;
  border: 1px solid ${({ color }) => color};
  color: ${({ color }) => color};

  &:hover {
    cursor: pointer;
    color: ${({ color }) => (color === '#fff' ? '#000' : '#fff')};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;
    left: 0;
    background-color: ${({ color }) => color};
    opacity: 0;
    z-index: -1;
    transition: all 0.5s;
  }

  &:hover::before {
    left: 0;
    right: 0;
    opacity: 1;
  }
`;

type LoginProps = {
  color: string;
  children: string;
  onClick: () => void;
};

export default function Login({ color, children, onClick }: LoginProps) {
  return (
    <LoginBtn onClick={onClick} color={color}>
      {children}
    </LoginBtn>
  );
}
