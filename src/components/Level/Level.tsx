import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 150px;
  right: 60px;
  display: flex;
  height: 75vh;
  gap: 20px;
  cursor: default;
`;

const Bar = styled.div`
  display: flex;
  width: 10px;
  height: 100%;
  flex-direction: column-reverse;
  border: 1px solid #8d9ca4;
`;

const Fill = styled.div<LevelProp>`
  background-color: #8d9ca4;
  height: 100%;
  border-radius: inherit;
  transition: height 0.2s ease-in;
  height: ${({ percent }) => `${percent * 100}%`};
  position: relative;

  &:hover::before {
    content: '${({ percent }) => `${Math.round(percent * 100)}%`}';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translate(-100%, -50%);
    padding: 5px;
    background-color: #fff;
    color: #8d9ca4;
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const LevelWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.p`
  writing-mode: vertical-lr;
  color: #8d9ca4;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
`;

type LevelProp = {
  percent: number;
};

export default function Level({ percent }: LevelProp) {
  return (
    <Container>
      <Bar>
        <Fill percent={percent} />
      </Bar>
      <LevelWrapper>
        <Title>Master</Title>
        <Title>Veteran</Title>
        <Title>Seasoned</Title>
        <Title>Rookie</Title>
      </LevelWrapper>
    </Container>
  );
}
