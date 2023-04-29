import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AuthContext from '../../context/authContext';
import Success from './Success';
import Button from '../Button/Button';

import { RxCross1 } from 'react-icons/rx';

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
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
  z-index: 6;
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

type AlertProps = {
  url: string;
};

export default function Alert({ url }: AlertProps) {
  const { isPopout, setIsPopout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <StyledContainer>
      <Overlay />
      <AlertWrapper>
        <RxCross1 className="close" onClick={() => setIsPopout(!isPopout)} />
        <SuccessWrapper>
          <Success />
        </SuccessWrapper>
        <Message>儲存成功！</Message>
        <Button
          buttonType="dark"
          onClick={() => {
            navigate(url);
            setIsPopout(!isPopout);
          }}
        >
          確認結果
        </Button>
      </AlertWrapper>
    </StyledContainer>
  );
}
