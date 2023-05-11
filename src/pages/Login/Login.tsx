import { useContext, useEffect, useState } from 'react';
import { TfiArrowRight } from 'react-icons/tfi';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button/Button';
import { AuthContext } from '../../context/authContext';
import { nativeLogin } from '../../utils/firebase';
import background from './background.jpeg';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 55%;
  display: flex;
  width: 350px;
  height: 100vh;
  margin-top: 10%;
  flex-direction: column;
`;

const Title = styled.p`
  margin-bottom: 60px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  cursor: default;
`;

const SocialLogin = styled.button`
  position: relative;
  width: 100%;
  height: 45px;
  margin-bottom: 50px;
  flex-shrink: 0;
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
`;

const LastFieldWrapper = styled(FieldWrapper)`
  margin-bottom: 30px;
`;

const InputLabel = styled.label`
  font-size: 1rem;
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
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
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
  cursor: default;
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

const SignUpLink = styled.p`
  position: relative;
  margin: 0;
  color: #000;
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
  width: 100vw;
  height: 100vh;
  filter: contrast(120%);
  background: top / cover no-repeat url(${background});
`;

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const { signUp, login, previousPath } = useContext(AuthContext);

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (location.pathname === '/signup') setIsSignUp(true);
  }, [location]);

  async function onSubmit() {
    if (isSignUp) {
      await signUp(signUpForm);
    } else {
      nativeLogin(loginForm);
    }
    previousPath ? navigate(previousPath) : navigate('/');
  }

  return (
    <>
      <BackgroundImage />

      <Container>
        <Title>{isSignUp ? 'SIGN UP' : 'LOGIN'}</Title>
        <SocialLogin
          onClick={async () => {
            await login();
            previousPath && navigate(previousPath);
          }}
        >
          Google 登入
        </SocialLogin>
        {isSignUp && (
          <FieldWrapper>
            <InputLabel htmlFor="userName">用戶名稱</InputLabel>
            <InputWrapper>
              <Input
                type="text"
                id="userName"
                minLength={1}
                maxLength={30}
                value={signUpForm.name}
                onChange={(e) => {
                  isSignUp &&
                    setSignUpForm({
                      ...signUpForm,
                      name: e.target.value,
                    });
                }}
              />
            </InputWrapper>
            <PromptMessage>最多 30 字</PromptMessage>
          </FieldWrapper>
        )}
        <FieldWrapper>
          <InputLabel htmlFor="email">信箱</InputLabel>
          <InputWrapper>
            <Input
              type="email"
              id="email"
              value={isSignUp ? signUpForm.email : loginForm.email}
              onChange={(e) => {
                isSignUp
                  ? setSignUpForm({ ...signUpForm, email: e.target.value })
                  : setLoginForm({ ...loginForm, email: e.target.value });
              }}
            />
          </InputWrapper>
          <PromptMessage />
        </FieldWrapper>
        <LastFieldWrapper>
          <InputLabel htmlFor="password">密碼</InputLabel>
          <InputWrapper>
            <Input
              type="password"
              id="password"
              minLength={6}
              pattern="[a-zA-Z0-9]+"
              value={isSignUp ? signUpForm.password : loginForm.password}
              onChange={(e) => {
                isSignUp
                  ? setSignUpForm({ ...signUpForm, password: e.target.value })
                  : setLoginForm({ ...loginForm, password: e.target.value });
              }}
            />
          </InputWrapper>
          <PromptMessage>請輸入英文或數字做為密碼，最少 6 位</PromptMessage>
        </LastFieldWrapper>
        <Button
          buttonType="dark"
          width="100%"
          onClick={() => {
            onSubmit();
            isSignUp
              ? setSignUpForm({
                  name: '',
                  email: '',
                  password: '',
                })
              : setLoginForm({
                  email: '',
                  password: '',
                });
          }}
          disabled={Object.values(isSignUp ? signUpForm : loginForm).some(
            (form) => form === ''
          )}
        >
          SUBMIT
        </Button>
        {isSignUp ? (
          <SignUpPrompt>
            <SignUpMessage>已經有帳號了？</SignUpMessage>
            <StartButton>
              <SignUpLink
                onClick={() => {
                  navigate('/login');
                  setIsSignUp(false);
                }}
              >
                返回登入
              </SignUpLink>
              <TfiArrowRight className="arrow" />
            </StartButton>
          </SignUpPrompt>
        ) : (
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
