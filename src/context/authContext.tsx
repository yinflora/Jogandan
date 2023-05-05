import React, { useState, createContext, useEffect } from 'react';
import {
  signin,
  signout,
  auth,
  getUser,
  getItems,
  nativeSignup,
} from '../utils/firebase';
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

type Form = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  isLogin: boolean;
  loading: boolean;
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  uid: string | null;
  items: Items | null;
  lastLoginInTime: string | null | undefined;
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
  loading: false,
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  user: {
    uid: '',
    name: '',
    email: '',
    image: '',
  },
  setUser: () => {},
  uid: null,
  items: null,
  lastLoginInTime: null,
  login: async () => {},
  logout: () => {},
  isPopout: false,
  setIsPopout: () => {},
  previousPath: null,
  // eslint-disable-next-line no-unused-vars
  signUp: async (form: Form) => {},
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
  // const [errorMessage, setErrorMessage] =useState<string | null>('');

  const navigate = useNavigate();
  const location = useLocation();

  async function getUserItems(id: string) {
    const itemList = await getItems(id);
    setItems(itemList);
  }

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
        setLoading(false);

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

  // useEffect(() => {
  //   function checkIfNewUser() {
  //     // const auth = await getAuth();

  //     if (uid) return;

  //     console.log(auth, auth.currentUser);

  //     if (
  //       location.pathname !== '/' &&
  //       location.pathname !== '/login' &&
  //       location.pathname !== '/signup'
  //     ) {
  //       setPreviousPath(location.pathname);
  //       !auth.currentUser && navigate('/login');
  //       // console.log('氣鼠');
  //     }
  //   }
  //   checkIfNewUser();
  //   // if (!auth) return;
  //   // if (auth.currentUser && uid) return;

  //   // if (
  //   //   location.pathname !== '/' &&
  //   //   location.pathname !== '/login' &&
  //   //   location.pathname !== '/signup'
  //   // ) {
  //   //   setPreviousPath(location.pathname);
  //   //   navigate('/login');
  //   //   console.log('氣鼠');
  //   // }
  // }, [uid]);

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
    // navigate('/');
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
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        loading,
        // setLoading,
        user,
        setUser,
        uid,
        items,
        lastLoginInTime,
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
