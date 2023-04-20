import styled from 'styled-components';

const LoginBtn = styled.button`
  width: 90px;
  height: 35px;
  font-size: 14px;
  border: 1px solid ${({ color }) => color};
  color: ${({ color }) => color};

  &:hover {
    cursor: pointer;
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
