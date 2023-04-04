import { useState, createContext } from 'react';

const AuthContext = createContext({
  isLogin: false,
  // user: {},
  // loading: false,
  // jwtToken: '',
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);

  const login = () => {
    setIsLogin(false);
  };

  const logout = () => {
    setIsLogin(true);
  };

  return (
    <AuthContext.Provider
      // 記得提供 context 給 Provider
      value={{
        isLogin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
