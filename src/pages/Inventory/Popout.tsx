import { useContext, useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import SingleForm from '../../components/SingleForm';
import UserInfoContext from '../../context/UserInfoContext';
import { Item } from '../../types/types';
import { getItems } from '../../utils/firebase';
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

const Popout = ({ selectedItem }: PopoutProp) => {
  const { user, setItems } = useContext(UserInfoContext);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit || !user) return;

    const getUserItems = async () => {
      const userItems = (await getItems()) as Item[];
      setItems(userItems);
    };

    getUserItems();
  }, [user, isEdit]);

  if (selectedItem) {
    return (
      <StyledContainer>
        <Overlay onClick={() => navigate('/inventory')} />

        <Container $isEdit={isEdit}>
          <RxCross1 className="close" onClick={() => navigate('/inventory')} />
          {isEdit ? (
            <SingleForm setIsEdit={setIsEdit} />
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
