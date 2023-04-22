import styled from 'styled-components';

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  transform: scale(0.85) translate(-10%, -15%);
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
  text-anchor: end;
`;

const Rect = styled.rect`
  width: 25px;
  fill: #fff;
`;

const Qty = styled(Text)`
  text-anchor: middle;
`;

type month = string;
type quantity = number;
type Row = string[];
type Column = number[];

const CATEGORY: Row = [
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

const QUANTITY: Column = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

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
const HEIGHT_PER_QTY: number = 5;
const TEXT_SPACING: number = 12.5;
const TEXT_TO_RECT: number = 10;

type ReportProps = {
  processedItems: [];
};

export default function Report({ processedItems }: ReportProps) {
  return (
    <Svg preserveAspectRatio="xMinYMin meet">
      <Line x1={X_START_AXIS} y1={Y_END_AXIS} x2={X_END_AXIS} y2={Y_END_AXIS} />
      {CATEGORY.map((item: month, index: number) => (
        <XTag
          key={item}
          x={XTAG_START_AXIS + index * XTAG_SPACE + TEXT_SPACING}
          y={XTAG_Y_AXIS}
        >
          {item}
        </XTag>
      ))}

      <Line
        x1={X_START_AXIS}
        y1={Y_START_AXIS}
        x2={X_START_AXIS}
        y2={Y_END_AXIS}
      />
      {QUANTITY.map((item: quantity, index: number) => (
        <YTag
          key={item}
          x={YTAG_X_AXIS}
          y={YTAG_START_AXIS - index * YTAG_SPACE}
        >
          {item}
        </YTag>
      ))}

      {processedItems.map((item: quantity, index: number) => (
        <>
          <Rect
            x={XTAG_START_AXIS + index * XTAG_SPACE}
            y={YTAG_START_AXIS - item * HEIGHT_PER_QTY}
            height={item * HEIGHT_PER_QTY}
          />
          {item !== 0 && (
            <Qty
              x={XTAG_START_AXIS + index * XTAG_SPACE + TEXT_SPACING}
              y={YTAG_START_AXIS - item * HEIGHT_PER_QTY - TEXT_TO_RECT}
            >
              {item}
            </Qty>
          )}
        </>
      ))}
    </Svg>
  );
}
