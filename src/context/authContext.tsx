import React, { useState, createContext, useEffect } from 'react';
import { signin, signout, auth, getUser, getItems } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

// type User = {
//   uid: string;
//   displayName: string | null;
//   email: string | null;
//   photoURL: string | null;
// };

type User = {
  uid: string;
  name: string;
  email: string;
  image: string;
};

type Item = {
  id: string;
  name: string;
  status: string;
  category: string;
  created: Timestamp;
  processedDate: string;
  description: string;
  images: string[];
};

type Items = Item[];

type AuthContextType = {
  isLogin: boolean;
  loading: boolean;
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  uid: string | null;
  items: Items | null;
  lastLoginInTime: string | null | undefined;
  login: () => Promise<void>;
  logout: () => void;
  isPopout: boolean;
  setIsPopout: React.Dispatch<React.SetStateAction<boolean>>;
  previousPath: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  loading: false,
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  user: {
    uid: '',
    name: '',
    email: '',
    image: '',
  },
  uid: null,
  items: null,
  lastLoginInTime: null,
  login: async () => {},
  logout: () => {},
  isPopout: false,
  setIsPopout: () => {},
  previousPath: null,
});
//!Fixme

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  // const [user, setUser] = useState<User>({
  //   uid: '',
  //   displayName: null,
  //   email: null,
  //   photoURL: null,
  // });
  const [user, setUser] = useState<User>({
    uid: '',
    name: '',
    email: '',
    image: '',
  });
  const [uid, setUid] = useState<string | null>(null);
  const [lastLoginInTime, setLastLoginInTime] = useState<
    string | null | undefined
  >(null);
  const [items, setItems] = useState<Items | null>(null);
  const [isPopout, setIsPopout] = useState<boolean>(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  async function getUserItems(id: string) {
    const itemList = await getItems(id);
    setItems(itemList);
  }

  useEffect(() => {
    if (!uid && location.pathname !== '/') {
      setPreviousPath(location.pathname);
      navigate('/login');
    }
  }, [uid]);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (userInfo) => {
  //     if (userInfo) {
  //       console.log(userInfo);
  //       setUser({
  //         uid: userInfo.uid,
  //         displayName: userInfo.displayName,
  //         email: userInfo.email,
  //         photoURL: userInfo.photoURL,
  //       });
  //       setIsLogin(true);
  //       getUserItems(userInfo.uid);
  //       setUid(userInfo.uid);
  //       setLastLoginInTime(userInfo.metadata.lastSignInTime);
  //       setLoading(false);
  //     } else {
  //       setUser({
  //         uid: '',
  //         displayName: null,
  //         email: null,
  //         photoURL: null,
  //       });
  //       setIsLogin(false);
  //       setUid(null);
  //       setLoading(false);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo) {
        const userData = await getUser(userInfo.uid);

        if (!userData) return;
        // console.log(userInfo);
        setUser({
          uid: userData.uid,
          name: userData.name,
          email: userData.email,
          image: userData.image,
        });
        setIsLogin(true);
        getUserItems(userData.uid);
        setUid(userData.uid);
        setLastLoginInTime(userInfo.metadata.lastSignInTime);
        setLoading(false);
      } else {
        setUser({
          uid: '',
          name: '',
          email: '',
          image: '',
        });
        setIsLogin(false);
        setUid(null);
        setLoading(false);
      }
    });
  }, []);

  // const login = async () => {
  //   const response = await signin();
  //   setLastLoginInTime(response.metadata.lastSignInTime);
  //   setUser(response);
  //   setIsLogin(true);
  //   setLoading(false);
  // };

  const login = async () => {
    const userInfo = await signin();
    // setLastLoginInTime(response.metadata.lastSignInTime);

    if (!userInfo) return;

    setUser({
      uid: userInfo.uid,
      name: userInfo.name,
      email: userInfo.email,
      image: userInfo.image,
    });
    setIsLogin(true);
    setLoading(false);
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
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        loading,
        // setLoading,
        user,
        uid,
        items,
        lastLoginInTime,
        login,
        logout,
        isPopout,
        setIsPopout,
        previousPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
