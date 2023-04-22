import styled from 'styled-components';

const StyledChevron = styled.svg<ChevronProps>`
  transform: scale(1, 0.5) rotate(${({ rotateDeg }) => rotateDeg}deg);
`;

type ChevronProps = {
  rotateDeg: number;
};

export default function Chevron({ rotateDeg }: ChevronProps) {
  return (
    <StyledChevron
      rotateDeg={rotateDeg}
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
      stroke-width="0.5"
      stroke="#ffffff"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="6 15 12 9 18 15" />
    </StyledChevron>
  );
}
