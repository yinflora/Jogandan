// import { useState, useEffect, useContext, useRef } from 'react';
// import { fabric } from 'fabric';
import styled from 'styled-components/macro';
import Button from '../../components/Button/Button';

import info from './info.png';
import text from './text.png';
import save from './save.png';
import undo from './undo.png';

const Container = styled.div`
  margin: 0 auto;
  /* padding: 0 250px 60px; */
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 500px;
  background-color: #f4f3ef;
`;

const PageTitle = styled.h1`
  margin-left: 250px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
  color: #000;
`;

const BoardContainer = styled.div`
  display: flex;
  width: 80%;
  height: calc(100vh - 198px);
  margin: 0 auto;
  padding-top: 30px;
  /* background-color: gray; */
  gap: 30px;
`;

const UploadContainer = styled.div`
  width: 30%;
  height: 100%;
  padding: 20px;
  background-color: rgba(141, 156, 164, 0.5);
`;

const RemindWrapper = styled.div`
  display: flex;
  height: 30px;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const InfoIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const Remind = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #fff;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 80px);
  background-color: #000;
  flex-wrap: wrap;
  overflow-y: scroll;
  gap: 10px;
`;

// const Image = styled.img`
//   height: 100px;
// `;

const VisionBoardContainer = styled.div`
  display: flex;
  width: 70%;
  height: 100%;
  padding: 20px;
  flex-direction: column;
  justify-content: space-between;
  background-color: #8d9ca4;
`;

const SettingWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

const ToolWrapper = styled.div`
  display: flex;
`;

const ToolBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ToolName = styled.label`
  letter-spacing: 0.1rem;
  color: #fff;
`;

const ColorSelector = styled.input`
  width: 20px;
  height: 20px;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 1px solid #fff;
  }

  &:hover {
    cursor: pointer;
  }
`;

const FontSizeRange = styled.input`
  -webkit-appearance: none;
  height: 5px;
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.2);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
  }
`;

const ActionWrapper = styled.div`
  display: flex;
  margin-left: auto;
  gap: 20px;
`;

const ActionIconL = styled.img`
  width: 30px;
  height: 30px;

  &:hover {
    cursor: pointer;
  }
`;

const ActionIconM = styled.img`
  width: 22px;
  height: 22px;

  &:hover {
    cursor: pointer;
  }
`;

const VisionBoard = styled.div`
  width: 625px;
  height: 475px;
  margin: 0 auto;
  background-color: #000;
`;

export default function Compose() {
  return (
    <Container>
      <PageTitle>VISION BOARD</PageTitle>
      <BoardContainer>
        <UploadContainer>
          <Button width="100%" buttonType="normal">
            選擇照片
          </Button>
          <RemindWrapper>
            <InfoIcon src={info} />
            <Remind>請拖拉照片至格子調整</Remind>
          </RemindWrapper>
          <ImageWrapper></ImageWrapper>
        </UploadContainer>
        <VisionBoardContainer>
          <SettingWrapper>
            <ToolWrapper>
              <ToolBar>
                <ToolName>Background</ToolName>
                <ColorSelector type="color" />
              </ToolBar>
            </ToolWrapper>
            <ToolWrapper>
              <ToolBar>
                <ToolName>Text</ToolName>
                <ColorSelector type="color" />
              </ToolBar>
            </ToolWrapper>
            <ToolWrapper>
              <ToolBar>
                <ToolName>Font-Size</ToolName>
                <FontSizeRange type="range" />
              </ToolBar>
            </ToolWrapper>
            <ActionWrapper>
              <ActionIconL src={text} />
              <ActionIconM src={save} />
              <ActionIconM src={undo} />
            </ActionWrapper>
          </SettingWrapper>
          <VisionBoard />
        </VisionBoardContainer>
      </BoardContainer>
      <Background />
    </Container>
  );
}
