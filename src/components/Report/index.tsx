import { Fragment } from 'react';
import styled from 'styled-components';
import { Category, Item } from '../../types/types';

const Svg = styled.svg`
  width: 1000px;
  height: 600px;
  transform: translate(-25px);
`;

const Line = styled.line`
  stroke: #fff;
`;

const Text = styled.text`
  font-size: 0.75rem;
  fill: #fff;
`;

const XTag = styled(Text)`
  text-anchor: middle;
`;

const YTag = styled(Text)`
  text-anchor: middle;
`;

const Rect = styled.rect`
  width: 25px;
  fill: #fff;
`;

const Qty = styled(Text)`
  text-anchor: middle;
`;

type Quantities = number[];

const CATEGORIES: Category[] = [
  '居家生活',
  '服飾配件',
  '美妝保養',
  '3C產品',
  '影音產品',
  '書報雜誌',
  '體育器材',
  '寵物用品',
  '食物及飲料',
  '興趣及遊戲',
  '紀念意義',
  '其他',
];

const SPACING_UNIT_1: Quantities = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SPACING_UNIT_5: Quantities = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const SPACING_UNIT_10: Quantities = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
];

const SPACING_UNIT_1_HEIGHT = 50;
const SPACING_UNIT_5_HEIGHT = 10;
const SPACING_UNIT_10_HEIGHT = 5;

const X_START_AXIS: number = 50;
const X_END_AXIS: number = 1000;
const Y_START_AXIS: number = 50;
const Y_END_AXIS: number = 550;
const XTAG_START_AXIS: number = 100;
const XTAG_SPACE: number = 75;
const XTAG_Y_AXIS: number = 570;
const YTAG_START_AXIS: number = 550;
const YTAG_SPACE: number = 50;
const YTAG_X_AXIS: number = 30;

const TEXT_SPACING: number = 12.5;
const TEXT_TO_RECT: number = 10;

type ReportProp = {
  items: Item[];
};

const Report = ({ items }: ReportProp) => {
  const itemQty = items.reduce((acc, item) => {
    const index = CATEGORIES.indexOf(item.category);
    if (index !== -1) {
      acc[index]++;
    }
    return acc;
  }, Array(CATEGORIES.length).fill(0));

  const isOver50perCategory = itemQty.some((value) => value >= 50);
  const isOver10perCategory = itemQty.some((value) => value >= 10);

  let qtyLine;
  let qtyHeight: 5 | 10 | 50;

  if (isOver50perCategory) {
    qtyLine = SPACING_UNIT_10;
    qtyHeight = SPACING_UNIT_10_HEIGHT;
  } else if (isOver10perCategory) {
    qtyLine = SPACING_UNIT_5;
    qtyHeight = SPACING_UNIT_5_HEIGHT;
  } else {
    qtyLine = SPACING_UNIT_1;
    qtyHeight = SPACING_UNIT_1_HEIGHT;
  }

  return (
    <Svg preserveAspectRatio="xMinYMin meet">
      <Line x1={X_START_AXIS} y1={Y_END_AXIS} x2={X_END_AXIS} y2={Y_END_AXIS} />
      {CATEGORIES.map((item: Category, index: number) => (
        <XTag
          key={item}
          x={XTAG_START_AXIS + index * XTAG_SPACE + TEXT_SPACING}
          y={XTAG_Y_AXIS}
        >
          {item}
        </XTag>
      ))}
      <Line x1={X_END_AXIS} y1={Y_START_AXIS} x2={X_END_AXIS} y2={Y_END_AXIS} />

      <Line
        x1={Y_START_AXIS}
        y1={Y_START_AXIS}
        x2={X_END_AXIS}
        y2={Y_START_AXIS}
      />
      {qtyLine.map((item: number, index: number) => (
        <YTag
          key={item}
          x={YTAG_X_AXIS}
          y={YTAG_START_AXIS - index * YTAG_SPACE}
        >
          {item}
        </YTag>
      ))}
      <Line
        x1={X_START_AXIS}
        y1={Y_START_AXIS}
        x2={X_START_AXIS}
        y2={Y_END_AXIS}
      />

      {itemQty.map((item: number, index: number) => (
        <Fragment key={index}>
          <Rect
            x={XTAG_START_AXIS + index * XTAG_SPACE}
            y={YTAG_START_AXIS - item * qtyHeight}
            height={item * qtyHeight}
          />
          {item !== 0 && (
            <Qty
              x={XTAG_START_AXIS + index * XTAG_SPACE + TEXT_SPACING}
              y={YTAG_START_AXIS - item * qtyHeight - TEXT_TO_RECT}
            >
              {item}
            </Qty>
          )}
        </Fragment>
      ))}
    </Svg>
  );
};

export default Report;
