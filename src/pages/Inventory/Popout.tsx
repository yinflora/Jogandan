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
  padding: 10vh 10vw;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
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
  background-color: rgb(255, 255, 255, 0.7);
`;

const ImageWrapper = styled.div`
  display: flex;
  /* width: 60%; */
`;

const MainImage = styled.img`
  /* width: 75%; */
  /* height: 100%; */
  width: 480px;
  height: 480px;
  padding: 10px;
  object-fit: cover;
  object-position: center;
  /* aspect-ratio: 1/1; */
`;

const SubImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  flex-wrap: nowrap;
`;

const SubImage = styled.img`
  /* height: calc(100% / 4); */
  /* width: 25%; */
  width: 120px;
  height: 120px;
  padding: 10px;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  flex-shrink: 0;
`;

const InfoWrapper = styled.div`
  display: flex;
  width: 40%;
  flex-direction: column;
  /* justify-content: space-between; */
  color: #000;
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Category = styled.span``;

const Edit = styled.button`
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }
`;

const Name = styled.p`
  margin-top: 30px;
  font-size: 2rem;
  font-weight: 600;
`;

const Status = styled.p`
  margin-top: 130px;
  padding-bottom: 20px;
  font-size: 1.25rem;
  border-bottom: 1px solid #000;
`;

const Description = styled.div`
  padding: 20px 0;
  overflow-y: scroll;
  white-space: pre-wrap;
`;

const CreatedTime = styled.p`
  margin-top: auto;
  font-size: 14px;
  text-align: end;
`;

// const Row = styled.div`
//   padding: 20px 0;
//   border-bottom: 1px solid black;
// `;

// const Title = styled.span`
//   display: inline-block;
//   width: 100px;
// `;

// const Content = styled.span``;

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
        prev === hasUrlImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);
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

  if (selectedItem) {
    return (
      <Overlay>
        <Cancel to="/inventory">X</Cancel>

        {isEdit ? (
          <EditItem isEdit={isEdit} setIsEdit={setIsEdit} />
        ) : (
          <Container>
            <ImageWrapper>
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
              <MainImage src={selectedItem.images[activeItemIndex]} />
            </ImageWrapper>

            <InfoWrapper>
              <FirstRow>
                <Category>{selectedItem.category}</Category>
                {selectedItem.status !== '已處理' && (
                  <Edit onClick={() => setIsEdit(true)}>• • •</Edit>
                )}
              </FirstRow>
              <Name>{selectedItem.name}</Name>
              <Status>{selectedItem.status}</Status>
              <Description>{selectedItem.description}</Description>
              <CreatedTime>
                Created：
                {formatTime(selectedItem.created.seconds)}
              </CreatedTime>
            </InfoWrapper>
          </Container>
        )}
      </Overlay>
    );
  }
  return null;
}
