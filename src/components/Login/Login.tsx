import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

export default function Login() {
  const { isLogin, login, logout } = useContext(AuthContext);

  if (isLogin) {
    return <button onClick={logout}>LOGOUT</button>;
  }
  return <button onClick={login}>LOGIN</button>;
}
