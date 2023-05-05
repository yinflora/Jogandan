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

  padding: ${({ isEdit }) => (isEdit ? '40px 80px 0' : '0 80px')};

  /* padding: ${({ isEdit }) => (isEdit ? '100px 80px 60px' : '60px 80px')}; */
  /* padding: ${({ isEdit }) => (isEdit ? '100px 80px 60px' : '60px 80px')}; */
  /* gap: 60px; */
  justify-content: center;
  align-items: center;
  background-color: ${({ isEdit }) =>
    isEdit ? 'rgba(141, 156, 164, 0.9)' : 'rgb(255, 255, 255, 0.9)'};
  cursor: default;

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

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  /* padding: 0 80px; */

  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const ImageWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: end;
`;

const SlideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

const SubImageWrapper = styled.div`
  display: flex;
  width: 110px;
  height: 400px;
  flex-direction: column;
  overflow-y: scroll;
  background-color: rgba(0, 0, 0, 0.1);

  &:hover {
    cursor: pointer;
  }

  /* &::-webkit-scrollbar {
    display: none;
  } */
`;

const SubImage = styled.img`
  width: 88px;
  height: 88px;
  margin: 0 auto 10px;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
  /* flex-shrink: 0 0 25%; */

  &:first-of-type {
    margin-top: 10px;
  }
`;

const MainImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;

const MainImage = styled.img`
  width: 400px;
  height: 400px;
  object-fit: cover;
  object-position: center;
`;

const BtnWrapper = styled.div`
  display: flex;
  height: 40px;
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

const InfoWrapper = styled.div`
  display: flex;
  height: 490px;
  flex: 1;
  padding: 40px 0;
  flex-direction: column;
  color: #000;
  letter-spacing: 0.1rem;
`;

const TopInfo = styled.div`
  display: flex;
  height: 50%;
  flex-direction: column;
  border-bottom: 1px solid #000;
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

const Category = styled.span`
  font-size: 1rem;
`;

const Name = styled.p`
  margin-bottom: 20px;
  overflow: auto;
  white-space: break-spaces;
  font-size: 2rem;
  font-weight: 600;
`;

const Status = styled.p`
  margin-top: auto;
  margin-bottom: 20px;
  font-size: 1.25rem;
`;

const BottomInfo = styled.div`
  display: flex;
  height: 50%;
  flex-direction: column;
`;

const Description = styled.div`
  margin: 20px 0;
  overflow: scroll;
  white-space: pre-wrap;
  font-size: 1rem;
  line-height: 1.25rem;
`;

const CreatedTime = styled.p`
  margin-top: auto;
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
            <ContentWrapper>
              <EditItem
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                setSelectedItem={setSelectedItem}
                selectedItem={null}
              />
            </ContentWrapper>
          ) : (
            <>
              <RxCross1
                className="clear"
                onClick={() => navigate('/inventory')}
              />
              <ContentWrapper>
                <ImageWrapper>
                  <SlideWrapper>
                    <ChangeSlideBtn>
                      <Chevron
                        rotateDeg={0}
                        color="#000"
                        onClick={() => {
                          setActiveItemIndex((prevIndex) =>
                            prevIndex > 0
                              ? prevIndex - 1
                              : selectedItem.images.filter(
                                  (item) => item !== ''
                                ).length - 1
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
                                  const hasUrlImages =
                                    selectedItem.images.filter(
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
                  </SlideWrapper>

                  <MainImageWrapper>
                    <MainImage src={selectedItem.images[activeItemIndex]} />
                    <BtnWrapper>
                      <SlideCount>
                        <NowIndex>{activeItemIndex + 1}</NowIndex>
                        <TotalIndex>/8</TotalIndex>
                      </SlideCount>
                    </BtnWrapper>
                  </MainImageWrapper>
                </ImageWrapper>

                <InfoWrapper>
                  <TopInfo>
                    <FirstRow>
                      <Category>{selectedItem.category}</Category>
                      {selectedItem.status !== '已處理' && (
                        <Edit onClick={() => setIsEdit(true)}>Edit</Edit>
                      )}
                    </FirstRow>
                    <Name>{selectedItem.name}</Name>
                    <Status>{selectedItem.status}</Status>
                  </TopInfo>

                  <BottomInfo>
                    <Description>{selectedItem.description}</Description>
                    <CreatedTime>
                      {formatTime(selectedItem.created!.seconds)}
                    </CreatedTime>
                  </BottomInfo>
                </InfoWrapper>
              </ContentWrapper>
            </>
          )}
        </Container>
      </StyledContainer>
    );
  }
  return null;
}
