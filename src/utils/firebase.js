import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  getDoc,
  getDocs,
  setDoc,
  collection,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

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

//Auth
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore(app);

export async function createUserDocumentFromAuth(userAuth) {
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
      console.log('建立使用者成功' + displayName);
    } catch (error) {
      console.log('建立使用者失敗' + error.message);
    }
  }

  // 如果使用者存在直接回傳 userDocRef
  return userDocRef;
}

export async function getProcessedItems() {
  const itemsRef = collection(db, 'users', '07WrsXZ2x794a2FJFkPe', 'items');
  // const itemsQuery = query(itemsRef, where('status', '==', '已處理'));
  const itemsQuery = query(itemsRef, where('status', '==', '保留'));

  const querySnapshot = await getDocs(itemsQuery);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data());
  });
}
