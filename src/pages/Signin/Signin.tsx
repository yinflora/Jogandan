import { useContext } from 'react';
import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
} from '../../utils/firebase';
import { AuthContext } from '../../context/authContext';
import { Navigate } from 'react-router-dom';

export default function Signin() {
  async function logGoogleUser() {
    const response = await signInWithGooglePopup();
    // console.log(response);
    // console.log(response.user);
    createUserDocumentFromAuth(response.user);
  }

  return (
    <>
      <h1>Welcome to JOGANDAN</h1>
      {/* <p>註冊</p>
      <label>信箱</label>
      <input type="text" />
      <label>密碼</label>
      <input type="text" />
      <p>登入</p>
      <label>信箱</label>
      <input type="text" />
      <label>密碼</label>
      <input type="text" /> */}
      <button onClick={logGoogleUser}>註冊/登入</button>
    </>
  );
}
