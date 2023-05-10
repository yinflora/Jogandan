import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'jogandan-2023.firebaseapp.com',
  projectId: 'jogandan-2023',
  storageBucket: 'jogandan-2023.appspot.com',
  messagingSenderId: '890420058309',
  appId: '1:890420058309:web:c7f6bb4d34943abc77b8ac',
  measurementId: 'G-80Q52MX1Q0',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

const USER_DEFAULT_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/userPhoto.png?alt=media&token=679fd51a-4928-4201-870e-1d9b2b592e3f';

async function signin() {
  try {
    const { user } = await signInWithPopup(auth, provider);
    const userInfo = await createUser(user);
    return userInfo;
  } catch (error) {
    console.error(error);
  }
}

async function signout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
}

async function nativeSignup(form) {
  try {
    const { name, email, password } = form;

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userData = await createUser(user, name);
    return userData;
  } catch (error) {
    console.error(error);
  }
}

async function nativeLogin(form) {
  try {
    const { email, password } = form;
    // const { user } = await signInWithEmailAndPassword(auth, email, password);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
  }
}

async function createUser(userAuth, name) {
  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const provider = userAuth.providerData[0].providerId;

    if (provider === 'password') {
      const { email, uid } = userAuth;

      try {
        const userData = {
          name,
          email,
          image: USER_DEFAULT_IMAGE,
          created: serverTimestamp(),
          uid,
        };
        await setDoc(userDocRef, userData);

        const boardDocId = await setFirstBoard(userAuth.uid);
        const boardId = localStorage.getItem(`${userAuth.uid}/boardId`);

        if (!boardId)
          localStorage.setItem(`${userAuth.uid}/boardId`, boardDocId);
        return userData;
      } catch (error) {
        console.log(`${error.message}: 建立本地使用者失敗`);
      }
    } else if (provider === 'google.com') {
      const { displayName, email, photoURL, uid } = userAuth;

      try {
        const googleUserData = {
          name: displayName,
          email,
          image: photoURL,
          created: serverTimestamp(),
          uid,
        };
        await setDoc(userDocRef, googleUserData);

        const boardDocId = await setFirstBoard(userAuth.uid);
        const boardId = localStorage.getItem(`${userAuth.uid}/boardId`);

        if (!boardId)
          localStorage.setItem(`${userAuth.uid}/boardId`, boardDocId);
        return googleUserData;
      } catch (error) {
        console.log(`${error.message}: 建立Google使用者失敗`);
      }
    }
  }

  console.log(userSnapshot.data());

  // return userDocRef;
  return userSnapshot.data();
}

async function getUser() {
  try {
    const userRef = doc(db, 'users', auth.lastNotifiedUid);
    const userDoc = await getDoc(userRef);
    return userDoc.data();
  } catch (error) {
    console.error(error);
  }
  return null;
}

async function updateUser(url) {
  try {
    const userRef = doc(db, 'users', auth.lastNotifiedUid);

    await updateDoc(userRef, {
      image: url,
    });
  } catch (error) {
    console.error(error);
  }
  return null;
}

async function uploadItems(form) {
  try {
    const { name, category, status, description, images } = form;
    const itemsRef = collection(db, 'users', auth.lastNotifiedUid, 'items');
    const { id } = await addDoc(itemsRef, {
      name,
      category,
      status,
      created: serverTimestamp(),
      description,
      images,
      processedDate: status === '已處理' ? serverTimestamp() : '',
    });

    const uploadedItemRef = doc(db, 'users', auth.lastNotifiedUid, 'items', id);

    await updateDoc(uploadedItemRef, {
      id,
    });

    return id;
  } catch (error) {
    console.error(error);
  }
  return null;
}

async function getProcessedItems(userId) {
  const itemsRef = collection(
    db,
    'users',
    // 'q1khIAOnt2ewvY4SQw1z65roVPD2',
    userId,
    'items'
  );
  const itemsQuery = query(itemsRef, where('status', '==', '已處理'));
  const items = [];

  const querySnapshot = await getDocs(itemsQuery);
  querySnapshot.forEach((document) => {
    items.push(document.data());
  });
  return items;
}

