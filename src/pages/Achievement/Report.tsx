import styled from 'styled-components';

const Svg = styled.svg`
  display: block;
  width: 1000px;
  height: 600px;
`;

const Line = styled.line`
  stroke: #acaea9;
`;

const Text = styled.text`
  font-size: 12px;
  fill: #acaea9;
`;

const XTag = styled(Text)`
  text-anchor: start;
`;

const YTag = styled(Text)`
  text-anchor: end;
`;

const Rect = styled.rect`
  width: 25px;
  fill: #7e807c;
`;

type month = string;
type quantity = number;
type data = number[];

const MONTHS: month[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const QUANTITY: quantity[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const Items: data = [5, 23, 20, 15, 60, 78, 100, 96, 3, 34, 66, 12];

export default function Report() {
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

  return (
    <Svg>
      <Line x1={X_START_AXIS} y1={Y_END_AXIS} x2={X_END_AXIS} y2={Y_END_AXIS} />
      {MONTHS.map((item: month, index: number) => (
        <XTag
          key={item}
          x={XTAG_START_AXIS + index * XTAG_SPACE}
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

      {Items.map((item: quantity, index: number) => (
        <Rect
          x={XTAG_START_AXIS + index * XTAG_SPACE}
          y={YTAG_START_AXIS - item * HEIGHT_PER_QTY}
          height={item * HEIGHT_PER_QTY}
        />
      ))}
    </Svg>
  );
}
