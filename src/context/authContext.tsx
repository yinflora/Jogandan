import React, { useState, createContext, useEffect } from 'react';
import { signin, signout, auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

type AuthContextType = {
  isLogin: boolean;
  loading: boolean;
  user: User;
  uid: string | null;
  login: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  loading: false,
  user: {
    uid: '',
    displayName: null,
    email: null,
    photoURL: null,
  },
  uid: null,
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
        setUid(userInfo.uid);
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
        user,
        uid,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
