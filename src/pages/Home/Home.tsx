import { useRef } from 'react';
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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MainTitle = styled.h1`
  opacity: 0;
  text-align: start;
  font-size: 3rem;
  letter-spacing: 0.2rem;
  line-height: 4rem;
  animation: ${fadeIn} 1s ease-in-out forwards;
`;

const SubTitle = styled.h2`
  width: fit-content;
  opacity: 0;
  text-align: start;
  letter-spacing: 0.4rem;
  line-height: 3rem;
  color: #8d9ca4;
  border-bottom: 1px solid #8d9ca4;
  animation: ${fadeIn} 1s ease-in-out 0.5s forwards;
  animation-delay: 0.5s;
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
  opacity: 0;
  background-color: rgba(223, 223, 223, 0.5);
  border-radius: 50%;
  animation: ${fadeIn} 1s ease-in-out 1s forwards, ${bounce} 1s infinite;
  animation-delay: 1s;
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
  top: -30%;
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
  const introRef = useRef<HTMLDivElement | null>(null);

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
          <DownBtn
            onClick={() =>
              introRef.current &&
              introRef.current.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <Chevron rotateDeg={180} color="#b5b5b5" />
          </DownBtn>
        </Main>
      </Container>

      <Container ref={introRef}>
        <Introduction>
          <IntroTitle>
            「春至陋室中，
            <br />
            &nbsp;&nbsp;&nbsp;無一物中萬物足。」
          </IntroTitle>
          <IntroDescription>
            在現代社會，人們的生活越來越複雜，JOGANDAN
            希望可以簡化用戶在管理自己物品遇到的困難，提供一個平台讓您可以輕鬆管理物品，並且可以設立目標檢視自己的成果，量化自己在斷捨離的成長，藉由對物品進行減法來為自己的生活加分。
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