async function getItems(userId) {
  const itemsRef = collection(db, 'users', userId, 'items');
  const itemsQuery = query(itemsRef, orderBy('created', 'desc'));
  const items = [];

  const querySnapshot = await getDocs(itemsQuery);
  querySnapshot.forEach((document) => {
    items.push(document.data());
  });

  return items;
}

async function getItemById(userId, itemId) {
  const itemsRef = collection(db, 'users', userId, 'items');
  const itemsQuery = query(itemsRef, where('id', '==', itemId));
  const items = [];

  const querySnapshot = await getDocs(itemsQuery);

  querySnapshot.forEach((document) => {
    items.push(document.data());
  });
  return items;
}

async function updateItem(userId, itemId, itemRef) {
  try {
    const itemDocRef = doc(db, 'users', userId, 'items', itemId);
    const { images, name, category, status, description } = itemRef;
    await updateDoc(itemDocRef, {
      name,
      category,
      status,
      description,
      images,
      processedDate: status === '已處理' ? serverTimestamp() : '',
    });
    // alert('更新成功！'); //!記得在upload加回來
  } catch (e) {
    console.error('Error uploading item: ', e);
  }
  return null;
}

async function resetBoard(id) {
  try {
    const boardDocRef = doc(
      db,
      'users',
      'q1khIAOnt2ewvY4SQw1z65roVPD2',
      'visionBoards',
      id
    );
    await updateDoc(boardDocRef, {
      lines: deleteField(),
      shapes: deleteField(),
    });
    console.log('刪除成功');
  } catch (e) {
    console.error('Error uploading article: ', e);
  }
  return null;
}

async function getTemplate() {
  const TEMPLATE_ID = 'eDuLEGPS3NCJsyeIYzXl';
  const templatesRef = doc(db, 'templates', TEMPLATE_ID);
  const docSnap = await getDoc(templatesRef);
  return docSnap.data();
}

async function getBoard(userId, boardId) {
  const templatesRef = doc(db, 'users', userId, 'visionBoards', boardId);
  const docSnap = await getDoc(templatesRef);

  // console.log(docSnap.data());

  return docSnap.data();
}

async function setNewBoard(userId, boardData) {
  try {
    const userCollectionRef = collection(db, 'users', userId, 'visionBoards');

    const docRef = await addDoc(userCollectionRef, {
      data: boardData,
      lastUpdated: serverTimestamp(),
    });

    return docRef.id;
  } catch (e) {
    console.error('Error uploading article: ', e);
  }
  return null;
}

async function setFirstBoard(userId) {
  try {
    const templateData = await getTemplate();
    const userBoardRef = collection(db, 'users', userId, 'visionBoards');

    const docRef = await addDoc(userBoardRef, {
      data: templateData.template,
      lastUpdated: serverTimestamp(),
      isEdited: false,
    });

    return docRef.id;
  } catch (e) {
    console.error('設置初次的夢想版失敗: ', e);
  }
  return null;
}

async function saveBoard(userId, boardId, boardData, isEdited) {
  try {
    const boardDocRef = doc(db, 'users', userId, 'visionBoards', boardId);
    await updateDoc(boardDocRef, {
      data: boardData,
      lastUpdated: serverTimestamp(),
      isEdited,
    });
  } catch (e) {
    console.error('Error uploading items: ', e);
  }
}

export {
  storage,
  auth,
  signin,
  signout,
  nativeSignup,
  nativeLogin,
  getUser,
  updateUser,
  uploadItems,
  getProcessedItems,
  getItems,
  getItemById,
  updateItem,
  resetBoard,
  getTemplate,
  getBoard,
  setNewBoard,
  setFirstBoard,
  saveBoard,
};
