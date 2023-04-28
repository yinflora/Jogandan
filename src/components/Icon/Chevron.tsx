import styled from 'styled-components';

const StyledChevron = styled.svg<ChevronProps>`
  transform: scale(1, 0.5) rotate(${({ rotateDeg }) => rotateDeg}deg);
`;

type ChevronProps = {
  size?: number;
  rotateDeg: number;
  color?: string;
  onClick?: () => void;
};

export default function Chevron({
  size,
  rotateDeg,
  color,
  onClick,
}: ChevronProps) {
  return (
    <StyledChevron
      rotateDeg={rotateDeg}
      width={size ? size : '40'}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke-width="0.125"
      onClick={onClick}
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
