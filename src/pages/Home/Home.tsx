import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components/macro';
import { useNavigate } from 'react-router-dom';

import background from './background.jpeg';
// import feature1 from './feature1.png';
// import feature2 from './feature2.png';
import singleUpload from './singleUpload.png';
// import bulkUpload from './bulkUpload.png';
import inventory from './inventory.png';
import visionBoard from './visionBoard.png';
import achievement from './achievement.png';

import Chevron from '../../components/Icon/Chevron';
import Button from '../../components/Button/Button';

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

// const FeatureLoginContainer = styled(Container)`
//   height: 150vh;
// `;

const SmallContainer = styled(Container)`
  height: 80vh;
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
  /* background: center / cover no-repeat url(${background}); */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: center / cover no-repeat url(${background});
    opacity: 0.4;
    z-index: -1;
  }
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
  gap: 10%;
`;

const IntroTitle = styled.p<{ isEntering: boolean }>`
  font-size: 2rem;
  line-height: 3rem;
  letter-spacing: 0.4rem;

  ${({ isEntering }) =>
    isEntering &&
    css`
      opacity: 0;
      animation: ${fadeIn} 1s ease-in-out forwards;
      animation-delay: 0.5s;
    `}
`;

const IntroDescription = styled.p<{ isEntering: boolean }>`
  max-width: 50%;
  margin-left: 20px;
  line-height: 2rem;
  letter-spacing: 0.1rem;

  ${({ isEntering }) =>
    isEntering &&
    css`
      opacity: 0;
      animation: ${fadeIn} 1s ease-in-out 0.5s forwards;
      animation-delay: 1s;
    `}
`;

// const FeatureLoginWrapper = styled.div`
//   position: relative;
//   display: flex;
//   width: 100%;
//   height: 100%;
// `;

// const Feature = styled.div`
//   position: absolute;
//   top: -20%;
//   display: flex;
//   width: 100%;
//   height: 800px;
//   justify-content: center;
//   gap: 5%;
// `;

// const FeatureCard = styled.div`
//   position: relative;
//   display: flex;
//   width: 400px;
//   flex-direction: column;
// `;

// const FeatureCardR = styled(FeatureCard)`
//   align-self: end;
// `;

// const FeatureImage = styled.img<{ isEntering: boolean }>`
//   width: 100%;
//   aspect-ratio: 2/3;
//   object-fit: cover;
//   object-position: center;
//   filter: grayscale(10%);

//   ${({ isEntering }) =>
//     isEntering &&
//     css`
//       opacity: 0;
//       animation: ${fadeIn} 1s ease-in-out 0.5s forwards;
//       animation-delay: 1.5s;
//     `}
// `;

// const FeatureTextWrapper = styled.div<{ isEntering: boolean }>`
//   position: absolute;
//   top: 0;
//   left: 50px;
//   display: flex;
//   flex-direction: column;
//   gap: 60px;
//   color: #828282;

//   ${({ isEntering }) =>
//     isEntering &&
//     css`
//       opacity: 0;
//       animation: ${fadeIn} 1s ease-in-out 0.5s forwards;
//       animation-delay: 2s;
//     `}
// `;

// const FeatureTitle = styled.p`
//   margin-top: 50px;
//   font-size: 1.5rem;
//   letter-spacing: 0.4rem;
// `;

// const FeatureDescription = styled.div`
//   line-height: 2rem;
//   letter-spacing: 0.1rem;
// `;

const Feature = styled.div`
  width: 100%;
  height: 100%;
`;

const FeatureWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  padding: 0 5% 5%;
  gap: 3%;
`;

const FeatureWrapperL = styled(FeatureWrapper)`
  justify-content: start;
`;

const FeatureWrapperR = styled(FeatureWrapper)`
  justify-content: end;
`;

const FeatureImage = styled.img`
  /* width: 600px; */
  height: 100%;
  border: 0.5px solid #cdcdcd;
`;

const FeatureText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 30px;
  color: #000;
`;

const FeatureTextR = styled(FeatureText)`
  /* align-items: end; */
  text-align: end;
`;

const FeatureTitle = styled.p`
  font-size: 1.75rem;
  line-height: 3rem;
  letter-spacing: 0.4rem;
`;

const FeatureDescription = styled.p`
  line-height: 1.5rem;
  letter-spacing: 0.1rem;
  color: #b5b5b5;
`;

const Login = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 90%;
  margin-top: 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(244, 243, 239, 0.5); */
  background: rgba(255, 255, 255, 0.9) center / cover no-repeat
    url('https://images.unsplash.com/photo-1530075568197-cbf64cf2cb64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80');

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const LoginTitle = styled.p`
  z-index: 1;
  font-weight: 500;
  font-size: 3.25rem;
  letter-spacing: 0.2rem;
`;

