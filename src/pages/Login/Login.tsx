import styled from 'styled-components';
import Button from '../../components/Button/Button';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import background from './background.jpeg';
import { TfiArrowRight } from 'react-icons/tfi';

import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

// export default function Login() {
//   const { isLogin, login, logout } = useContext(AuthContext);

//   if (isLogin) {
//     return (
//       <>
//         <h1>Welcome to JOGANDAN</h1>
//         <button onClick={logout}>登出</button>
//       </>
//     );
//   }
//   return (
//     <>
//       <h1>Welcome to JOGANDAN</h1>
//       <button onClick={login}>註冊/登入</button>
//     </>
//   );
// }

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 55%;
  display: flex;
  width: 350px;
  height: 100vh;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.p`
  margin-bottom: 60px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  cursor: default;
`;

// const SubTitle = styled.p`
//   margin-bottom: 60px;
//   font-size: 1rem;
//   letter-spacing: 0.1rem;
// `;

const SocialLogin = styled.button`
  position: relative;
  width: 100%;
  height: 45px;
  margin-bottom: 60px;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  border: 1px solid #000;

  &:hover {
    cursor: pointer;
    color: #fff;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;
    left: 0;
    background-color: #000;
    opacity: 0;
    z-index: -1;
    transition: all 0.5s;
  }

  &:hover::before {
    left: 0;
    right: 0;
    opacity: 1;
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  /* &:last-of-type {
    margin-bottom: 60px;
  } */
`;

const InputLabel = styled.label`
  font-size: 1rem;
  /* font-weight: 500; */
  letter-spacing: 0.1rem;
  color: #b5b4b4;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #000;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;
    left: 0;
    background-color: rgba(157, 157, 157, 0.1);
    border-bottom: 1px solid #000;
    opacity: 0;
    transition: all 0.5s;
  }

  &:focus-within::before {
    left: 0;
    right: 0;
    opacity: 1;
  }

  /* &:focus-within {
    border: none;
  } */
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  /* padding-left: 5px; */
  overflow-x: scroll;
  font-family: 'TT Norms Pro', sans-serif;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  line-height: 100%;
  color: #000;
`;

const PromptMessage = styled.p`
  width: 100%;
  height: 20px;
  padding-top: 5px;
  text-align: end;
  font-size: 0.75rem;
  color: #8d9ca4;
`;

const SignUpPrompt = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const SignUpMessage = styled.span`
  font-size: 1rem;
  cursor: default;
`;

// const SignUpLink = styled.span`
//   position: relative;
//   font-size: 1rem;
//   cursor: pointer;
// `;

const SignUpLink = styled.p`
  position: relative;
  margin: 0;
  color: #000;

  /* &::before {
    position: absolute;
    content: '立即註冊';
    width: 0%;
    inset: 0;
    color: #8d9ca4;
    overflow: hidden;
    transition: 0.3s ease-out;
  } */
`;

const StartButton = styled.button`
  position: relative;
  display: flex;
  width: fit-content;
  padding: 0;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;

  &::after {
    position: absolute;
    content: '';
    width: 0;
    left: 0;
    bottom: -5px;
    background: #8d9ca4;
    height: 1px;
    transition: 0.3s ease-out;
  }
  &:hover::after {
    width: 100%;
  }
  /* &:hover ${SignUpLink}::before {
    width: 100%;
  } */
  &:hover ${SignUpLink} {
    color: #8d9ca4;
  }
  &:hover .arrow {
    transform: translateX(4px);
    color: #8d9ca4;
  }

  & .arrow {
    width: 15px;
    height: 15px;
    stroke-width: 0.5px;
    transition: 0.2s;
    transition-delay: 0.2s;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  z-index: -1;
  /* opacity: 0.7; */
  width: 100vw;
  height: 100vh;
  filter: contrast(120%);
  background: top / cover no-repeat url(${background});
`;

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  console.log(setIsSignUp);
  // function validatePassword(event) {
  //   const password = event.target.value;
  //   const regex = /^[a-zA-Z0-9]+$/;

  //   if (password.length < 6 || password.length > 16) {
  //     alert('Password must be between 6 and 16 characters long.');
  //   } else if (!regex.test(password)) {
  //     alert('Password can only contain letters and numbers.');
  //   }
  // }

  useEffect(() => {
    if (location.pathname === '/signup') setIsSignUp(true);
  }, [location]);

  return (
    <>
      <BackgroundImage />

      <Container>
        <Title>{isSignUp ? 'SIGN UP' : 'LOGIN'}</Title>
        {/* <SubTitle>請先登入後再開始使用</SubTitle> */}
        <SocialLogin onClick={login}>Google 登入</SocialLogin>
        {isSignUp && (
          <FieldWrapper>
            <InputLabel htmlFor="userName">用戶名稱</InputLabel>
            <InputWrapper>
              <Input type="text" id="userName" minLength={1} maxLength={30} />
            </InputWrapper>
            <PromptMessage>密碼需要超過6個字</PromptMessage>
          </FieldWrapper>
        )}
        <FieldWrapper>
          <InputLabel htmlFor="email">信箱</InputLabel>
          <InputWrapper>
            <Input type="email" id="email" />
          </InputWrapper>
          <PromptMessage>密碼需要超過6個字</PromptMessage>
        </FieldWrapper>
        <FieldWrapper style={{ marginBottom: 30 }}>
          <InputLabel htmlFor="password">密碼</InputLabel>
          <InputWrapper>
            <Input
              type="password"
              id="password"
              minLength={6}
              maxLength={16}
              pattern="[a-zA-Z0-9]+"
            />
            {/* <input type="password" onBlur={validatePassword} onChange={validatePassword} /> */}
          </InputWrapper>
          <PromptMessage>密碼需要超過 6 個字</PromptMessage>
        </FieldWrapper>
        <Button buttonType="dark" width="100%">
          SUBMIT
        </Button>
        {!isSignUp && (
          <SignUpPrompt>
            <SignUpMessage>還沒有帳號？</SignUpMessage>
            <StartButton>
              <SignUpLink onClick={() => navigate('/signup')}>
                立即註冊
              </SignUpLink>
              <TfiArrowRight className="arrow" />
            </StartButton>
          </SignUpPrompt>
        )}
      </Container>
    </>
  );
}
