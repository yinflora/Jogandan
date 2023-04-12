import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100vh;
  gap: 20px;
`;

const Bar = styled.div`
  display: flex;
  width: 15px;
  height: 100%;
  flex-direction: column-reverse;
  border-radius: 3px;
  border: 1px solid #ccc;
`;

const Fill = styled.div<LevelProp>`
  background-color: #000;
  height: 100%;
  border-radius: inherit;
  transition: height 0.2s ease-in;
  height: ${({ percent }) => `${percent * 100}%`};
`;

const LevelWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.p`
  font-size: 1.5rem;
`;

const Description = styled.p``;

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
        <div>
          <Title>Master</Title>
          <Description>完成 100 次斷捨離</Description>
        </div>
        <div>
          <Title>Veteran</Title>
          <Description>完成 50 次斷捨離</Description>
        </div>
        <div>
          <Title>Seasoned</Title>
          <Description>完成 10 次斷捨離</Description>
        </div>
        <div>
          <Title>Rookie</Title>
          <Description>完成初次斷捨離</Description>
        </div>
      </LevelWrapper>
    </Container>
  );
}
