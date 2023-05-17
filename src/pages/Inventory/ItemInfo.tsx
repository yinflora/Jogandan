import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Chevron from '../../components/Icon/Chevron';
import { ItemType } from '../../types/types';
import { formatTime } from '../../utils/timeHelper';

type ItemInfoPropsType = {
  selectedItem: ItemType;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
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

const ChangeSlideBtn = styled.button<{ $canClick: boolean }>`
  display: flex;
  width: 88px;
  height: 40px;
  justify-content: center;
  align-items: center;
  cursor: ${({ $canClick }) => ($canClick ? 'pointer' : 'default')};
`;

const SubImageWrapper = styled.div`
  display: flex;
  width: 110px;
  height: 400px;
  flex-direction: column;
  overflow-y: scroll;
  background-color: rgba(0, 0, 0, 0.1);
`;

const SubImage = styled.img<{ $canClick: boolean }>`
  width: 88px;
  height: 88px;
  margin: 0 auto 10px;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
  cursor: ${({ $canClick }) => ($canClick ? 'pointer' : 'default')};

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

export const ItemInfo = ({ selectedItem, setIsEdit }: ItemInfoPropsType) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const { id } = useParams();
  const { images, name, category, status, description, created } = selectedItem;
  const hasUrlImages = images.filter((image: string) => image !== '');

  const setCarousel = () => {
    intervalRef.current = window.setInterval(() => {
      setActiveItemIndex((prev) =>
        prev === hasUrlImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);
  };

  useEffect(() => {
    if (!id || !selectedItem || hasUrlImages.length === 1) return;
    setCarousel();
  }, [id, selectedItem]);

  return (
    <ContentWrapper>
      <ImageWrapper>
        <SlideWrapper>
          <ChangeSlideBtn $canClick={hasUrlImages.length > 1}>
            <Chevron
              rotateDeg={0}
              color="#000"
              onClick={() => {
                setActiveItemIndex((prevIndex) =>
                  prevIndex > 0
                    ? prevIndex - 1
                    : images.filter((item) => item !== '').length - 1
                );
                intervalRef.current &&
                  window.clearInterval(intervalRef.current);
                setCarousel();
              }}
            />
          </ChangeSlideBtn>
          <SubImageWrapper>
            {hasUrlImages.map((image: string, index: number) => (
              <SubImage
                key={image}
                src={image}
                onClick={() => {
                  setActiveItemIndex(index);
                  intervalRef.current &&
                    window.clearInterval(intervalRef.current);
                  setCarousel();
                }}
                $canClick={hasUrlImages.length > 1}
              />
            ))}
          </SubImageWrapper>
          <ChangeSlideBtn $canClick={hasUrlImages.length > 1}>
            <Chevron
              rotateDeg={180}
              color="#000"
              onClick={() => {
                setActiveItemIndex((prevIndex) =>
                  prevIndex < images.filter((item) => item !== '').length - 1
                    ? prevIndex + 1
                    : 0
                );
                intervalRef.current &&
                  window.clearInterval(intervalRef.current);
                setCarousel();
              }}
            />
          </ChangeSlideBtn>
        </SlideWrapper>

        <MainImageWrapper>
          <MainImage src={hasUrlImages[activeItemIndex]} />
          <BtnWrapper>
            <SlideCount>
              <NowIndex>{activeItemIndex + 1}</NowIndex>
              <TotalIndex>/{hasUrlImages.length}</TotalIndex>
            </SlideCount>
          </BtnWrapper>
        </MainImageWrapper>
      </ImageWrapper>

      <InfoWrapper>
        <TopInfo>
          <FirstRow>
            <Category>{category}</Category>
            {status !== '已處理' && (
              <Edit onClick={() => setIsEdit(true)}>Edit</Edit>
            )}
          </FirstRow>
          <Name>{name}</Name>
          <Status>{status}</Status>
        </TopInfo>

        <BottomInfo>
          <Description>{description}</Description>
          <CreatedTime>{formatTime(created.seconds)}</CreatedTime>
        </BottomInfo>
      </InfoWrapper>
    </ContentWrapper>
  );
};
