import { onAuthStateChanged } from 'firebase/auth';
// import { Timestamp } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Item } from '../types/types';
import {
  auth,
  getItems,
  getUser,
  nativeSignup,
  signin,
  signout,
} from '../utils/firebase';
import { LoadingContext } from './loadingContext';

type User = {
  uid: string;
  name: string;
  email: string;
  image: string;
};

// type Item = {
//   id: string;
//   name: string;
//   status: string;
//   category: string;
//   created: Timestamp;
//   processedDate: string;
//   description: string;
//   images: string[];
// };

// type Items = Item[];

type Form = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  isLogin: boolean;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  uid: string | null;
  items: Item[] | null;
  login: () => Promise<void>;
  logout: () => void;
  isPopout: boolean;
  setIsPopout: React.Dispatch<React.SetStateAction<boolean>>;
  previousPath: string | null;
  // eslint-disable-next-line no-unused-vars
  signUp: (form: Form) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  user: {
    uid: '',
    name: '',
    email: '',
    image: '',
  },
  setUser: () => {},
  uid: null,
  items: null,
  login: async () => {},
  logout: () => {},
  isPopout: false,
  setIsPopout: () => {},
  previousPath: null,
  // eslint-disable-next-line no-unused-vars
  signUp: async (form: Form) => {},
});

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const { setIsLoading } = useContext(LoadingContext);

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    uid: '',
    name: '',
    email: '',
    image: '',
  });
  const [uid, setUid] = useState<string | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [isPopout, setIsPopout] = useState<boolean>(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  async function getUserItems(id: string) {
    const itemList = await getItems(id);
    setItems(itemList);
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo) {
        const userData = await getUser();

        if (!userData) return;

        setUser({
          uid: userData.uid,
          name: userData.name,
          email: userData.email,
          image: userData.image,
        });
        setIsLogin(true);
        getUserItems(userData.uid);
        setUid(userData.uid);
        setTimeout(() => setIsLoading(false), 1500);

        if (
          location.pathname !== '/' &&
          location.pathname !== '/login' &&
          location.pathname !== '/signup'
        ) {
          setPreviousPath(location.pathname);
        }
      } else {
        setUser({
          uid: '',
          name: '',
          email: '',
          image: '',
        });
        setIsLogin(false);
        setUid(null);
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

  const login = async () => {
    const userInfo = await signin();

    if (!userInfo) return;

    setUser({
      uid: userInfo.uid,
      name: userInfo.name,
      email: userInfo.email,
      image: userInfo.image,
    });
    setIsLogin(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const logout = () => {
    signout();
    setUser({
      uid: '',
      name: '',
      email: '',
      image: '',
    });
    setIsLogin(false);
    setTimeout(() => setIsLoading(false), 1500);
    navigate('/login');
  };

  const signUp = async (form: Form) => {
    if (!form) return;

    const userData = await nativeSignup(form);

    if (!userData) return;

    setUser({
      uid: userData.uid,
      name: userData.name,
      email: userData.email,
      image: userData.image,
    });
    setUid(userData.uid);
    setIsLogin(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        user,
        setUser,
        uid,
        items,
        login,
        logout,
        isPopout,
        setIsPopout,
        previousPath,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
