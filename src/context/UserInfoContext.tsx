import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BoardData,
  Item,
  LoginErrorType,
  LoginForm,
  SignupErrorType,
  SignupForm,
  User,
} from '../types/types';
import { auth, getItems, getUser, nativeSignup } from '../utils/firebase';

import * as firebase from '../utils/firebase';
import { LoadingContext } from './LoadingContext';

type UserInfoContextType = {
  isLogin: boolean;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  isPopout: boolean;
  setIsPopout: React.Dispatch<React.SetStateAction<boolean>>;
  previousPath: string | null;
  // eslint-disable-next-line no-unused-vars
  nativeLogin: (form: LoginForm) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  signUp: (form: SignupForm) => Promise<void>;
  authErrorMessage: string | null;
};

const INITIAL_BOARD_DATA: BoardData = {
  background: '#F4F3EF',
  hoverCursor: 'move',
  objects: [],
  version: '',
};

const INITIAL_USER_DATA: User = {
  uid: '',
  name: '',
  email: '',
  image: '',
  level: '',
  visionBoard: {
    data: INITIAL_BOARD_DATA,
    isEdited: false,
    lastModified: null,
  },
};

export const UserInfoContext = createContext<UserInfoContextType>({
  isLogin: false,
  user: {
    uid: '',
    name: '',
    email: '',
    image: '',
    level: '',
    visionBoard: {
      data: INITIAL_BOARD_DATA,
      isEdited: false,
      lastModified: null,
    },
  },
  setUser: () => {},
  items: [],
  setItems: () => {},
  googleLogin: async () => {},
  logout: async () => {},
  isPopout: false,
  setIsPopout: () => {},
  previousPath: null,
  // eslint-disable-next-line no-unused-vars
  nativeLogin: async (form: LoginForm) => {},
  // eslint-disable-next-line no-unused-vars
  signUp: async (form) => {},
  authErrorMessage: null,
});

type UserInfoContextProviderProp = {
  children: React.ReactNode;
};

export const UserInfoContextProvider = ({
  children,
}: UserInfoContextProviderProp) => {
  const { setIsLoading } = useContext(LoadingContext);

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User>(INITIAL_USER_DATA);
  const [items, setItems] = useState<Item[]>([]);
  const [isPopout, setIsPopout] = useState<boolean>(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  async function getUserItems() {
    const itemList = (await getItems()) as Item[];
    setItems(itemList);
  }

  function handleLevel() {
    const declutteredItems = items.filter(
      (item: Item) => item.status === '已處理'
    ).length;

    if (declutteredItems >= 100) {
      return 'Master';
    } else if (declutteredItems < 100 && declutteredItems >= 50) {
      return 'Veteran';
    } else if (declutteredItems < 50 && declutteredItems >= 30) {
      return 'Seasoned';
    }
    return 'Rookie';
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo) {
        const userData = (await getUser()) as User;

        if (!userData) return;

        getUserItems();

        setUser({
          ...userData,
          level: handleLevel(),
        });
        setIsLogin(true);
        setTimeout(() => setIsLoading(false), 1500);

        if (
          location.pathname !== '/' &&
          location.pathname !== '/login' &&
          location.pathname !== '/signup'
        ) {
          setPreviousPath(location.pathname);
        }
      } else {
        setUser(INITIAL_USER_DATA);
        setIsLogin(false);
        setTimeout(() => setIsLoading(false), 1500);

        if (
          location.pathname !== '/' &&
          location.pathname !== '/login' &&
          location.pathname !== '/signup'
        ) {
          setPreviousPath(location.pathname);
          navigate('/login');
        }
      }
    });
  }, []);

  const googleLogin = async () => {
    const userData = (await firebase.googleLogin()) as User;

    if (!userData) return;

    setUser({
      ...userData,
      level: handleLevel(),
    });
    setIsLogin(true);
    setTimeout(() => setIsLoading(false), 1500);
    previousPath ? navigate(previousPath) : navigate('/');
  };

  const logout = async () => {
    await firebase.logout();
    setUser(INITIAL_USER_DATA);
    setIsLogin(false);
    setTimeout(() => setIsLoading(false), 1500);
    navigate('/login');
  };

  const nativeLogin = async (form: LoginForm) => {
    try {
      await firebase.nativeLogin(form);
      previousPath ? navigate(previousPath) : navigate('/');
    } catch (error) {
      const errorMessages: Record<string, string> = {
        'auth/user-not-found': '電子信箱不存在',
        'auth/wrong-password': '密碼錯誤',
        'auth/invalid-email': '信箱格式不正確',
        default: '登入失敗，請重試',
      };
      setAuthErrorMessage(
        errorMessages[(error as LoginErrorType).code || 'default']
      );
      setIsPopout(true);
    }
  };

  const signUp = async (form: SignupForm) => {
    try {
      if (!form) return;

      const userData = (await nativeSignup(form)) as User;

      setUser({
        ...userData,
        level: handleLevel(),
      });
      setIsLogin(true);
      setAuthErrorMessage(null);
      setTimeout(() => setIsLoading(false), 1500);
      previousPath ? navigate(previousPath) : navigate('/');
    } catch (error) {
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': '電子信箱已存在',
        'auth/weak-password': '密碼應至少 6 位',
        'auth/invalid-email': '信箱格式不正確',
        default: '註冊失敗，請重試',
      };
      setAuthErrorMessage(
        errorMessages[(error as SignupErrorType).code || 'default']
      );
      setIsPopout(true);
    }
  };

  return (
    <UserInfoContext.Provider
      value={{
        isLogin,
        user,
        setUser,
        items,
        setItems,
        googleLogin,
        logout,
        isPopout,
        setIsPopout,
        previousPath,
        nativeLogin,
        signUp,
        authErrorMessage,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoContext;
