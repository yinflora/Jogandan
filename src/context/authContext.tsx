import React, { useState, createContext, useEffect } from 'react';
import { signin, signout, auth, getItems } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
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
};

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  loading: false,
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  user: {
    uid: '',
    displayName: null,
    email: null,
    photoURL: null,
  },
  uid: null,
  items: null,
  lastLoginInTime: null,
  login: async () => {},
  logout: () => {},
});
//!Fixme

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>({
    uid: '',
    displayName: null,
    email: null,
    photoURL: null,
  });
  const [uid, setUid] = useState<string | null>(null);
  const [lastLoginInTime, setLastLoginInTime] = useState<
    string | null | undefined
  >(null);
  const [items, setItems] = useState<Items | null>(null);

  async function getUserItems(id: string) {
    const itemList = await getItems(id);
    setItems(itemList);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        console.log(userInfo);
        setUser({
          uid: userInfo.uid,
          displayName: userInfo.displayName,
          email: userInfo.email,
          photoURL: userInfo.photoURL,
        });
        setIsLogin(true);
        getUserItems(userInfo.uid);
        setUid(userInfo.uid);
        setLastLoginInTime(userInfo.metadata.lastSignInTime);
        setLoading(false);
      } else {
        setUser({
          uid: '',
          displayName: null,
          email: null,
          photoURL: null,
        });
        setIsLogin(false);
        setUid(null);
        setLoading(false);
      }
    });
  }, []);

  const login = async () => {
    const response = await signin();
    setLastLoginInTime(response.metadata.lastSignInTime);
    setUser(response);
    setIsLogin(true);
    setLoading(false);
  };

  const logout = () => {
    signout();
    setUser({
      uid: '',
      displayName: null,
      email: null,
      photoURL: null,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
