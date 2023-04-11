import styled from 'styled-components';
import { Link } from 'react-router-dom';

import EditItem from '../Upload/Upload';
import { useState } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  width: 100vw;
  height: 100vh;
  padding: 10vh 15vw;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  gap: 10px;
`;

const Cancel = styled(Link)`
  /* width: 20px;
  height: 10px; */
  /* transform: scale(2, 0.5); */
  margin-left: auto;
  /* width: 100%; */
  /* text-align: end; */
  color: #f1f2ed;
`;

const Container = styled.div`
  /* width: 70%;
  height: 80%; */
  display: flex;
  width: 100%;
  height: 100%;
  padding: 40px 60px;
  gap: 60px;
  background-color: #f1f2ed;
`;

const ImageWrapper = styled.div`
  width: 40%;
  /* display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 80% 20%; */
  /* background-color: gray; */
`;

const MainImage = styled.img`
  width: 100%;
  padding: 5px;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
`;

const SubImageWrapper = styled.div`
  display: flex;
  /* justify-content: space-between; */
  overflow-x: scroll;
  flex-wrap: nowrap;
  /* gap: 10px; */
`;

const SubImage = styled.img`
  width: calc(100% / 3);
  /* width: 25%; */
  padding: 5px;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  flex-shrink: 0;
`;

const InfoWrapper = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  justify-content: space-between;
  /* background-color: gray; */
  color: #acaea9;
`;

const Category = styled.span`
  /* color: #acaea9; */
  /* margin-right: auto; */
`;

const Name = styled.p`
  font-size: 2rem;
  color: black;
`;

const Row = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid black;
`;

const Title = styled.span`
  display: inline-block;
  width: 100px;
  /* color: #acaea9; */
`;

const Content = styled.span`
  /* color: #acaea9; */
`;

const Description = styled.div`
  padding: 20px 0;
  overflow-y: scroll;
`;

const Edit = styled.button`
  /* margin-left: auto; */
  /* text-align: end; */
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

type PopoutProp = {
  setIsPopout: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: [] | null;
};

export default function Popout({ setIsPopout, selectedItem }: PopoutProp) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  function formatTime(time) {
    const date = new Date(time * 1000); // 轉換成毫秒
    const options = {
      // year: 'numeric',
      // month: 'long',
      // day: 'numeric',
      // hour: 'numeric',
      // minute: 'numeric',
      // second: 'numeric',
      // hour12: false, // 24小時制
      // timeZoneName: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString('zh-TW', options); // 繁體中文語系
  }

  if (selectedItem) {
    // if (isEdit) {
    //   return <EditItem />;
    // }
    return (
      <Overlay>
        {/* <Cancel onClick={() => setIsPopout(false)}>X</Cancel> */}
        <Cancel to="/inventory">X</Cancel>

        {isEdit ? (
          <EditItem isEdit={isEdit} />
        ) : (
          <Container>
            <ImageWrapper>
              <MainImage src={selectedItem[0].images[0]} />
              <SubImageWrapper>
                {selectedItem[0].images.map(
                  (image) =>
                    image !== '' && <SubImage key={image} src={image} />
                )}
              </SubImageWrapper>
            </ImageWrapper>
            <InfoWrapper>
              <FirstRow>
                <Category>{selectedItem[0].category}</Category>
                {selectedItem[0].status !== '已處理' && (
                  <Edit onClick={() => setIsEdit(true)}>Edit</Edit>
                )}
              </FirstRow>
              <Name>{selectedItem[0].name}</Name>
              <Row>
                <Title>購買日期</Title>
                <Content>{formatTime(selectedItem[0].created.seconds)}</Content>
              </Row>
              <Row>
                <Title>目前狀態</Title>
                <Content>{selectedItem[0].status}</Content>
              </Row>
              {/* <Row>
              <Title>數量</Title>
              <Content>1</Content>
            </Row> */}
              <Description>{selectedItem[0].description}</Description>
            </InfoWrapper>
          </Container>
        )}
      </Overlay>
    );
  }
}
