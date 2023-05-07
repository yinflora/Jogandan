import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components/macro';
import { useNavigate } from 'react-router-dom';

import background from './background.jpeg';
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

const IntroTitle = styled.p`
  font-size: 2rem;
  line-height: 3rem;
  letter-spacing: 0.4rem;
`;

const IntroDescription = styled.p`
  max-width: 50%;
  margin-left: 20px;
  line-height: 2rem;
  letter-spacing: 0.1rem;
`;

const Introduction = styled.div<{ entering: string | null }>`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10% 5%;
  flex-direction: column;
  gap: 10%;

  ${({ entering }) =>
    entering === 'intro' &&
    css`
      & ${IntroTitle} {
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: 0.5s;
      }

      & ${IntroDescription} {
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: 1s;
      }
    `};
`;

const Feature = styled.div<{ entering: string | null }>`
  width: 100%;
  height: 100%;

  ${({ entering }) => {
    if (entering === 'feature1') {
      return css`
        & .visionBoard {
          & > img {
            opacity: 0;
            animation: ${fadeIn} 1s ease-in-out forwards;
            /* animation-delay: 1.5s; */
            animation-delay: 0.5s;
          }

          & > div {
            opacity: 0;
            animation: ${fadeIn} 1s ease-in-out forwards;
            /* animation-delay: 2s; */
            animation-delay: 1s;
          }
        }

        & .upload {
          & > img {
            opacity: 0;
            animation: ${fadeIn} 1s ease-in-out forwards;
            /* animation-delay: 2.5s; */
            animation-delay: 1.5s;
          }

          & > div {
            opacity: 0;
            animation: ${fadeIn} 1s ease-in-out forwards;
            /* animation-delay: 3s; */
            animation-delay: 2s;
          }
        }
      `;
    } else if (entering === 'feature2') {
      return css`
        & .inventory {
          & > img {
            opacity: 0;
            animation: ${fadeIn} 1s ease-in-out forwards;
            /* animation-delay: 1.5s; */
            animation-delay: 0.5s;
          }

          & > div {
            opacity: 0;
            animation: ${fadeIn} 1s ease-in-out forwards;
            /* animation-delay: 2s; */
            animation-delay: 1s;
          }
        }

        & .achievement {
          & > img {
            opacity: 0;
            animation: ${fadeIn} 1s ease-in-out forwards;
            /* animation-delay: 2.5s; */
            animation-delay: 1.5s;
          }

          & > div {
            opacity: 0;
            animation: ${fadeIn} 1s ease-in-out forwards;
            /* animation-delay: 3s; */
            animation-delay: 2s;
          }
        }
      `;
    }
  }};
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
  const [entering, setEntering] = useState<string | null>(null);

  const introRef = useRef<HTMLDivElement | null>(null);
  const feature1Ref = useRef<HTMLDivElement | null>(null);
  const feature2Ref = useRef<HTMLDivElement | null>(null);
  const loginRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleScroll() {
      if (
        !introRef.current ||
        !feature1Ref.current ||
        !feature2Ref.current ||
        !loginRef.current
      )
        return;

      const introPosition = introRef.current.getBoundingClientRect();
      const feature1Position = feature1Ref.current.getBoundingClientRect();
      const feature2Position = feature2Ref.current.getBoundingClientRect();
      const loginPosition = loginRef.current.getBoundingClientRect();

      const windowHeight = window.innerHeight;

      if (introPosition.top < windowHeight) setEntering('intro');
      if (feature1Position.top < windowHeight) setEntering('feature1');
      if (feature2Position.top < windowHeight) setEntering('feature2');
      if (loginPosition.top < windowHeight) setEntering('login');
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
            onClick={() => {
              introRef.current &&
                introRef.current.scrollIntoView({ behavior: 'smooth' });
              setEntering('intro');
            }}
          >
            <Chevron rotateDeg={180} color="#b5b5b5" />
          </DownBtn>
        </Main>
      </Container>

      <SmallContainer ref={introRef}>
        <Introduction entering={entering}>
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
      </SmallContainer>

      <Container ref={feature1Ref}>
        <Feature entering={entering}>
          <FeatureWrapperR className="visionBoard">
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
          <FeatureWrapperL className="upload">
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

      <Container ref={feature2Ref}>
        <Feature entering={entering}>
          <FeatureWrapperR className="inventory">
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
          <FeatureWrapperL className="achievement">
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

      <SmallContainer ref={loginRef}>
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
