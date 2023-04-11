import { useState, createContext, useEffect } from 'react';
import { signin, signout, auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext({
  isLogin: false,
  loading: false,
  user: {},
  uid: null,
  // loading: false,
  // jwtToken: '',
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [uid, setUid] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser(user);
        setIsLogin(true);
        setUid(user.uid);
        setLoading(false);
      } else {
        setUser({});
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
    setUser({});
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
