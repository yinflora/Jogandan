import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BoardData, Item, SignupForm, User } from '../types/types';
import {
  auth,
  getItems,
  getUser,
  nativeSignup,
  signin,
  signout,
} from '../utils/firebase';
import { LoadingContext } from './LoadingContext';

type UserInfoContextType = {
  isLogin: boolean;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  uid: string | null;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  login: () => Promise<void>;
  logout: () => void;
  isPopout: boolean;
  setIsPopout: React.Dispatch<React.SetStateAction<boolean>>;
  previousPath: string | null;
  // eslint-disable-next-line no-unused-vars
  signUp: (form: SignupForm) => Promise<void>;
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
  uid: null,
  items: [],
  setItems: () => {},
  login: async () => {},
  logout: () => {},
  isPopout: false,
  setIsPopout: () => {},
  previousPath: null,
  // eslint-disable-next-line no-unused-vars
  signUp: async (form) => {},
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
  const [uid, setUid] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isPopout, setIsPopout] = useState<boolean>(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

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
        setUser(INITIAL_USER_DATA);
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
    const userData = (await signin()) as User;

    if (!userData) return;

    setUser({
      ...userData,
      level: handleLevel(),
    });
    setIsLogin(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const logout = () => {
    signout();
    setUser(INITIAL_USER_DATA);
    setIsLogin(false);
    setTimeout(() => setIsLoading(false), 1500);
    navigate('/login');
  };

  const signUp = async (form: SignupForm) => {
    if (!form) return;

    const userData = (await nativeSignup(form)) as User;

    if (!userData) return;

    setUser({
      ...userData,
      level: handleLevel(),
    });
    setUid(userData.uid);
    setIsLogin(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <UserInfoContext.Provider
      value={{
        isLogin,
        user,
        setUser,
        uid,
        items,
        setItems,
        login,
        logout,
        isPopout,
        setIsPopout,
        previousPath,
        signUp,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoContext;
