import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

export default function Profile() {
  return (
    <>
      <h1>Welcome to JOGANDAN</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </>
  );
}
