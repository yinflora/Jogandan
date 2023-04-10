import styled from 'styled-components';
import aoao from './aoao.jpg';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  width: 100vw;
  height: 100vh;
  padding: 10vh 15vw;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  gap: 10px;
`;

const Cancel = styled.div`
  /* width: 20px;
  height: 10px; */
  /* transform: scale(2, 0.5); */
  margin-left: auto;
  /* width: 100%; */
  /* text-align: end; */
  color: #f1f2ed;
`;

const Container = styled.div`
  /* width: 70%;
  height: 80%; */
  display: flex;
  width: 100%;
  height: 100%;
  padding: 40px 60px;
  gap: 60px;
  background-color: #f1f2ed;
`;

const ImageWrapper = styled.div`
  width: 40%;
  /* display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 80% 20%; */
  /* background-color: gray; */
`;

const MainImage = styled.img`
  width: 100%;
  padding: 5px;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
`;

const SubImageWrapper = styled.div`
  display: flex;
  /* justify-content: space-between; */
  overflow-x: scroll;
  flex-wrap: nowrap;
  /* gap: 10px; */
`;

const SubImage = styled.img`
  width: calc(100% / 3);
  /* width: 25%; */
  padding: 5px;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  flex-shrink: 0;
`;

const InfoWrapper = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  justify-content: space-between;
  /* background-color: gray; */
  color: #acaea9;
`;

const Category = styled.p`
  /* color: #acaea9; */
`;

const Name = styled.p`
  font-size: 2rem;
  color: black;
`;

const Row = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid black;
`;

const Title = styled.span`
  display: inline-block;
  width: 100px;
  /* color: #acaea9; */
`;

const Content = styled.span`
  /* color: #acaea9; */
`;

const Description = styled.div`
  padding: 20px 0;
  overflow-y: scroll;
`;

export default function Popout() {
  return (
    <Overlay>
      <Cancel>X</Cancel>
      <Container>
        <ImageWrapper>
          <MainImage src={aoao} />
          <SubImageWrapper>
            <SubImage src={aoao} />
            <SubImage src={aoao} />
            <SubImage src={aoao} />
            <SubImage src={aoao} />
          </SubImageWrapper>
        </ImageWrapper>
        <InfoWrapper>
          <Category>居家生活</Category>
          <Name>凹凹</Name>
          <Row>
            <Title>購買日期</Title>
            <Content>2023/04/10</Content>
          </Row>
          <Row>
            <Title>目前狀態</Title>
            <Content>保留</Content>
          </Row>
          <Row>
            <Title>數量</Title>
            <Content>1</Content>
          </Row>
          <Description>
            快來喵喵 喵喵喵 喵電感應 感覺到我跟你同時觸電反應
            不管相隔多遠都能互相連繫 因為太多太奇妙的喵電感應 喵 喵電感應
            喔我的距離 細胞在共鳴 內心在呼應 喵 喵電感應 有一些感性 連結的遊戲
            不斷在通訊 不管到哪裡都可以感覺到 這種心有靈犀特別地美好
            有沒有心動一看喵喵就知道 不需要再說的好不好欸(別說好不好欸) 磁場共鳴
            越來越接近 電波感應 契合地相信 磁場共鳴 越來越接近 電波感應
            契合地相信著
          </Description>
        </InfoWrapper>
      </Container>
    </Overlay>
  );
}
