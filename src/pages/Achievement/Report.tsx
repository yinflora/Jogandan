import { useState } from 'react';
import styled from 'styled-components';
// import { getProcessedItems } from '../../utils/firebase';

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

export default function Report() {
  // const [filteredItems, setFilteredItems] = useState([]);
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
  // const HEIGHT_PER_QTY: number = 5;

  // getProcessedItems();

  return (
    <Svg>
      {/* <!-- X軸 --> */}
      <Line x1={X_START_AXIS} y1={Y_END_AXIS} x2={X_END_AXIS} y2={Y_END_AXIS} />

      {/* <!-- X軸標籤 --> */}
      {MONTHS.map((item: month, index: number) => (
        <XTag
          key={item}
          x={XTAG_START_AXIS + index * XTAG_SPACE}
          y={XTAG_Y_AXIS}
        >
          {item}
        </XTag>
      ))}

      {/* <!-- Y軸 --> */}
      <Line
        x1={X_START_AXIS}
        y1={Y_START_AXIS}
        x2={X_START_AXIS}
        y2={Y_END_AXIS}
      />

      {/* <!-- Y軸標籤 --> */}
      {QUANTITY.map((item: quantity, index: number) => (
        <YTag
          key={item}
          x={YTAG_X_AXIS}
          y={YTAG_START_AXIS - index * YTAG_SPACE}
        >
          {item}
        </YTag>
      ))}

      {/* <!--Bar --> y從哪邊長下來 */}
      <Rect x="100" y="525" height="25" />
      <Rect x="175" y="200" height="300" />
      <Rect x="250" y="150" height="350" />
      <Rect x="325" y="450" height="50" />
      <Rect x="400" y="375" height="125" />
      <Rect x="475" y="245" height="255" />
      <Rect x="550" y="275" height="225" />
      <Rect x="625" y="135" height="365" />
      <Rect x="700" y="135" height="365" />
      <Rect x="775" y="135" height="365" />
      <Rect x="850" y="135" height="365" />
      <Rect x="925" y="135" height="365" />
    </Svg>
  );
}
