import styled, { css } from 'styled-components';

const StyledButton = styled.button<ButtonProps>`
  position: relative;
  z-index: 0;
  min-width: 200px;
  min-height: 50px;
  width: ${({ width }) => width};
  font-size: 1rem;
  letter-spacing: 0.1rem;

  &:hover {
    cursor: pointer;
  }

  ${({ buttonType }) => {
    if (buttonType === 'dark') {
      return css`
        background-color: rgb(0, 0, 0, 0.6);
        border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        color: #fff;

        &:disabled {
          cursor: not-allowed;
          background-color: rgb(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(0, 0, 0, 0.5);
          color: #8d9ca4;
        }

        &::before {
          content: '';
          position: absolute;
          z-index: -1;
          top: 0;
          bottom: 0;
          right: 100%;
          left: 0;
          background-color: #000;
          opacity: 0;
          transition: all 0.5s;
        }

        &:hover:not(:disabled)::before {
          left: 0;
          right: 0;
          opacity: 1;
        }
      `;
    } else if (buttonType === 'normal') {
      return css`
        background-color: #8d9ca4;
        border-bottom: 1px solid #fff;
        color: #fff;

        &::before {
          content: '';
          position: absolute;
          z-index: -1;
          top: 0;
          bottom: 0;
          right: 100%;
          left: 0;
          border-bottom: 2px solid #fff;
          background-color: #646e74;
          opacity: 0;
          transition: all 0.5s;
        }

        &:hover::before {
          left: 0;
          right: 0;
          opacity: 1;
        }
      `;
    } else if (buttonType === 'light') {
      return css`
        background-color: rgba(255, 255, 255, 0.5);
        border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        color: #000;

        &:disabled {
          cursor: not-allowed;
          background-color: rgb(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(0, 0, 0, 0.5);
          color: #8d9ca4;
        }

        &::before {
          content: '';
          position: absolute;
          z-index: -1;
          top: 0;
          bottom: 0;
          right: 100%;
          left: 0;
          border-bottom: 2px solid #000;
          background-color: #fff;
          opacity: 0;
          transition: all 0.5s;
        }

        &:hover:not(:disabled)::before {
          left: 0;
          right: 0;
          opacity: 1;
        }
      `;
    }
    return null;
  }}
`;

type ButtonProps = {
  width?: string;
  buttonType: 'dark' | 'normal' | 'light';
  children: string;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick?: (param?: any) => void;
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
