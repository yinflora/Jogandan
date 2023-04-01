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

export default function Report() {
  const X_START_AXIS: number = 50;
  const X_END_AXIS: number = 1000;
  const Y_START_AXIS: number = 50;
  const Y_END_AXIS: number = 550;
  const HEIGHT_PER_QTY: number = 5;

  return (
    <Svg>
      {/* <!-- X軸 --> */}
      <Line x1={X_START_AXIS} y1={Y_END_AXIS} x2={X_END_AXIS} y2={Y_END_AXIS} />

      {/* <!-- X軸標籤 --> */}
      <XTag x="100" y="570">
        Jan
      </XTag>
      <XTag x="175" y="570">
        Feb
      </XTag>
      <XTag x="250" y="570">
        Mar
      </XTag>
      <XTag x="325" y="570">
        Apr
      </XTag>
      <XTag x="400" y="570">
        May
      </XTag>
      <XTag x="475" y="570">
        Jun
      </XTag>
      <XTag x="550" y="570">
        Jul
      </XTag>
      <XTag x="625" y="570">
        Aug
      </XTag>
      <XTag x="700" y="570">
        Sep
      </XTag>
      <XTag x="775" y="570">
        Oct
      </XTag>
      <XTag x="850" y="570">
        Nov
      </XTag>
      <XTag x="925" y="570">
        Dec
      </XTag>

      {/* <!-- Y軸 --> */}
      <Line
        x1={X_START_AXIS}
        y1={Y_START_AXIS}
        x2={X_START_AXIS}
        y2={Y_END_AXIS}
      />

      {/* <!-- Y軸標籤 --> */}
      <YTag x="30" y="550">
        0
      </YTag>
      <YTag x="30" y="500">
        10
      </YTag>
      <YTag x="30" y="450">
        20
      </YTag>
      <YTag x="30" y="400">
        30
      </YTag>
      <YTag x="30" y="350">
        40
      </YTag>
      <YTag x="30" y="300">
        50
      </YTag>
      <YTag x="30" y="250">
        60
      </YTag>
      <YTag x="30" y="200">
        70
      </YTag>
      <YTag x="30" y="150">
        80
      </YTag>
      <YTag x="30" y="100">
        90
      </YTag>
      <YTag x="30" y="50">
        100
      </YTag>

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
