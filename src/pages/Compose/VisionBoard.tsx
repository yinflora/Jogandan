import { fabric } from 'fabric';
import React, { useContext } from 'react';
import { CiTrash, CiUndo } from 'react-icons/ci';
import { TfiSaveAlt, TfiText } from 'react-icons/tfi';
import styled from 'styled-components';
import { UserInfoContext } from '../../context/UserInfoContext';
import { TextConfig } from './index';

const VisionBoardContainer = styled.div`
  display: flex;
  width: 70%;
  height: 100%;
  padding: 20px;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #8d9ca4;
  gap: 20px;
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
  gap: 5px;
`;

const ToolName = styled.label`
  font-size: 0.75rem;
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

const FontSize = styled.span`
  letter-spacing: 0.1rem;
  color: #fff;
`;

const ActionWrapper = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
  gap: 20px;

  & > .text {
    width: 20px;
    height: 20px;
    color: #fff;

    &:hover {
      cursor: pointer;
      stroke-width: 0.5px;
    }
  }

  & > .trash,
  .clear {
    width: 25px;
    height: 25px;
    color: #fff;

    &:hover {
      cursor: pointer;
      stroke-width: 0.5px;
    }
  }

  & .save {
    width: 20px;
    height: 20px;
    color: #fff;

    &:hover {
      cursor: pointer;
      stroke-width: 0.5px;
    }
  }
`;

const Board = styled.div`
  width: 625px;
  height: 475px;
  margin: 0 auto;
  box-shadow: 0px 4px 90px 10px rgba(0, 0, 0, 0.1);
`;

type VisionBoardPropsType = {
  bgColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  activeItem: fabric.Object | null;
  textConfig: TextConfig;
  setTextConfig: React.Dispatch<React.SetStateAction<TextConfig>>;
  setButtonAction: React.Dispatch<React.SetStateAction<string | null>>;
  addText: () => void;
  deleteActiveItem: () => void;
  saveProject: () => Promise<void>;
};

const VisionBoard = ({
  bgColor,
  setBgColor,
  activeItem,
  textConfig,
  setTextConfig,
  setButtonAction,
  addText,
  deleteActiveItem,
  saveProject,
}: VisionBoardPropsType) => {
  const { isPopout, setIsPopout } = useContext(UserInfoContext);

  return (
    <VisionBoardContainer>
      <SettingWrapper>
        <ToolWrapper>
          <ToolBar>
            <ToolName>背景</ToolName>
            <ColorSelector
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </ToolBar>
        </ToolWrapper>
        {activeItem && activeItem.type === 'i-text' && (
          <>
            <ToolWrapper>
              <ToolBar>
                <ToolName>文字</ToolName>
                <ColorSelector
                  type="color"
                  value={textConfig.color}
                  onChange={(e) =>
                    setTextConfig({
                      ...textConfig,
                      color: e.target.value,
                    })
                  }
                />
              </ToolBar>
            </ToolWrapper>
            <ToolWrapper>
              <ToolBar>
                <ToolName>字體大小</ToolName>
                <FontSizeRange
                  type="range"
                  min="10"
                  max="40"
                  defaultValue="16"
                  value={textConfig.fontSize}
                  onChange={(e) =>
                    setTextConfig({
                      ...textConfig,
                      fontSize: Number(e.target.value),
                    })
                  }
                />
                <FontSize>{textConfig.fontSize}</FontSize>
              </ToolBar>
            </ToolWrapper>
          </>
        )}

        <ActionWrapper>
          {activeItem && (
            <CiTrash className="trash" onClick={deleteActiveItem} />
          )}
          <TfiText className="text" onClick={addText} />
          <CiUndo
            className="clear"
            onClick={() => {
              setButtonAction('clear');
              setIsPopout(!isPopout);
            }}
          />
          <TfiSaveAlt
            className="save"
            onClick={() => {
              saveProject();
              setButtonAction('save');
              setIsPopout(!isPopout);
            }}
          />
        </ActionWrapper>
      </SettingWrapper>

      <Board>
        <canvas id="canvas" />
      </Board>
    </VisionBoardContainer>
  );
};

export default VisionBoard;
