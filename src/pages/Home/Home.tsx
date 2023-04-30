import styled, { keyframes } from 'styled-components/macro';

import background from './background.jpeg';
import feature1 from './feature1.png';
import feature2 from './feature2.png';

import Chevron from '../../components/Icon/Chevron';
import Button from '../../components/Button/Button';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const FeatureLoginContainer = styled(Container)`
  height: 120vh;
`;

const Main = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 90%;
  padding: 0 5% 5%;
  flex-direction: column;
  justify-content: end;
  gap: 10px;
  background: center / cover no-repeat url(${background});
`;

const MainTitle = styled.h1`
  text-align: start;
  font-size: 3rem;
  letter-spacing: 0.2rem;
  line-height: 4rem;
`;

const SubTitle = styled.h2`
  width: fit-content;
  text-align: start;
  letter-spacing: 0.4rem;
  line-height: 3rem;
  color: #8d9ca4;
  border-bottom: 1px solid #8d9ca4;
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

const DownBtn = styled.button`
  position: absolute;
  bottom: -5%;
  left: calc((100% - 100px) / 2);
  transform: translateX(-(100% - 100px)/2);
  width: 100px;
  height: 100px;
  background-color: rgba(223, 223, 223, 0.5);
  border-radius: 50%;
  animation: ${bounce} 1s infinite;
  cursor: pointer;
`;

const Introduction = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10% 5%;
  flex-direction: column;
  gap: 5%;
`;

const IntroTitle = styled.p`
  font-size: 2rem;
  line-height: 3rem;
  letter-spacing: 0.4rem;
`;

const IntroDescription = styled.p`
  max-width: 60%;
  line-height: 1.5rem;
  letter-spacing: 0.1rem;
`;

const FeatureLoginWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;

const Feature = styled.div`
  position: absolute;
  top: -20%;
  display: flex;
  width: 100%;
  height: 600px;
  justify-content: center;
  gap: 10%;
`;

const FeatureCard = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
`;

const FeatureCardR = styled(FeatureCard)`
  align-self: end;
`;

const FeatureImage = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  object-position: center;
`;

const FeatureTitle = styled.p`
  margin-top: 20px;
  font-size: 1.25rem;
  letter-spacing: 0.2rem;
`;

const Login = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  align-self: flex-end;
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
        <Main>
          <MainTitle>
            Simplify,
            <br />
            Organize,
            <br />
            Declutter Your Life
          </MainTitle>
          <SubTitle>理想的簡單生活從JOGANDAN開始</SubTitle>
          <DownBtn>
            <Chevron rotateDeg={180} color="#c6c6c6" />
          </DownBtn>
        </Main>
      </Container>

      <Container>
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
            diam. Aliquet porttitor lacus luctus accumsan tortor posuere. Netus
            et malesuada fames ac turpis egestas integer. Ac orci phasellus
            egestas tellus rutrum tellus pellentesque eu. Turpis egestas pretium
            aenean pharetra magna ac placerat vestibulum. Vestibulum mattis
            ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.
          </IntroDescription>
        </Introduction>
      </Container>

      <FeatureLoginContainer>
        <FeatureLoginWrapper>
          <Feature>
            <FeatureCard>
              <FeatureImage src={feature1} />
              <FeatureTitle>系統化物品管理</FeatureTitle>
            </FeatureCard>
            <FeatureCardR>
              <FeatureImage src={feature2} />
              <FeatureTitle>量化自我成長</FeatureTitle>
            </FeatureCardR>
          </Feature>

          <Login>
            <LoginTitle>Join Jogandan</LoginTitle>
            <LoginSubTitle>立即開始您的簡單生活</LoginSubTitle>
            <Button width="30%" buttonType="normal">
              START YOUR JOURNEY
            </Button>
          </Login>
        </FeatureLoginWrapper>
      </FeatureLoginContainer>
    </>
  );
}
