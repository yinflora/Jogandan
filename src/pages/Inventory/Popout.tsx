import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

import EditItem from '../Upload/Upload';
import { useEffect, useState, useRef } from 'react';

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
  margin-left: auto;
  color: #f1f2ed;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 40px 60px;
  gap: 60px;
  background-color: #f1f2ed;
`;

const ImageWrapper = styled.div`
  width: 40%;
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
  overflow-x: scroll;
  flex-wrap: nowrap;
`;

const SubImage = styled.img`
  width: calc(100% / 3);
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
  color: #acaea9;
`;

const Category = styled.span``;

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
`;

const Content = styled.span``;

const Description = styled.div`
  padding: 20px 0;
  overflow-y: scroll;
  white-space: pre-wrap;
`;

const Edit = styled.button``;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

type Item = {
  id: string;
  name: string;
  status: string;
  category: string;
  created: Timestamp;
  processedDate: string;
  description: string;
  images: string[];
};

type PopoutProp = {
  selectedItem: Item | null;
};

export default function Popout({ selectedItem }: PopoutProp) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedItem) return;

    intervalRef.current = window.setInterval(() => {
      const hasUrlImages = selectedItem.images.filter(
        (image: string) => image !== ''
      );
      setActiveItemIndex((prev) =>
        // prev === selectedItem[0].images.length - 1 ? 0 : prev + 1
        prev === hasUrlImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);
  }, [selectedItem]);

  function formatTime(time: number) {
    const date = new Date(time * 1000);
    const options: object = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString('zh-TW', options);
  }

  // if (Array.isArray(selectedItem) && selectedItem.length > 0) {
  //   const firstItem = selectedItem[0];
  if (selectedItem) {
    return (
      <Overlay>
        <Cancel to="/inventory">X</Cancel>

        {isEdit ? (
          <EditItem isEdit={isEdit} setIsEdit={setIsEdit} />
        ) : (
          <Container>
            <ImageWrapper>
              {/* <MainImage src={firstItem.images[0]} /> */}
              <MainImage src={selectedItem.images[activeItemIndex]} />
              <SubImageWrapper>
                {selectedItem.images.map(
                  (image: string, index: number) =>
                    image !== '' && (
                      <SubImage
                        key={image}
                        src={image}
                        onClick={() => {
                          setActiveItemIndex(index);
                          intervalRef.current &&
                            window.clearInterval(intervalRef.current);
                          intervalRef.current = window.setInterval(() => {
                            const hasUrlImages = selectedItem.images.filter(
                              (image: string) => image !== ''
                            );
                            setActiveItemIndex((prev) =>
                              prev === hasUrlImages.length - 1 ? 0 : prev + 1
                            );
                          }, 5000);
                        }}
                      />
                    )
                )}
              </SubImageWrapper>
            </ImageWrapper>
            <InfoWrapper>
              <FirstRow>
                <Category>{selectedItem.category}</Category>
                {selectedItem.status !== '已處理' && (
                  <Edit onClick={() => setIsEdit(true)}>Edit</Edit>
                )}
              </FirstRow>
              <Name>{selectedItem.name}</Name>
              <Row>
                <Title>購買日期</Title>
                <Content>{formatTime(selectedItem.created.seconds)}</Content>
              </Row>
              <Row>
                <Title>目前狀態</Title>
                <Content>{selectedItem.status}</Content>
              </Row>
              <Description>{selectedItem.description}</Description>
            </InfoWrapper>
          </Container>
        )}
      </Overlay>
    );
  }
  return null;
}
