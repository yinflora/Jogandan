import { useState, createContext } from 'react';
import { signin, signout } from '../utils/firebase';

export const AuthContext = createContext({
  isLogin: false,
  user: {},
  // loading: false,
  // jwtToken: '',
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});

  const login = () => {
    setUser(() => signin());
    setIsLogin(true);
  };

  const logout = () => {
    signout();
    setUser({});
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider
      // 記得提供 context 給 Provider
      value={{
        isLogin,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
