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
  return (
    <Svg>
      {/* <!-- X軸 --> */}
      <Line x1="50" y1="500" x2="1000" y2="500" />

      {/* <!-- X軸標籤 --> */}
      <XTag x="100" y="530">
        Jan
      </XTag>
      <XTag x="175" y="530">
        Feb
      </XTag>
      <XTag x="250" y="530">
        Mar
      </XTag>
      <XTag x="325" y="530">
        Apr
      </XTag>
      <XTag x="400" y="530">
        May
      </XTag>
      <XTag x="475" y="530">
        Jun
      </XTag>
      <XTag x="550" y="530">
        Jul
      </XTag>
      <XTag x="625" y="530">
        Aug
      </XTag>
      <XTag x="700" y="530">
        Sep
      </XTag>
      <XTag x="775" y="530">
        Oct
      </XTag>
      <XTag x="850" y="530">
        Nov
      </XTag>
      <XTag x="925" y="530">
        Dec
      </XTag>

      {/* <!-- Y軸 --> */}
      <Line x1="50" y1="50" x2="50" y2="500" />

      {/* <!-- Y軸標籤 --> */}
      <YTag x="30" y="500">
        0
      </YTag>
      <YTag x="30" y="450">
        10
      </YTag>
      <YTag x="30" y="400">
        20
      </YTag>
      <YTag x="30" y="350">
        30
      </YTag>
      <YTag x="30" y="300">
        40
      </YTag>
      <YTag x="30" y="250">
        50
      </YTag>
      <YTag x="30" y="200">
        60
      </YTag>
      <YTag x="30" y="150">
        70
      </YTag>
      <YTag x="30" y="100">
        80
      </YTag>
      <YTag x="30" y="50">
        90
      </YTag>

      {/* <!--Bar --> y從哪邊長下來 */}
      <Rect x="100" y="400" height="100" />
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
