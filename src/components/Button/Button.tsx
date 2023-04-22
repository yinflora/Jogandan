import styled, { css } from 'styled-components';

const StyledButton = styled.button<ButtonProps>`
  min-width: 200px;
  min-height: 50px;
  width: ${({ width }) => width};

  ${({ buttonType }) => {
    if (buttonType === 'dark') {
      return css`
        background-color: rgb(0, 0, 0, 0.6);
        border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        color: #fff;
      `;
    } else if (buttonType === 'normal') {
      return css`
        background-color: #8d9ca4;
        border-bottom: 1px solid #fff;
        color: #fff;
      `;
    } else if (buttonType === 'light') {
      return css`
        background-color: rgba(255, 255, 255, 0.5);
        border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        color: #000;
      `;
    }
    return null;
  }}

  &:hover {
    cursor: pointer;
  }
`;

type ButtonProps = {
  width?: string;
  buttonType: 'dark' | 'normal' | 'light';
  children: string;
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  width,
  buttonType,
  onClick,
  children,
  disabled,
}: ButtonProps) {
  return (
    <StyledButton
      width={width}
      buttonType={buttonType}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
}
