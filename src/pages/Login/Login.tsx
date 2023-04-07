import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

export default function Login() {
  const { isLogin, login, logout } = useContext(AuthContext);

  if (isLogin) {
    return (
      <>
        <h1>Welcome to JOGANDAN</h1>
        <button onClick={logout}>登出</button>
      </>
    );
  }
  return (
    <>
      <h1>Welcome to JOGANDAN</h1>
      <button onClick={login}>註冊/登入</button>
    </>
  );
}
