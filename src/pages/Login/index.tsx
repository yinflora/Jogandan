import React, { useContext, useEffect, useState } from 'react';
import { TfiArrowRight } from 'react-icons/tfi';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Alert from '../../components/Alert';
import Button from '../../components/Button/Button';
import { UserInfoContext } from '../../context/UserInfoContext';
import { LoginFormType, SignupFormType } from '../../types/types';
import background from './background.jpeg';

const fields = [
  {
    id: 'name',
    label: '用戶名稱',
    type: 'text',
    maxLength: 30,
    signUpOnly: true,
  },
  {
    id: 'email',
    label: '信箱',
    type: 'email',
    signUpOnly: false,
  },
  {
    id: 'password',
    label: '密碼',
    type: 'password',
    minLength: 6,
    signUpOnly: false,
  },
];

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

const FieldWrapper = styled.div<{ $isVisible: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  flex-direction: column;
  gap: 5px;
`;

const ButtonWrapper = styled.div`
  margin-top: 30px;
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

const RedirectPrompt = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const RedirectMessage = styled.span`
  font-size: 1rem;
  cursor: default;
`;

const RedirectLink = styled.p`
  position: relative;
  margin: 0;
  color: #000;
`;

const RedirectButton = styled.button`
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

  &:hover ${RedirectLink} {
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

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { signUp, nativeLogin, googleLogin, authErrorMessage, isPopout } =
    useContext(UserInfoContext);

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [signUpForm, setSignUpForm] = useState<SignupFormType>({
    name: '',
    email: '',
    password: '',
  });
  const [loginForm, setLoginForm] = useState<LoginFormType>({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (location.pathname === '/sign-up') setIsSignUp(true);
    if (location.pathname === '/login') setIsSignUp(false);
    if (!authErrorMessage) {
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
    }
  }, [location, authErrorMessage]);

  const onSubmit = async () => {
    if (isSignUp) {
      await signUp(signUpForm);
    } else {
      await nativeLogin(loginForm);
    }
  };

  const handleEnterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    isSignUp
      ? setSignUpForm({
          ...signUpForm,
          [e.target.name]: e.target.value,
        })
      : setLoginForm({
          ...loginForm,
          [e.target.name]: e.target.value,
        });
  };

  return (
    <>
      {isPopout && authErrorMessage && (
        <Alert
          type="sad"
          title={authErrorMessage}
          buttonConfig={[
            {
              buttonType: 'dark',
              value: '重新嘗試',
              // eslint-disable-next-line no-empty-function
              action: () => {},
            },
          ]}
        />
      )}

      <BackgroundImage />

      <Container>
        <Title>{isSignUp ? 'SIGN UP' : 'LOGIN'}</Title>
        <SocialLogin onClick={async () => await googleLogin()}>
          Google 登入
        </SocialLogin>

        {fields.map((field) => (
          <FieldWrapper
            key={field.id}
            $isVisible={isSignUp || !field.signUpOnly}
          >
            <InputLabel htmlFor={field.id}>{field.label}</InputLabel>
            <InputWrapper>
              <Input
                type={field.type}
                id={field.id}
                name={field.id}
                minLength={field.minLength}
                maxLength={field.maxLength}
                value={isSignUp ? signUpForm[field.id] : loginForm[field.id]}
                onChange={handleEnterInput}
              />
            </InputWrapper>
            <PromptMessage>
              {field.maxLength && `最多 ${field.maxLength} 字`}
              {field.minLength && `至少 ${field.minLength} 位`}
            </PromptMessage>
          </FieldWrapper>
        ))}

        <ButtonWrapper>
          <Button
            buttonType="dark"
            width="100%"
            onClick={() => onSubmit()}
            disabled={Object.values(isSignUp ? signUpForm : loginForm).some(
              (form) => form === ''
            )}
          >
            SUBMIT
          </Button>
        </ButtonWrapper>

        <RedirectPrompt>
          <RedirectMessage>
            {isSignUp ? '已經有帳號了？' : '還沒有帳號？'}
          </RedirectMessage>
          <RedirectButton>
            <RedirectLink
              onClick={() => navigate(isSignUp ? '/login' : '/sign-up')}
            >
              {isSignUp ? '返回登入' : '立即註冊'}
            </RedirectLink>
            <TfiArrowRight className="arrow" />
          </RedirectButton>
        </RedirectPrompt>
      </Container>
    </>
  );
};

export default Login;
