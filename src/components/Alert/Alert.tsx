import React, { useContext } from 'react';
import styled from 'styled-components';

import AuthContext from '../../context/authContext';
import Success from './Success';
import Sad from './Sad';
import Button from '../Button/Button';

import { RxCross1 } from 'react-icons/rx';

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 900;
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
  position: relative;
  display: flex;
  z-index: 999;
  width: 600px;
  height: 400px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: rgba(141, 156, 164, 0.9);

  & > .close {
    position: absolute;
    top: -30px;
    right: 0;
    width: 20px;
    height: 20px;
    color: #fff;

    &:hover {
      cursor: pointer;
    }
  }
`;

const SuccessWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Message = styled.p`
  margin-bottom: 20px;
  text-align: center;
  font-size: 2rem;
  letter-spacing: 0.1rem;
  color: #fff;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

type ButtonConfig = {
  width?: string;
  buttonType: 'dark' | 'normal' | 'light';
  value: string;
  action: () => void | {};
};

type AlertProps = {
  type: string;
  title: string;
  // action?: () => void | {};
  buttonConfig: ButtonConfig[];
};

export default function Alert({ type, title, buttonConfig }: AlertProps) {
  const { isPopout, setIsPopout } = useContext(AuthContext);

  return (
    <StyledContainer>
      <Overlay />
      <AlertWrapper>
        <RxCross1
          className="close"
          onClick={() => {
            setIsPopout(!isPopout);
          }}
        />
        <SuccessWrapper>
          {type === 'success' ? <Success /> : <Sad />}
        </SuccessWrapper>
        <Message>{title}</Message>
        {/* <Button
          buttonType="dark"
          onClick={() => {
            action();
            setIsPopout(!isPopout);
          }}
        >
          確認結果
        </Button> */}
        <ButtonWrapper>
          {buttonConfig.map((config, index) => (
            <Button
              key={index}
              width={config.width}
              buttonType={config.buttonType}
              onClick={() => {
                config.action();
                setIsPopout(!isPopout);
              }}
            >
              {config.value}
            </Button>
          ))}
        </ButtonWrapper>
      </AlertWrapper>
    </StyledContainer>
  );
}
