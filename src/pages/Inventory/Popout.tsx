import React from 'react';
import styled from 'styled-components/macro';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

import EditItem from '../Upload/Upload';
import { useEffect, useState, useRef } from 'react';

import Chevron from '../../components/Icon/Chevron';
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

const Container = styled.div<{ isEdit: boolean }>`
  position: relative;
  display: flex;
  z-index: 999;
  width: 1000px;
  height: 600px;

  padding: ${({ isEdit }) => (isEdit ? '100px 80px 60px' : '60px 80px')};
  gap: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${({ isEdit }) =>
    isEdit ? 'rgba(141, 156, 164, 0.9)' : 'rgb(255, 255, 255, 0.7)'};

  & > .clear {
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

const ImageWrapper = styled.div``;

const ChangeSlideBtn = styled.button`
  display: flex;
  width: 88px;
  height: 40px;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SlideCount = styled.div`
  color: #fff;
`;

const NowIndex = styled.span`
  font-size: 1.5rem;
  letter-spacing: 0.4rem;
  color: #000;
`;

const TotalIndex = styled.span`
  letter-spacing: 0.4rem;
  color: #000;
`;

const ImageArea = styled.div`
  display: flex;
  height: 400px;
`;

const MainImage = styled.img`
  height: 100%;
  padding: 5px;
  aspect-ratio: 1/1;
  object-fit: cover;
  object-position: center;
`;

const SubImageWrapper = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-y: scroll;

  &:before {
    content: '';
    position: absolute;
    top: 5px;
    left: 0;
    width: 100%;
    height: calc(100% - 10px);
    background-color: rgba(0, 0, 0, 0.1);
    z-index: -1;
  }

  &:hover {
    cursor: pointer;
  }
`;

const SubImage = styled.img`
  height: calc((100% - 40px) / 4);
  padding: 5px;
  aspect-ratio: 1/1;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0 0 25%;
`;

const InfoWrapper = styled.div`
  display: flex;
  height: 100%;
  flex: 1;
  padding: 40px 0;
  flex-direction: column;
  justify-content: space-between;
  color: #000;
  letter-spacing: 0.1rem;
`;

const FirstRow = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
`;

const Edit = styled.button`
  position: relative;
  padding: 0 0 5px 0;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  color: #000;

  &:hover {
    cursor: pointer;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;
    left: 0;
    border-bottom: 1px solid #000;
    opacity: 0;
    transition: all 0.5s;
  }

  &:hover::before {
    left: 0;
    right: 0;
    opacity: 1;
  }
`;

const Category = styled.span``;

const Name = styled.p`
  font-size: 2rem;
  font-weight: 600;
`;

const Status = styled.p`
  margin-top: auto;
  margin-bottom: 20px;
  font-size: 1.25rem;
`;

const DescriptionWrapper = styled.div`
  max-height: 50%;
  padding: 20px 0;
  border-top: 1px solid #000;
`;

const Description = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  white-space: pre-wrap;
`;

const CreatedTime = styled.p`
  justify-self: end;
  font-size: 14px;
  text-align: end;
  color: #959595;
`;

type Item = {
  id?: string;
  name: string;
  status: string;
  category: string;
  created?: Timestamp;
  processedDate?: string;
  description: string;
  images: string[];
};

type PopoutProp = {
  selectedItem: Item | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
};

export default function Popout({ selectedItem, setSelectedItem }: PopoutProp) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);

  const navigate = useNavigate();

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

    return () => {
      intervalRef.current && window.clearInterval(intervalRef.current);
    };
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
      <StyledContainer>
        <Overlay onClick={() => navigate('/inventory')} />

        <Container isEdit={isEdit}>
          <RxCross1 className="clear" onClick={() => navigate('/inventory')} />
          {isEdit ? (
            <EditItem
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              setSelectedItem={setSelectedItem}
              selectedItem={null}
            />
          ) : (
            <>
              <RxCross1
                className="clear"
                onClick={() => navigate('/inventory')}
              />

              <ImageWrapper>
                <ChangeSlideBtn>
                  <Chevron
                    rotateDeg={0}
                    color="#000"
                    onClick={() => {
                      setActiveItemIndex((prevIndex) =>
                        prevIndex > 0
                          ? prevIndex - 1
                          : selectedItem.images.filter((item) => item !== '')
                              .length - 1
                      );
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
                </ChangeSlideBtn>
                <ImageArea>
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
                                  prev === hasUrlImages.length - 1
                                    ? 0
                                    : prev + 1
                                );
                              }, 5000);
                            }}
                          />
                        )
                    )}
                  </SubImageWrapper>
                  <MainImage src={selectedItem.images[activeItemIndex]} />
                </ImageArea>
                <BtnWrapper>
                  <ChangeSlideBtn>
                    <Chevron
                      rotateDeg={180}
                      color="#000"
                      onClick={() => {
                        setActiveItemIndex((prevIndex) =>
                          prevIndex <
                          selectedItem.images.filter((item) => item !== '')
                            .length -
                            1
                            ? prevIndex + 1
                            : 0
                        );
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
                  </ChangeSlideBtn>

                  <SlideCount>
                    <NowIndex>
                      {
                        selectedItem.images.filter((image) => image !== '')
                          .length
                      }
                    </NowIndex>
                    <TotalIndex>/8</TotalIndex>
                  </SlideCount>
                </BtnWrapper>
              </ImageWrapper>

              <InfoWrapper>
                <FirstRow>
                  <Category>{selectedItem.category}</Category>
                  {selectedItem.status !== '已處理' && (
                    <Edit onClick={() => setIsEdit(true)}>Edit</Edit>
                  )}
                </FirstRow>
                <Name>{selectedItem.name}</Name>
                <Status>{selectedItem.status}</Status>
                <DescriptionWrapper>
                  <Description>{selectedItem.description}</Description>
                </DescriptionWrapper>
                <CreatedTime>
                  {formatTime(selectedItem.created!.seconds)}
                </CreatedTime>
              </InfoWrapper>
            </>
          )}
        </Container>
      </StyledContainer>
    );
  }
  return null;
}
