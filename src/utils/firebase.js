import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import {
  getFirestore,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  collection,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBKj7wtGKt8M2s6uaonIvtRHUXvTgmCAxM',
  authDomain: 'jogandan-2023.firebaseapp.com',
  projectId: 'jogandan-2023',
  storageBucket: 'jogandan-2023.appspot.com',
  messagingSenderId: '890420058309',
  appId: '1:890420058309:web:c7f6bb4d34943abc77b8ac',
  measurementId: 'G-80Q52MX1Q0',
};

const app = initializeApp(firebaseConfig);

// Firebase storage reference
export const storage = getStorage(app);

//Auth
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});
export const auth = getAuth();

export async function signin() {
  const response = await signInWithPopup(auth, provider);
  const userProfile = response.user;
  await createUser(userProfile);
  return userProfile;
}

export function signout() {
  signOut(auth)
    .then(() => {
      console.log('登出成功');
    })
    .catch((error) => {
      console.error(error);
    });
}

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore(app);

async function createUser(userAuth) {
  // 建立一個 document 實例
  const userDocRef = doc(db, 'users', userAuth.uid);

  // 將 document 實例的資料取出來
  const userSnapshot = await getDoc(userDocRef);
  console.log(userSnapshot);
  console.log(userSnapshot.exists());

  // 如果使用者不存在
  if (!userSnapshot.exists()) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = new Date();
    // 就把資料寫進 Firestore
    try {
      await setDoc(userDocRef, {
        name: displayName,
        email,
        image: photoURL,
        createdAt,
        period: { start: null, end: null },
        processedItems: null,
      });
      console.log(`建立使用者-${displayName}成功`);
    } catch (error) {
      console.log(`${error.message}: 建立使用者失敗`);
    }
  }

  // 如果使用者存在直接回傳 userDocRef
  return userDocRef;
}

// export async function createUserDocumentFromAuth(userAuth) {
//   // 建立一個 document 實例
//   const userDocRef = doc(db, 'users', userAuth.uid);

//   // 將 document 實例的資料取出來
//   const userSnapshot = await getDoc(userDocRef);
//   console.log(userSnapshot);
//   console.log(userSnapshot.exists());

//   // 如果使用者不存在
//   if (!userSnapshot.exists()) {
//     const { displayName, email, photoURL } = userAuth;
//     const createdAt = new Date();
//     // 就把資料寫進 Firestore
//     try {
//       await setDoc(userDocRef, {
//         name: displayName,
//         email,
//         image: photoURL,
//         createdAt,
//         period: { start: null, end: null },
//         processedItems: null,
//       });
//       console.log('建立使用者成功' + displayName);
//     } catch (error) {
//       console.log('建立使用者失敗' + error.message);
//     }
//   }

//   // 如果使用者存在直接回傳 userDocRef
//   return userDocRef;
// }

export async function uploadItems(id, form) {
  try {
    const { name, category, status, joinGiveaway, description, images } = form;
    const itemDocRef = collection(
      db,
      'users',
      'q1khIAOnt2ewvY4SQw1z65roVPD2',
      'items'
    );
    const docRef = await addDoc(itemDocRef, {
      name,
      category,
      status,
      joinGiveaway,
      created: serverTimestamp(),
      description,
      images: images,
      isGifted: '',
      processedDate: '',
    });
    console.log('Item uploaded with ID: ', docRef.id);
  } catch (e) {
    console.error('Error uploading article: ', e);
  }
}

export async function getProcessedItems() {
  const itemsRef = collection(
    db,
    'users',
    'q1khIAOnt2ewvY4SQw1z65roVPD2',
    'items'
  );
  const itemsQuery = query(itemsRef, where('status', '==', '已處理'));
  // const itemsQuery = query(itemsRef, where('status', '==', '保留'));
  const items = [];

  const querySnapshot = await getDocs(itemsQuery);
  querySnapshot.forEach((document) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, ' => ', doc.data());
    items.push(document.data());
  });
  return items;
}
