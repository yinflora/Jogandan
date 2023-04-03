// import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui';
// import 'firebaseui/dist/firebaseui.css';

// import { getAuth, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';

// const auth = getAuth();
// auth.languageCode = 'it';
// getRedirectResult(auth)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access Google APIs.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;

//     // The signed-in user info.
//     const user = result.user;
//     // IdP data available using getAdditionalUserInfo(result)
//     // ...
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.customData.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });
// const ui = new firebaseui.auth.AuthUI(firebase.auth());

// const uiConfig = {
//   callbacks: {
//     signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//       // User successfully signed in.
//       // Return type determines whether we continue the redirect automatically
//       // or whether we leave that to developer to handle.
//       return true;
//     },
//     uiShown: function () {
//       // The widget is rendered.
//       // Hide the loader.
//       document.getElementById('loader').style.display = 'none';
//     },
//   },
//   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//   signInFlow: 'popup',
//   signInSuccessUrl: '<url-to-redirect-to-on-success>',
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//     // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     // firebase.auth.GithubAuthProvider.PROVIDER_ID,
//     // firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     // firebase.auth.PhoneAuthProvider.PROVIDER_ID
//   ],
//   // Terms of service url.
//   tosUrl: '<your-tos-url>',
//   // Privacy policy url.
//   privacyPolicyUrl: '<your-privacy-policy-url>',
// };

// ui.start('#firebaseui-auth-container', uiConfig);

export default function Profile() {
  return (
    <>
      <h1>Welcome to JOGANDAN</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </>
  );
}
