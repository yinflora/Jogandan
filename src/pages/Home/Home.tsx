import styled from 'styled-components';

import background from './background.jpeg';
import feature1 from './feature1.jpeg';
import feature2 from './feature2.jpeg';

import Chevron from '../../components/Icon/Chevron';
import Button from '../../components/Button/Button';

const Background = styled.img`
  position: absolute;
  z-index: -1;
  top: 0;
  width: 100vw;
  height: 90vh;
  object-fit: cover;
  object-position: center;
`;

const Container = styled.div`
  padding: 30vh 100px 0;
`;

const TopWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  letter-spacing: 0.2rem;
  line-height: 4rem;
  color: #000;
`;

const SubTitle = styled.h2`
  display: inline-block;
  margin: 20px 0 10px;
  font-size: 1.25rem;
  letter-spacing: 0.4rem;
  line-height: 3rem;
  color: #8d9ca4;
  border-bottom: 1px solid #8d9ca4;
`;

const DownIcon = styled.div`
  display: flex;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  background-color: rgba(223, 223, 223, 0.5);
  border-radius: 50%;
`;

const InfoContainer = styled.div`
  width: 100%;
`;

const Introduction = styled.div`
  margin-top: 30vh;
`;

const IntroTitle = styled.p`
  font-size: 2rem;
  line-height: 3rem;
  letter-spacing: 0.4rem;
  color: #000;
`;

const IntroDescription = styled.p`
  max-width: 60%;
  margin-top: 5vh;
  line-height: 1.5rem;
  letter-spacing: 0.1rem;
`;

const FeatureWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 80vh;
  margin-top: 20vh;
  justify-content: center;
  gap: 10vw;
`;

const FeatureCard = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  gap: 5vh;
`;

const FeatureCardBottom = styled(FeatureCard)`
  align-self: end;
`;

const FeatureImage = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  object-position: center;
`;

const FeatureTitle = styled.p`
  font-size: 1.25rem;
  letter-spacing: 0.2rem;
`;

const LoginContainer = styled.div`
  display: flex;
  width: 100%;
  height: 60vh;
  margin-top: 20vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(244, 243, 239, 0.3);
`;

const LoginTitle = styled.p`
  font-weight: 500;
  font-size: 3.25rem;
  letter-spacing: 0.2rem;
`;

const LoginSubTitle = styled.p`
  margin: 10px 0 40px;
  font-size: 1.25rem;
  letter-spacing: 0.4rem;
  line-height: 3rem;
`;

export default function Home() {
  return (
    <>
      <Container>
        <TopWrapper>
          <MainTitle>
            Simplify,
            <br />
            Organize,
            <br />
            Declutter Your Life
          </MainTitle>
          <SubTitle>理想的簡單生活從JOGANDAN開始</SubTitle>
          <DownIcon>
            <Chevron size={100} rotateDeg={180} color="#c6c6c6" />
          </DownIcon>
        </TopWrapper>

        <InfoContainer>
          <Introduction>
            <IntroTitle>
              「春至陋室中，
              <br />
              &nbsp;&nbsp;&nbsp;無一物中萬物足。」
            </IntroTitle>
            <IntroDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet
              cursus sit amet dictum. Elementum sagittis vitae et leo duis ut
              diam. Aliquet porttitor lacus luctus accumsan tortor posuere.
              Netus et malesuada fames ac turpis egestas integer. Ac orci
              phasellus egestas tellus rutrum tellus pellentesque eu. Turpis
              egestas pretium aenean pharetra magna ac placerat vestibulum.
              Vestibulum mattis ullamcorper velit sed ullamcorper morbi
              tincidunt ornare massa.
            </IntroDescription>
            <FeatureWrapper>
              <FeatureCard>
                <FeatureImage src={feature1} />
                <FeatureTitle>系統化物品管理</FeatureTitle>
              </FeatureCard>
              <FeatureCardBottom>
                <FeatureImage src={feature2} />
                <FeatureTitle>量化自我成長</FeatureTitle>
              </FeatureCardBottom>
            </FeatureWrapper>
          </Introduction>
        </InfoContainer>

        <LoginContainer>
          <LoginTitle>Join Jogandan</LoginTitle>
          <LoginSubTitle>立即開始您的簡單生活</LoginSubTitle>
          <Button width="30%" buttonType="normal">
            START YOUR JOURNEY
          </Button>
        </LoginContainer>
      </Container>

      <Background src={background} />
    </>
  );
}
