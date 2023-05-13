import React, { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import SingleForm from '../../components/SingleForm';
import { Item } from '../../types/types';
import { ItemInfo } from './ItemInfo';

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

const Container = styled.div<{ $isEdit: boolean }>`
  position: relative;
  display: flex;
  z-index: 999;
  width: 1000px;
  height: 600px;
  padding: ${({ $isEdit }) => ($isEdit ? '40px 80px 0' : '0 80px')};
  justify-content: center;
  align-items: center;
  background-color: ${({ $isEdit }) =>
    $isEdit ? 'rgba(141, 156, 164, 0.9)' : 'rgb(255, 255, 255, 0.9)'};
  cursor: default;

  & > .close {
    position: absolute;
    top: -30px;
    right: 0;
    width: 20px;
    height: 20px;
    color: #fff;
    cursor: pointer;
  }
`;

type PopoutProp = {
  selectedItem: Item | null;
};

const Popout: React.FC<PopoutProp> = ({ selectedItem }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  if (selectedItem) {
    return (
      <StyledContainer>
        <Overlay onClick={() => navigate('/inventory')} />

        <Container $isEdit={isEdit}>
          <RxCross1 className="close" onClick={() => navigate('/inventory')} />
          {isEdit ? (
            <SingleForm />
          ) : (
            <ItemInfo selectedItem={selectedItem} setIsEdit={setIsEdit} />
          )}
        </Container>
      </StyledContainer>
    );
  }
  return null;
};

export default Popout;
