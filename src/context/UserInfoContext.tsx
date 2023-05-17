// Solve TypeScript and ESlint conflicts
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BoardDataType,
  ItemType,
  LoginErrorType,
  LoginFormType,
  SignupErrorType,
  SignupFormType,
  UserType,
} from '../types/types';
import * as firebase from '../utils/firebase';
import { LoadingContext } from './LoadingContext';

type UserInfoContextType = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  items: ItemType[];
  setItems: React.Dispatch<React.SetStateAction<ItemType[]>>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  isPopout: boolean;
  setIsPopout: React.Dispatch<React.SetStateAction<boolean>>;
  previousPath: string | null;
  nativeLogin: (form: LoginFormType) => Promise<void>;
  signUp: (form: SignupFormType) => Promise<void>;
  authErrorMessage: string | null;
};
type UserInfoContextProviderProp = {
  children: React.ReactNode;
};

const INITIAL_BOARD_DATA: BoardDataType = {
  background: '#F4F3EF',
  hoverCursor: 'move',
  objects: [],
  version: '',
};

const INITIAL_USER_DATA: UserType = {
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
  nativeLogin: async (form) => {},
  signUp: async (form) => {},
  authErrorMessage: null,
});

export const UserInfoContextProvider = ({
  children,
}: UserInfoContextProviderProp) => {
  const { setIsLoading } = useContext(LoadingContext);

  const [user, setUser] = useState<UserType>(INITIAL_USER_DATA);
  const [items, setItems] = useState<ItemType[]>([]);
  const [isPopout, setIsPopout] = useState<boolean>(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const getUserItems = async () => {
    const itemList = (await firebase.getItems()) as ItemType[];
    setItems(itemList);
  };

  const handleLevel = () => {
    const declutteredItems = items.filter(
      (item: ItemType) => item.status === '已處理'
    ).length;

    if (declutteredItems >= 100) {
      return 'Master';
    } else if (declutteredItems < 100 && declutteredItems >= 50) {
      return 'Veteran';
    } else if (declutteredItems < 50 && declutteredItems >= 30) {
      return 'Seasoned';
    }
    return 'Rookie';
  };

  useEffect(() => {
    onAuthStateChanged(firebase.auth, async (userInfo) => {
      if (userInfo) {
        const userData = (await firebase.getUser()) as UserType;

        if (!userData) return;

        getUserItems();

        setUser({
          ...userData,
          level: handleLevel(),
        });
        setTimeout(() => setIsLoading(false), 1500);

        if (
          location.pathname !== '/' &&
          location.pathname !== '/login' &&
          location.pathname !== '/sign-up'
        ) {
          setPreviousPath(location.pathname);
        }
      } else {
        setUser(INITIAL_USER_DATA);
        setTimeout(() => setIsLoading(false), 1500);

        if (
          location.pathname !== '/' &&
          location.pathname !== '/login' &&
          location.pathname !== '/sign-up'
        ) {
          setPreviousPath(location.pathname);
          navigate('/login');
        }
      }
    });
  }, []);

  const googleLogin = async () => {
    const userData = (await firebase.googleLogin()) as UserType;

    if (!userData) return;

    setUser({
      ...userData,
      level: handleLevel(),
    });
    setTimeout(() => setIsLoading(false), 1500);
    previousPath ? navigate(previousPath) : navigate('/');
  };

  const logout = async () => {
    await firebase.logout();
    setUser(INITIAL_USER_DATA);
    setTimeout(() => setIsLoading(false), 1500);
    navigate('/login');
  };

  const nativeLogin = async (form: LoginFormType) => {
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

  const signUp = async (form: SignupFormType) => {
    try {
      if (!form) return;

      const userData = (await firebase.nativeSignup(form)) as UserType;

      setUser({
        ...userData,
        level: handleLevel(),
      });
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