const LoginSubTitle = styled.p`
  z-index: 1;
  margin: 10px 0 40px;
  font-size: 1.25rem;
  letter-spacing: 0.4rem;
  line-height: 3rem;
`;

export default function Home() {
  const [isEntering, setIsEntering] = useState(false);
  const introRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleScroll() {
      if (!introRef.current) return;

      const introPosition = introRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (introPosition.top < windowHeight) setIsEntering(true);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [introRef.current]);

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

      <SmallContainer ref={introRef}>
        <Introduction>
          <IntroTitle isEntering={isEntering}>
            「春至陋室中，
            <br />
            &nbsp;&nbsp;&nbsp;無一物中萬物足。」
          </IntroTitle>
          <IntroDescription isEntering={isEntering}>
            在現代社會，人們的生活越來越複雜，JOGANDAN
            希望可以簡化用戶在管理自己物品遇到的困難，提供一個平台讓您可以輕鬆管理物品，並且可以設立目標檢視自己的成果，量化自己在斷捨離的成長，藉由對物品進行減法來為自己的生活加分。
          </IntroDescription>
        </Introduction>
      </SmallContainer>

      {/* <FeatureLoginContainer>
        <FeatureLoginWrapper>
          <Feature>
            <FeatureCard>
              <FeatureImage src={feature1} isEntering={isEntering} />
              <FeatureTextWrapper isEntering={isEntering}>
                <FeatureTitle>系統化物品管理</FeatureTitle>
                <FeatureDescription>
                  <p>單次 / 批量上傳</p>
                  <p>庫存管理</p>
                  <p>報表檢視</p>
                </FeatureDescription>
              </FeatureTextWrapper>
            </FeatureCard>
            <FeatureCardR>
              <FeatureImage src={feature2} isEntering={isEntering} />
              <FeatureTextWrapper isEntering={isEntering}>
                <FeatureTitle>量化自我成長</FeatureTitle>
                <FeatureDescription>
                  <p>自製夢想板</p>
                  <p>會員里程碑</p>
                  <p>成就回顧</p>
                </FeatureDescription>
              </FeatureTextWrapper>
            </FeatureCardR>
          </Feature>

          <Login>
            <LoginTitle>Join Jogandan</LoginTitle>
            <LoginSubTitle>立即開始您的簡單生活</LoginSubTitle>
            <Button
              width="30%"
              buttonType="normal"
              onClick={() => navigate('/signup')}
            >
              START YOUR JOURNEY
            </Button>
          </Login>
        </FeatureLoginWrapper>
      </FeatureLoginContainer> */}
      <Container>
        <Feature>
          <FeatureWrapperR>
            <FeatureTextR>
              <FeatureTitle>
                設計專屬夢想板
                <br />
                具現化斷捨離目標
              </FeatureTitle>
              <FeatureDescription>
                模板拼貼
                <br />
                自動儲存
                <br />
                彈性編輯功能
              </FeatureDescription>
            </FeatureTextR>
            <FeatureImage src={visionBoard} />
          </FeatureWrapperR>
          <FeatureWrapperL>
            <FeatureImage src={singleUpload} />
            <FeatureText>
              <FeatureTitle>
                單次/批次上傳
                <br />
                輕鬆建立資料庫
              </FeatureTitle>
              <FeatureDescription>
                支援拍照/照片上傳
                <br />
                一次性上傳多項物品
              </FeatureDescription>
            </FeatureText>
          </FeatureWrapperL>
        </Feature>
      </Container>

      <Container>
        <Feature>
          <FeatureWrapperR>
            <FeatureTextR>
              <FeatureTitle>
                直覺簡單的
                <br />
                物品管理介面
              </FeatureTitle>
              <FeatureDescription>
                檢視/編輯一頁完成
                <br />
                報表檢視物品數量/斷捨離成果
              </FeatureDescription>
            </FeatureTextR>
            <FeatureImage src={inventory} />
          </FeatureWrapperR>
          <FeatureWrapperL>
            <FeatureImage src={achievement} />
            <FeatureText>
              <FeatureTitle>
                斷捨離回顧
                <br />
                線上成果畫廊
              </FeatureTitle>
              <FeatureDescription>
                量化自我成長
                <br />
                提升斷捨離動力
              </FeatureDescription>
            </FeatureText>
          </FeatureWrapperL>
        </Feature>
      </Container>

      <SmallContainer>
        <Login>
          <LoginTitle>Join Jogandan</LoginTitle>
          <LoginSubTitle>立即開始您的簡單生活</LoginSubTitle>
          <Button
            width="30%"
            buttonType="normal"
            onClick={() => navigate('/signup')}
          >
            START YOUR JOURNEY
          </Button>
        </Login>
      </SmallContainer>
    </>
  );
}
