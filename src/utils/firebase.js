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
  updateDoc,
  arrayUnion,
  deleteField,
  arrayRemove,
  onSnapshot,
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
export const storage = getStorage(app);
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
        // period: { start: null, end: null },
        // processedItems: null,
      });
      console.log(`建立使用者-${displayName}成功`);
    } catch (error) {
      console.log(`${error.message}: 建立使用者失敗`);
    }
  }

  // 如果使用者存在直接回傳 userDocRef
  return userDocRef;
}

export async function uploadItems(userId, form) {
  try {
    const { name, category, status, description, images } = form;
    const itemsRef = collection(
      db,
      'users',
      // 'kyZjoKtIpCe0c3ZrItSubP8mAle2',
      userId,
      'items'
    );
    const docRef = await addDoc(itemsRef, {
      name,
      category,
      status,
      // joinGiveaway,
      created: serverTimestamp(),
      description,
      images,
      // isGifted: '',
      processedDate: status === '已處理' ? serverTimestamp() : '',
    });
    // console.log('Item uploaded with ID: ', docRef.id);

    const itemDocRef = doc(
      db,
      'users',
      // 'q1khIAOnt2ewvY4SQw1z65roVPD2',
      userId,
      'items',
      docRef.id
    );

    await updateDoc(itemDocRef, {
      id: docRef.id,
    });

    // alert('已成功加入！');
    return docRef.id;
  } catch (e) {
    console.error('Error uploading items: ', e);
  }
}

export async function getProcessedItems(userId) {
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

export async function getItems(userId) {
  const itemsRef = collection(
    db,
    'users',
    // 'q1khIAOnt2ewvY4SQw1z65roVPD2',
    userId,
    'items'
  );
  const itemsQuery = query(itemsRef);
  const items = [];

  const querySnapshot = await getDocs(itemsQuery);
  querySnapshot.forEach((document) => {
    items.push(document.data());
  });

  return items;
}

export async function getItemById(userId, itemId) {
  const itemsRef = collection(db, 'users', userId, 'items');
  const itemsQuery = query(itemsRef, where('id', '==', itemId));
  const items = [];

  const querySnapshot = await getDocs(itemsQuery);

  querySnapshot.forEach((document) => {
    items.push(document.data());
  });
  return items;
}

export async function updateItem(userId, itemId, itemRef) {
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

export async function getFilteredItems(field, value) {
  const itemsRef = collection(
    db,
    'users',
    'q1khIAOnt2ewvY4SQw1z65roVPD2',
    'items'
  );
  const itemsQuery = query(itemsRef, where(field, '==', value));
  const items = [];

  const querySnapshot = await getDocs(itemsQuery);
  querySnapshot.forEach((document) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, ' => ', doc.data());
    items.push(document.data());
  });
  return items;
}

export async function createBoard() {
  try {
    const userCollectionRef = collection(
      db,
      'users',
      'q1khIAOnt2ewvY4SQw1z65roVPD2',
      'visionBoards'
    );
    const docRef = await addDoc(
      userCollectionRef,
      {
        created: serverTimestamp(),
        lines: [],
        shapes: [],
      },
      { merge: true }
    );
    // console.log('Boards uploaded with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error uploading article: ', e);
  }
  return null;
}

export async function resetBoard(id) {
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

export async function updateLines(id, lineRef) {
  try {
    const boardDocRef = doc(
      db,
      'users',
      'q1khIAOnt2ewvY4SQw1z65roVPD2',
      'visionBoards',
      id
    );
    await updateDoc(boardDocRef, {
      lines: arrayUnion({
        points: lineRef,
      }),
      lastUpdated: serverTimestamp(),
    });
    console.log('更新線條成功');
  } catch (e) {
    console.error('Error uploading article: ', e);
  }
  return null;
}

export async function updateShapes(id, shapeRef) {
  try {
    const boardDocRef = doc(
      db,
      'users',
      'q1khIAOnt2ewvY4SQw1z65roVPD2',
      'visionBoards',
      id
    );
    await updateDoc(boardDocRef, {
      shapes: arrayUnion(shapeRef),
      lastUpdated: serverTimestamp(),
    });
    console.log('更新形狀成功');
  } catch (e) {
    console.error('Error uploading article: ', e);
  }
  return null;
}

// export async function getBoard(id) {
//   const boardDocRef = doc(
//     db,
//     'users',
//     'q1khIAOnt2ewvY4SQw1z65roVPD2',
//     'visionBoards',
//     id
//   );

//   const boardSnapshot = await getDoc(boardDocRef);
//   const boardData = boardSnapshot.data();
//   return boardData;
// }

export async function deleteSelectedShapes(id, shapeRef) {
  try {
    const boardDocRef = doc(
      db,
      'users',
      'q1khIAOnt2ewvY4SQw1z65roVPD2',
      'visionBoards',
      id
    );
    await updateDoc(boardDocRef, {
      shapes: arrayRemove(shapeRef),
      lastUpdated: serverTimestamp(),
    });
    console.log('刪除指定形狀成功');
  } catch (e) {
    console.error('Error uploading article: ', e);
  }
  return null;
}

export function getLiveBoard(id, setBoardData) {
  const boardDocRef = doc(
    db,
    'users',
    'q1khIAOnt2ewvY4SQw1z65roVPD2',
    'visionBoards',
    id
  );

  return onSnapshot(boardDocRef, (document) => {
    const boardData = document.data();
    // console.log(boardData.lines, boardData.shapes);
    setBoardData({
      lines: boardData.lines || [],
      shapes: boardData.shapes || [],
    });
  });
}

export async function uploadTemplate(template) {
  try {
    const templatesRef = collection(db, 'templates');
    const docRef = await addDoc(templatesRef, {
      template,
    });

    const templateDocRef = doc(db, 'templates', docRef.id);

    await updateDoc(templateDocRef, {
      id: docRef.id,
    });

    alert('已成功加入！');
  } catch (e) {
    console.error('Error uploading items: ', e);
  }
}

export async function getTemplate(templateId) {
  //Todo: 記得換成活的id
  const templatesRef = doc(db, 'templates', templateId);
  const docSnap = await getDoc(templatesRef);

  return docSnap.data();
}

export async function getBoard(userId, boardId) {
  const templatesRef = doc(db, 'users', userId, 'visionBoards', boardId);
  const docSnap = await getDoc(templatesRef);

  return docSnap.data();
}

export async function setNewBoard(userId, boardData) {
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

export async function saveBoard(userId, boardId, boardData, isEdited) {
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
