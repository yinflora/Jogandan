import styled from 'styled-components';

const StyledChevron = styled.svg<ChevronProps>`
  transform: scale(1, 0.5) rotate(${({ rotateDeg }) => rotateDeg}deg);
`;

type ChevronProps = {
  size?: number;
  rotateDeg: number;
  color?: string;
};

export default function Chevron({ size, rotateDeg, color }: ChevronProps) {
  return (
    // <StyledChevron
    //   rotateDeg={rotateDeg}
    //   xmlns="http://www.w3.org/2000/svg"
    //   width={size ? size : '60'}
    //   height={size ? size : '60'}
    //   viewBox="0 0 24 24"
    //   stroke-width="0.5"
    //   stroke={color ? color : '#ffffff'}
    //   fill="none"
    //   stroke-linecap="round"
    //   stroke-linejoin="round"
    // >
    //   <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    //   <polyline points="6 15 12 9 18 15" />
    // </StyledChevron>

    <StyledChevron
      rotateDeg={rotateDeg}
      width={size ? size : '40'}
      // height={size ? size : '40'}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // stroke={color ? color : '#ffffff'}
      stroke-width="0.125"
    >
      <g stroke-width="0" />
      <g stroke-linecap="round" stroke-linejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M21.5 16.8272L12.5294 8.35661C12.25 8.0919 11.8088 8.0919 11.5147 8.35661L2.5 16.8419"
          stroke={color ? color : '#ffffff'}
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </StyledChevron>
  );
}
